import { motion, useReducedMotion } from "framer-motion";

/**
 * Text that comes into focus letter by letter, like a camera lens finding
 * its subject: each letter starts blurred, faint and slightly low, then
 * sharpens into place, 0.05s after the letter before it.
 *
 * WHY it suits the 3-wheeler header: the photo behind it is a motion-blur
 * shot, so "blur → sharp" feels like part of the same picture.
 *
 * HOW: the word is split into letters, and each letter is a motion.span
 * animating `filter: blur(...)`, `opacity` and `y`. A `delay` that grows
 * with the letter's position creates the left-to-right wave.
 *
 * Accessibility: screen readers get the whole word once from the sr-only
 * copy; the separate animated letters are aria-hidden (otherwise some
 * readers would spell it out "b, u, s...").
 */
function FocusInText({ text, delay = 0.25 }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return text;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block whitespace-nowrap">
        {Array.from(text).map((letter, index) => (
          <motion.span
            key={`${letter}-${index}`}
            className="inline-block"
            initial={{ opacity: 0, filter: "blur(14px)", y: "0.18em" }}
            animate={{ opacity: 1, filter: "blur(0px)", y: "0em" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: delay + index * 0.05 }}
          >
            {/* A plain space would collapse inside inline-block, so use a non-breaking one. */}
            {letter === " " ? " " : letter}
          </motion.span>
        ))}
      </span>
    </>
  );
}

export default FocusInText;
