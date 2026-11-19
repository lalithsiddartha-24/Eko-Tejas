import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

// Splits "10,000+" into ["", "10,000", "+"], "3.5 kW" into ["", "3.5", " kW"],
// and "65 expert mechanics" into ["", "65", " expert mechanics"].
const NUMBER_PATTERN = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/s;

function parse(text) {
  const match = String(text).match(NUMBER_PATTERN);
  if (!match) return null;
  const [, prefix, number, suffix] = match;
  return {
    prefix,
    suffix,
    target: Number(number.replace(/,/g, "")),
    decimals: number.split(".")[1]?.length ?? 0,
    commas: number.includes(","),
  };
}

function format(parts, value) {
  const number = parts.commas
    ? value.toLocaleString("en-IN", {
        minimumFractionDigits: parts.decimals,
        maximumFractionDigits: parts.decimals,
      })
    : value.toFixed(parts.decimals);
  return `${parts.prefix}${number}${parts.suffix}`;
}

/**
 * Counts a number up from 0 the first time it scrolls into view, like an
 * odometer: "10,000+" ticks 0 → 10,000+, "3.5 kW" ticks 0.0 → 3.5 kW.
 * Text with no number in it is shown as it is.
 *
 * HOW it stays fast: the number changes ~60 times a second. Doing that
 * with React state would re-render the component 60 times a second, so
 * instead framer-motion's `animate()` writes straight into the element
 * through a ref, and React renders only once.
 *
 * Accessibility: screen readers read the real value from the `sr-only`
 * copy, and the ticking copy is `aria-hidden`, so they never hear
 * "0… 1,250… 4,800…".
 */
function CountUp({ value, duration = 1.6, className = "" }) {
  const text = String(value);
  const parts = parse(text);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const animated = Boolean(parts) && !reduceMotion;

  useEffect(() => {
    const target = parse(text);
    if (!target || reduceMotion || !inView) return undefined;
    const controls = animate(0, target.target, {
      duration,
      ease: [0.22, 1, 0.36, 1], // fast at first, then gently settles
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = format(target, latest);
      },
    });
    return () => controls.stop();
  }, [text, inView, reduceMotion, duration]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {/* tabular-nums: every digit is the same width, so the text doesn't wobble while counting. */}
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {animated ? format(parts, 0) : text}
      </span>
    </span>
  );
}

export default CountUp;
