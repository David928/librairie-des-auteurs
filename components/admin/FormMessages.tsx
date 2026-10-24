export function FormError({ error }: { error: string | null | undefined }) {
  if (!error) return null;
  return (
    <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
      {error}
    </p>
  );
}

export function FormSuccess({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
      {message}
    </p>
  );
}
