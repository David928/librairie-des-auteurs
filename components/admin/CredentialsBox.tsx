export function CredentialsBox({
  credentials,
}: {
  credentials: {
    email: string;
    password: string;
    emailSent: boolean;
    emailError?: string;
  };
}) {
  return (
    <div className="rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm">
      {credentials.emailSent ? (
        <p className="text-ink-light">
          Un email avec les identifiants a été envoyé à{" "}
          <span className="font-medium">{credentials.email}</span>. Ils sont
          aussi rappelés ci-dessous au cas où.
        </p>
      ) : (
        <p className="text-ink-light">
          L&apos;email automatique n&apos;a pas pu être envoyé
          {credentials.emailError ? ` (${credentials.emailError})` : ""}.
          Communiquez ces identifiants à l&apos;auteur vous-même — le mot de
          passe ne sera plus jamais affiché.
        </p>
      )}
      <dl className="mt-3 space-y-1">
        <div className="flex gap-2">
          <dt className="w-28 shrink-0 font-medium text-ink">Email</dt>
          <dd className="min-w-0 break-all font-mono text-ink">
            {credentials.email}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-28 shrink-0 font-medium text-ink">Mot de passe</dt>
          <dd className="min-w-0 break-all font-mono text-ink">
            {credentials.password}
          </dd>
        </div>
      </dl>
    </div>
  );
}
