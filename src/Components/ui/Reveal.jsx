import { motion, useReducedMotion } from "framer-motion";

/**
 * Fades its children up gently when they scroll into view.
 *
 * WHY `useReducedMotion`: some people turn on "reduce motion" in their phone
 * or computer settings because animation makes them feel unwell. When that
 * setting is on, we simply show the content with no movement.
 *
 * `viewport={{ once: true }}` means it animates the first time only, so
 * scrolling up and down doesn't keep re-triggering it.
 */
function Reveal({ children, delay = 0, className = "", as = "div" }) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
