interface SectionHeaderProps {
  label: string;
  heading: string;
  centered?: boolean;
}

export function SectionHeader({ label, heading, centered = false }: SectionHeaderProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        {label}
      </span>
      <h2 className="mt-2 font-display text-3xl font-semibold text-rich-black md:text-4xl">
        {heading}
      </h2>
    </div>
  );
}
