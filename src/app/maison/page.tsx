import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { OrbisMark } from "@/components/OrbisMark";

export const metadata: Metadata = {
  title: "Maison",
  description:
    "How ORBIS is made, shipped, warranted and serviced. One orb, one collection at a time.",
};

const SECTIONS = [
  {
    id: "shipping",
    title: "Shipping & returns",
    body: "Every order is dispatched insured and signed-for within two working days, with complimentary worldwide delivery. Returns are accepted unworn within thirty days, in the original presentation case.",
  },
  {
    id: "warranty",
    title: "Warranty",
    body: "Each ORBIS carries a two-year international warranty against manufacturing defect, registered to the reference number engraved on the case back.",
  },
  {
    id: "servicing",
    title: "Servicing",
    body: "Battery replacement, gasket renewal and case refinishing are handled in-house. A service takes eight to twelve working days from receipt.",
  },
  {
    id: "contact",
    title: "Contact",
    body: "Written enquiries are answered within one working day. For sizing, availability or anything else, write to the atelier.",
  },
];

export default function MaisonPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="u-plate u-drift absolute inset-0 opacity-60" style={{ backgroundPosition: "center 24%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-void via-void/55 to-void" />
        </div>
        <div className="mx-auto max-w-[110rem] px-5 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28 lg:pt-48">
          <Reveal>
            <OrbisMark size={42} className="text-steel" />
            <p className="u-eyebrow mt-8">The maison</p>
            <h1 className="u-display mt-5 max-w-4xl text-[clamp(2.5rem,8vw,6rem)]">
              One orb, one collection at a time.
            </h1>
            <p className="mt-8 max-w-xl leading-relaxed text-muted">
              ORBIS is a small watchmaking house. We release one collection at a
              time, hold the case constant across it, and give each collection a
              world of its own to be photographed into.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[110rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-px overflow-hidden rounded-sm bg-line md:grid-cols-2">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.id} delay={i * 90} className="bg-void p-8 lg:p-12">
              <h2 id={s.id} className="scroll-mt-28 font-display text-3xl">{s.title}</h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted">{s.body}</p>
              {s.id === "contact" && (
                <a
                  href="mailto:atelier@orbis.watch"
                  className="u-focus u-link mt-6 inline-block text-[0.7rem] uppercase tracking-[0.28em] text-text"
                >
                  atelier@orbis.watch
                </a>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 border-t border-line pt-16 text-center">
          <p className="u-display text-[clamp(1.75rem,4vw,3rem)]">Five dials. One orbit.</p>
          <Link
            href="/collections/millenium"
            className="u-focus mt-8 inline-block rounded-full bg-text px-8 py-4 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-void transition-colors duration-300 hover:bg-white"
          >
            Explore Millenium
          </Link>
        </Reveal>
      </section>
    </>
  );
}
