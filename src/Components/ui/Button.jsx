import { Link } from "react-router-dom";

/**
 * One button style for the whole site.
 *
 * It renders the right HTML element for the job:
 *   - `to="/page"`   -> a React Router <Link> (moves to another page in the app)
 *   - `href="#id"`   -> a normal <a> (jumps on the same page / external site)
 *   - neither         -> a <button> (runs an action, e.g. submit a form)
 * WHY: screen readers and keyboards treat links and buttons differently, so
 * "go somewhere" should be a link and "do something" should be a button.
 */
const variants = {
  // Bright lime: the main call to action. Use at most once or twice per screen.
  primary:
    "bg-volt text-forest-950 hover:bg-volt-soft shadow-[0_10px_30px_-10px_rgb(181_240_122/0.7)]",
  // Deep green: strong action on light backgrounds.
  dark: "bg-forest-900 text-white hover:bg-forest-700",
  // Outline on light backgrounds.
  outline: "border border-forest-900/15 bg-white text-forest-900 hover:border-forest-900/35",
  // Outline on dark backgrounds.
  ghost: "border border-white/20 text-white hover:bg-white/10",
};

const sizes = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.95rem]",
};

function buttonClasses({ variant = "primary", size = "md", className = "" } = {}) {
  return [
    "group inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold",
    "transition-[background-color,border-color,transform,box-shadow] duration-200",
    "hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0",
    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-forest-600",
    "disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  ].join(" ");
}

function Button({ to, href, variant, size, className, children, ...props }) {
  const classes = buttonClasses({ variant, size, className });

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
