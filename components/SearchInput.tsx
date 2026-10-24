export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-light"
      >
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-ink/15 bg-white/90 py-2.5 pl-10 pr-4 text-sm text-ink outline-none focus:border-accent"
      />
    </div>
  );
}

export function FilterChips({
  options,
  value,
  onChange,
  allLabel = "Tous",
}: {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  allLabel?: string;
}) {
  if (options.length === 0) return null;

  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-accent text-white"
          : "border border-ink/15 bg-cream-light text-ink-light"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
      {chip(allLabel, value === null, () => onChange(null))}
      {options.map((option) =>
        chip(option, value === option, () => onChange(option))
      )}
    </div>
  );
}
