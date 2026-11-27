import Container from "./Container";
import LineReveal from "./LineReveal";

/**
 * The opening of simple content pages (About, Media): a small label, a
 * big two-line title that slides up line by line, and a short intro.
 *
 * WHY a shared component: both pages should open the same way, the same
 * as the rest of the site (red dot label, two-tone title). If the style
 * changes, it changes here once.
 */
function PageIntro({ eyebrow, title, accent, description }) {
  return (
    <header className="bg-[linear-gradient(180deg,#ffffff_0%,var(--color-mint-50)_100%)] pb-14 pt-14 sm:pb-20 sm:pt-20">
      <Container>
        <p className="flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl text-balance font-display text-[2.6rem] font-semibold leading-[1] tracking-[-0.05em] text-forest-950 sm:text-6xl lg:text-7xl">
          <LineReveal lines={[{ text: title }, { text: accent, className: "text-forest-600" }]} />
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{description}</p>
        )}
      </Container>
    </header>
  );
}

export default PageIntro;
