/**
 * Sets the browser tab title for the current page.
 *
 * HOW: React 19 has a built-in feature: a <title> rendered anywhere in a
 * component is automatically moved into the page's <head>. When you go to
 * another page, this component unmounts and the new page's <PageMeta>
 * takes over, so the tab title always matches the page.
 *
 * WHY it matters: the tab title is what people see in their tabs,
 * bookmarks and history, and what Google shows as the link text.
 *
 * (The page description lives once in index.html. React would ADD a second
 * <meta name="description"> instead of replacing it, and duplicates can
 * confuse search engines, so this component only handles the title.)
 */
const SITE = "Eko Tejas";

function PageMeta({ title }) {
  return <title>{title ? `${title} | ${SITE}` : `${SITE} | Electric Scooters & Three-Wheelers`}</title>;
}

export default PageMeta;
