export default function AnswerOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-5 py-4 border rounded-[6px] transition-colors duration-150"
      style={{
        borderColor: selected ? "var(--color-violet)" : "var(--color-whisper)",
        backgroundColor: selected ? "var(--color-glow)" : "var(--color-canvas)",
        color: selected ? "var(--color-ink)" : "var(--color-graphite)",
      }}
    >
      <span className="text-[15px]">{label}</span>
    </button>
  );
}
