const travelerActions = [
  {
    title: "Trip request",
    copy: "Request review before confirmation. Backend approval controls booking status.",
    href: "/traveler/trip-booking",
    action: "Request trip review",
    tone: "primary",
  },
  {
    title: "Official pass readiness",
    copy: "Traveler access stays tied to backend verification and the official pass layer.",
    href: "/login?mode=returning",
    action: "Sign in to continue",
    tone: "secondary",
  },
  {
    title: "Destination support",
    copy: "Guided island services will appear only after governed readiness and approval.",
    href: "/traveler/trip-booking",
    action: "Review options",
    tone: "secondary",
  },
];

const readinessChips = [
  "Backend-owned auth",
  "Review before confirmation",
  "Official access after verification",
];

export default function TravelerHomePage() {
  return (
    <main className="dp-visual-shell">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 lg:px-10">
        <header className="dp-premium-header">
          <span className="dp-eyebrow">Dinagat traveler home</span>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <h1 className="dp-visual-title">
                Your calm entry point to Dinagat Pass.
              </h1>
              <p className="dp-visual-copy">
                A premium traveler shell for trip requests, official access readiness,
                and destination support. Confirmation, payment readiness, and access
                permissions stay backend-owned.
              </p>
            </div>

            <div className="rounded-[22px] border border-[rgba(217,232,234,0.95)] bg-white/85 p-4 shadow-[var(--dp-card-shadow-soft)]">
              <p className="m-0 text-xs font-black uppercase tracking-[0.12em] text-[var(--dp-sea-teal)]">
                Trust boundary
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[var(--dp-trust-navy)]">
                Frontend authority: false
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--dp-slate)]">
                Traveler actions remain guided until backend review and verification are ready.
              </p>
            </div>
          </div>

          <div className="dp-trust-strip">
            {readinessChips.map((chip) => (
              <span className="dp-trust-chip" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </header>

        <section className="dp-card-grid" aria-label="Traveler actions">
          {travelerActions.map((item) => (
            <article className="dp-nuclear-card" key={item.title}>
              <p className="dp-nuclear-card-title">{item.title}</p>
              <p className="dp-nuclear-card-copy">{item.copy}</p>
              <a
                className={
                  item.tone === "primary"
                    ? "dp-primary-action mt-5"
                    : "dp-secondary-action mt-5"
                }
                href={item.href}
              >
                {item.action}
              </a>
            </article>
          ))}
        </section>

        <section className="dp-nuclear-card">
          <div className="grid gap-4 md:grid-cols-[0.7fr_1.3fr] md:items-center">
            <div>
              <p className="dp-eyebrow">Operating doctrine</p>
              <h2 className="dp-nuclear-card-title mt-3">
                Official, simple, and backend-governed.
              </h2>
            </div>

            <p className="dp-nuclear-card-copy md:mt-0">
              Dinagat Pass should feel like island infrastructure: calm traveler guidance,
              clear review states, and no frontend-owned confirmation, payment, or access authority.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

