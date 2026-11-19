/**
 * The small label + big title + intro text that opens every section.
 *
 * WHY a component: repeating the same heading pattern everywhere is what
 * makes a site feel "designed". Before, each section styled its own label
 * (some had typos like `tracking[0.3em]`), so they never quite matched.
 *
 * `tone="dark"` is for sections with a dark background (white text).
 */
function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  tone = "light",
  align = "left",
  as: Tag = "h2",
  className = "",
  children,
}) {
  const dark = tone === "dark";
  const centered = align === "center";

  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && (
        <p
          className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] ${
            dark ? "text-volt" : "text-forest-600"
          }`}
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
          {eyebrow}
        </p>
      )}
      <Tag
        className={`mt-4 text-balance font-display text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-[3.25rem] ${
          dark ? "text-white" : "text-forest-900"
        }`}
      >
        {title}
        {accent && (
          <span className={`block ${dark ? "text-sage-300" : "text-muted/80"}`}>{accent}</span>
        )}
      </Tag>
      {description && (
        <p
          className={`mt-5 text-pretty text-base leading-7 sm:text-lg sm:leading-8 ${
            dark ? "text-white/65" : "text-muted"
          } ${centered ? "mx-auto" : ""} max-w-xl`}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

export default SectionHeading;
