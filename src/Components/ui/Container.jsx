/**
 * Centres content and gives every section the same side padding.
 * WHY: before, each section picked its own padding (px-6, px-10, lg:px-16,
 * xl:px-24...), so edges didn't line up as you scrolled.
 */
function Container({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${className}`} {...props}>
      {children}
    </Tag>
  );
}

export default Container;
