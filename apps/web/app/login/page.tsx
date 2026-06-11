const accessPills = ["Official pass entry", "Verified session", "Role-aware routing"];

const accessOptions = [
  {
    title: "Traveler app",
    copy: "Open your pass, requests, and trip surfaces after session verification.",
    href: "/traveler/home",
    action: "Continue",
    primary: true,
  },
  {
    title: "Trip request",
    copy: "Prepare a guided request for review without claiming approval or payment.",
    href: "/traveler/trip-booking",
    action: "Start request",
    primary: false,
  },
];

export default function LoginPage() {
  return (
    <main className="dp-app-stage">
      <section className="dp-app-frame">
        <div className="dp-access-grid">
          <header className="dp-glass-panel dp-hero-panel">
            <div className="dp-hero-content">
              <span className="dp-eyebrow">Dinagat Pass</span>
              <h1 className="dp-visual-title">
                One official entry for island access.
              </h1>
              <p className="dp-visual-copy">
                Continue into Dinagat Pass through a protected access layer built for
                travelers, local partners, and destination operations.
              </p>

              <div className="dp-pill-row">
                {accessPills.map((item) => (
                  <span className="dp-mini-pill" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <section className="dp-glass-panel dp-side-panel" aria-label="Access options">
            <div className="dp-access-card">
              <p className="dp-card-kicker">Returning access</p>
              <h2 className="dp-section-title">Choose where to continue.</h2>
              <p className="dp-section-copy">
                Protected areas open only after the backend verifies your session.
              </p>
            </div>

            {accessOptions.map((item) => (
              <article className="dp-access-card" key={item.title}>
                <p className="dp-nuclear-card-title">{item.title}</p>
                <p className="dp-nuclear-card-copy">{item.copy}</p>
                <div className="dp-action-row">
                  <a
                    className={item.primary ? "dp-primary-action" : "dp-secondary-action"}
                    href={item.href}
                  >
                    {item.action}
                  </a>
                </div>
              </article>
            ))}

            <p className="dp-quiet-note">
              Dinagat Pass keeps final access decisions server-side. This page only guides
              the user into the right protected or request surface.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
