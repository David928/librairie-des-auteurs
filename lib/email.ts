import { SITE } from "@/lib/site";

type EmailResult = { sent: boolean; error?: string };

async function sendEmail({
  to,
  toName,
  subject,
  html,
}: {
  to: string;
  toName: string;
  subject: string;
  html: string;
}): Promise<EmailResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { sent: false, error: "BREVO_API_KEY non configurée." };
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: SITE.emailFrom, name: SITE.name },
      to: [{ email: to, name: toName }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return { sent: false, error: `Brevo (${response.status}): ${body}` };
  }

  return { sent: true };
}

function layout(content: string) {
  return `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #2f2a26;">
      <p style="font-size: 22px; font-weight: bold; color: #8c2f39; margin-bottom: 24px;">${SITE.name}</p>
      ${content}
    </div>
  `;
}

function credentials(to: string, password: string, passwordLabel: string) {
  const loginUrl = `${SITE.url}/admin/login`;
  return `
    <table style="margin: 16px 0; font-size: 14px; font-family: sans-serif;">
      <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">Email</td><td>${to}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; font-weight: bold;">${passwordLabel}</td><td style="font-family: monospace;">${password}</td></tr>
    </table>
    <p>
      <a href="${loginUrl}" style="display: inline-block; background: #8c2f39; color: #faf6ee; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-family: sans-serif;">
        Se connecter
      </a>
    </p>
    <p style="font-size: 13px; color: #6a5f55;">
      Une fois connecté·e, pensez à changer ce mot de passe depuis votre
      tableau de bord (bouton « Changer mon mot de passe »).
    </p>
  `;
}

export async function sendAuthorWelcomeEmail({
  to,
  authorName,
  password,
  slug,
}: {
  to: string;
  authorName: string;
  password: string;
  slug: string;
}): Promise<EmailResult> {
  const ficheUrl = `${SITE.url}/auteurs/${slug}`;
  return sendEmail({
    to,
    toName: authorName,
    subject: `Votre accès à ${SITE.name}`,
    html: layout(`
      <h1 style="font-size: 20px;">Bienvenue, ${authorName} !</h1>
      <p>Votre fiche auteur a été créée sur l'application de ${SITE.name}.
      Vous pouvez y présenter vos livres, vos séances de dédicace et vos
      actualités. Voici vos identifiants :</p>
      ${credentials(to, password, "Mot de passe provisoire")}
      <p style="font-size: 13px; color: #6a5f55;">
        Votre fiche publique : <a href="${ficheUrl}">${ficheUrl}</a>
      </p>
    `),
  });
}

export async function sendAuthorPasswordResetEmail({
  to,
  authorName,
  password,
}: {
  to: string;
  authorName: string;
  password: string;
}): Promise<EmailResult> {
  return sendEmail({
    to,
    toName: authorName,
    subject: `Votre nouveau mot de passe — ${SITE.name}`,
    html: layout(`
      <h1 style="font-size: 20px;">Bonjour ${authorName},</h1>
      <p>Votre mot de passe vient d'être réinitialisé. Voici vos nouveaux identifiants :</p>
      ${credentials(to, password, "Nouveau mot de passe")}
    `),
  });
}
