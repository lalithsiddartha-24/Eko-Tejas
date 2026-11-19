import { motion, useReducedMotion } from "framer-motion";

/**
 * The small label + big title + intro text that opens every section.
 *
 * WHY a component: repeating the same heading pattern everywhere is what
 * makes a site feel "designed". Before, each section styled its own label
 * (some had typos like `tracking[0.3em]`), so they never quite matched.
 *
 * `tone="dark"` is for sections with a dark background (white text).
 *
 * The title animates in word by word when it scrolls into view (see
 * <AnimatedWords> below).
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
  const reduceMotion = useReducedMotion();
  const accentClass = `block ${dark ? "text-sage-300" : "text-muted/80"}`;

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
        {reduceMotion ? (
          <>
            {title}
            {/* The space matters: without it screen readers read "everyjourney". */}
            {accent && " "}
            {accent && <span className={accentClass}>{accent}</span>}
          </>
        ) : (
          // One parent controls the timing, so the accent line's words carry
          // on the same wave right after the title's last word.
          <motion.span
            className="block"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          >
            <AnimatedWords text={title} />
            {accent && " "}
            {accent && (
              <span className={accentClass}>
                <AnimatedWords text={accent} />
              </span>
            )}
          </motion.span>
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

/*
 * WORD-BY-WORD REVEAL
 * Each word sits in its own little "window" (`overflow-hidden`). The word
 * starts pushed down below the window (y: 110%), so it's hidden, then
 * slides up into view. The parent's `staggerChildren` starts each word
 * 0.07s after the previous one, which creates the wave.
 *
 * WHY variants ("hidden" / "show"): the parent just says "go to show", and
 * every word below it follows. That's how one trigger drives many words.
 * The padding/negative margin gives letters like "g" and "y" room so the
 * window doesn't clip their tails.
 */
const wordVariants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function AnimatedWords({ text }) {
  if (typeof text !== "string") return text;
  const words = text.split(" ");
  return words.map((word, index) => (
    <span key={`${word}-${index}`}>
      <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
        <motion.span className="inline-block" variants={wordVariants}>
          {word}
        </motion.span>
      </span>
      {/* Keep the normal space between words so lines can still wrap. */}
      {index < words.length - 1 && " "}
    </span>
  ));
}

export default SectionHeading;
