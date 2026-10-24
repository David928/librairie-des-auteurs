"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession, requireSuperAdmin } from "@/lib/auth";
import { checked, text } from "@/lib/form-data";
import { slugify } from "@/lib/slugify";
import { generatePassword } from "@/lib/generate-password";
import {
  sendAuthorPasswordResetEmail,
  sendAuthorWelcomeEmail,
} from "@/lib/email";
import { revalidateCatalog } from "@/lib/revalidate";

type Credentials = {
  email: string;
  password: string;
  emailSent: boolean;
  emailError?: string;
};

/**
 * Crée un compte de connexion et le relie à la fiche auteur. En cas d'échec
 * après la création du compte, le compte est supprimé (pas de compte orphelin).
 */
async function createLoginForAuthor(
  author: { id: string; name: string; slug: string },
  email: string
): Promise<Credentials> {
  const admin = createAdminClient();
  const password = generatePassword();

  const { data: userData, error: userError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
  if (userError || !userData.user) {
    throw new Error(
      userError?.message === "A user with this email address has already been registered"
        ? "Un compte existe déjà avec cet email."
        : (userError?.message ?? "Impossible de créer le compte.")
    );
  }

  const { error: profileError } = await admin
    .from("profiles")
    .insert({ id: userData.user.id, author_id: author.id });
  if (profileError) {
    await admin.auth.admin.deleteUser(userData.user.id).catch(() => {});
    throw new Error(profileError.message);
  }

  const emailResult = await sendAuthorWelcomeEmail({
    to: email,
    authorName: author.name,
    password,
    slug: author.slug,
  });

  return {
    email,
    password,
    emailSent: emailResult.sent,
    emailError: emailResult.error,
  };
}

export type CreateAuthorState = {
  error?: string;
  success?: {
    id: string;
    name: string;
    slug: string;
    credentials?: Credentials;
  };
};

export async function createAuthor(
  _prevState: CreateAuthorState,
  formData: FormData
): Promise<CreateAuthorState> {
  const session = await getSession();
  if (!session?.superAdmin) return { error: "Accès refusé." };

  const name = text(formData, "name");
  if (!name) return { error: "Le nom est obligatoire." };

  const slug = slugify(text(formData, "slug") ?? name);
  if (!slug) {
    return { error: "Impossible de générer un identifiant à partir du nom." };
  }
  const email = text(formData, "email")?.toLowerCase() ?? null;

  const admin = createAdminClient();
  const { data: author, error } = await admin
    .from("authors")
    .insert({
      slug,
      name,
      tagline: text(formData, "tagline"),
      is_local: checked(formData, "is_local"),
    })
    .select("id, name, slug")
    .single();

  if (error || !author) {
    return {
      error:
        error?.code === "23505"
          ? "Cet identifiant est déjà utilisé par un autre auteur."
          : (error?.message ?? "Impossible de créer la fiche auteur."),
    };
  }

  revalidateCatalog();

  if (!email) {
    return { success: { id: author.id, name, slug } };
  }

  try {
    const credentials = await createLoginForAuthor(author, email);
    return { success: { id: author.id, name, slug, credentials } };
  } catch (err) {
    // La fiche reste créée : le compte pourra être ajouté depuis sa page.
    return {
      error: `Fiche créée, mais le compte n'a pas pu être créé : ${
        err instanceof Error ? err.message : "erreur inconnue"
      }. Vous pouvez réessayer depuis la fiche de l'auteur.`,
    };
  }
}

export type AccountState = {
  error?: string;
  success?: Credentials;
};

/** Ajoute un compte de connexion à un auteur qui n'en a pas encore. */
export async function createAuthorAccount(
  _prevState: AccountState,
  formData: FormData
): Promise<AccountState> {
  const session = await getSession();
  if (!session?.superAdmin) return { error: "Accès refusé." };

  const authorId = String(formData.get("authorId") ?? "");
  const email = text(formData, "email")?.toLowerCase();
  if (!email) return { error: "L'email est obligatoire." };

  const admin = createAdminClient();
  const { data: author } = await admin
    .from("authors")
    .select("id, name, slug")
    .eq("id", authorId)
    .maybeSingle();
  if (!author) return { error: "Auteur introuvable." };

  try {
    return { success: await createLoginForAuthor(author, email) };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Une erreur est survenue.",
    };
  }
}

export type ResetPasswordState = AccountState;

export async function resetAuthorPassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const session = await getSession();
  if (!session?.superAdmin) return { error: "Accès refusé." };

  const authorId = String(formData.get("authorId") ?? "");
  const admin = createAdminClient();

  const [{ data: author }, { data: profile }] = await Promise.all([
    admin.from("authors").select("name").eq("id", authorId).maybeSingle(),
    admin.from("profiles").select("id").eq("author_id", authorId).maybeSingle(),
  ]);
  if (!author || !profile) {
    return { error: "Aucun compte de connexion trouvé pour cet auteur." };
  }

  const { data: userData } = await admin.auth.admin.getUserById(profile.id);
  const email = userData.user?.email;
  if (!email) return { error: "Ce compte n'a pas d'email." };

  const password = generatePassword();
  const { error } = await admin.auth.admin.updateUserById(profile.id, {
    password,
  });
  if (error) return { error: error.message };

  const emailResult = await sendAuthorPasswordResetEmail({
    to: email,
    authorName: author.name,
    password,
  });

  return {
    success: {
      email,
      password,
      emailSent: emailResult.sent,
      emailError: emailResult.error,
    },
  };
}

export async function deleteAuthor(authorId: string) {
  await requireSuperAdmin();

  const admin = createAdminClient();

  // Le compte de connexion n'est pas supprimé par la cascade (seule la ligne
  // profiles l'est) : on le récupère avant de supprimer la fiche.
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("author_id", authorId)
    .maybeSingle();

  const { error } = await admin.from("authors").delete().eq("id", authorId);
  if (error) throw new Error(error.message);

  if (profile) {
    await admin.auth.admin.deleteUser(profile.id).catch(() => {});
  }

  revalidateCatalog();
  redirect("/admin/auteurs");
}
