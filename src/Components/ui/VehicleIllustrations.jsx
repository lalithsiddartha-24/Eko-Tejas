/* Simple line drawings. `currentColor` lets Tailwind's text colour paint them. */
export function ScooterIllustration({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 72"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="24" cy="56" r="11" />
      <circle cx="24" cy="56" r="3" />
      <circle cx="96" cy="56" r="11" />
      <circle cx="96" cy="56" r="3" />
      <path d="M12 46c0-9 7-15 18-15h28l5 13" />
      <path d="M28 27h26" strokeWidth="4.5" />
      <path d="M36 47h34c6 0 10-4 12-10l5-21" />
      <path d="M82 13h12" strokeWidth="3" />
      <path d="M87 18l9 38" />
      <path d="M90 22c3 1 5 3 6 6" stroke="var(--color-forest-600)" />
    </svg>
  );
}

export function AutoIllustration({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 72"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="30" cy="56" r="9" />
      <circle cx="30" cy="56" r="2.5" />
      <circle cx="94" cy="56" r="9" />
      <circle cx="94" cy="56" r="2.5" />
      <path d="M18 50V22c0-7 5-12 12-12h46c10 0 18 7 22 18l6 16v6" />
      <path d="M12 50h9m18 0h46m18 0h5" />
      <path d="M78 10l12 26H48V10" />
      <path d="M18 36h22" />
      <path d="M100 32h6" strokeWidth="3" stroke="var(--color-forest-600)" />
    </svg>
  );
}

