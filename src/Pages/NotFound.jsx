import { ArrowRight, Bike, Home, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import PageMeta from "../Components/PageMeta";
import Button from "../Components/ui/Button";
import Container from "../Components/ui/Container";

const shortcuts = [
  { to: "/twowheelers", icon: Bike, title: "Electric scooters", text: "Browse every 2-wheeler" },
  { to: "/vehicles", icon: Truck, title: "Electric 3-wheelers", text: "Cargo and passenger models" },
];

/**
 * Shown for any address that doesn't exist (a typo, an old link...).
 *
 * WHY not just redirect home (as before): a silent jump to the home page
 * is confusing, because people think the link "worked" but landed in the
 * wrong place. A clear "page not found" message, plus the two places
 * they most likely wanted, gets them back on track in one click.
 */
function NotFound() {
  return (
    <main className="py-20 sm:py-28">
      <PageMeta title="Page not found" />
      <Container className="flex flex-col items-center text-center">
        {/*
          A huge, very faint "404" in the headline font, with the real headline
          overlapping its lower half. Pure typography, no clip-art: the same
          quiet, editorial style as the rest of the site.
        */}
        <p
          aria-hidden="true"
          className="select-none font-display text-[9rem] font-semibold leading-none tracking-[-0.08em] text-forest-950/[0.06] sm:text-[14rem] lg:text-[17rem]"
        >
          404
        </p>
        <h1 className="-mt-10 font-display sm:-mt-16 lg:-mt-20 text-4xl font-semibold tracking-[-0.045em] text-forest-950 sm:text-6xl">
          Looks like a wrong turn.
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-muted sm:text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Here are some places to go instead.
        </p>

        <div className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
          {shortcuts.map(({ to, icon: Icon, title, text }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 rounded-2xl border border-forest-900/8 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-forest-900/20 hover:shadow-soft"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mint-100 text-forest-700 transition-colors group-hover:bg-forest-950 group-hover:text-white">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block font-display font-semibold text-forest-950">{title}</span>
                <span className="block text-sm text-muted">{text}</span>
              </span>
              <ArrowRight size={18} className="text-muted transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </div>

        <Button to="/" variant="outline" className="mt-6">
          <Home size={16} /> Back to home
        </Button>
      </Container>
    </main>
  );
}

export default NotFound;
