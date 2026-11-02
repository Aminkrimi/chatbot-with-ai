interface SuggestionChipProps {
  text: string;
  onSelect: (text: string) => void;
}

export function SuggestionChip({ text, onSelect }: SuggestionChipProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(text)}
      className="rounded-xl border border-border bg-surface px-4 py-3 text-start text-sm leading-7 text-muted transition-colors hover:border-border-strong hover:text-fg"
    >
      {text}
    </button>
  );
}
