import { motion, useReducedMotion } from "framer-motion";
import { Fragment } from "react";

/**
 * Lines of a heading slide up into view, one after another, from behind an
 * invisible edge. It's a classic editorial effect: calm, quick, and it
 * moves whole lines instead of individual letters, so it doesn't feel
 * like a flashy template effect.
 *
 * HOW: each line sits in its own `overflow-hidden` box (the "edge"). The
 * line inside starts pushed down below the box (y: 105%), so it's hidden,
 * then slides up to 0. Each next line starts 0.12s later.
 * The small padding/negative margin gives letters like "g" and "y" room so
 * the box doesn't clip their tails.
 *
 * `lines` is a list like [{ text: "Ride smart." }, { text: "Ride electric.", className: "..." }].
 */
function LineReveal({ lines, delay = 0.15 }) {
  const reduceMotion = useReducedMotion();

  return lines.map((line, index) => (
    <Fragment key={line.text}>
      {/* A space between lines: invisible (each line is its own block), but
          without it screen readers read "smart.Ride" as one word. */}
      {index > 0 && " "}
    <span className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
      {reduceMotion ? (
        <span className={`block ${line.className || ""}`}>{line.text}</span>
      ) : (
        <motion.span
          className={`block ${line.className || ""}`}
          initial={{ y: "105%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay + index * 0.12 }}
        >
          {line.text}
        </motion.span>
      )}
    </span>
    </Fragment>
  ));
}

export default LineReveal;
