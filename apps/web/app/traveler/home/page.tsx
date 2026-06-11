const readinessCards = [
  {
    icon: "ID",
    title: "Official Pass",
    copy: "Traveler access stays tied to backend-verified session state.",
  },
  {
    icon: "TR",
    title: "Trip Requests",
    copy: "Start request-to-confirm journeys without claiming approval.",
  },
  {
    icon: "RX",
    title: "Readiness",
    copy: "Keep traveler actions clear before payment, QR, or fulfillment steps.",
  },
];

const journeySteps = [
  {
    step: "1",
    title: "Open your traveler surface",
    copy: "This protected home appears only after session verification.",
  },
  {
    step: "2",
    title: "Prepare a request",
    copy: "Use trip request flow for backend review and local coordination.",
  },
  {
    step: "3",
    title: "Wait for confirmed readiness",
    copy: "Booking, payment, QR, and fulfillment remain system-controlled.",
  },
];

const operationsNotes = [
  {
    step: "A",
    title: "No fake confirmation",
    copy: "The traveler app does not claim booking approval from the browser.",
  },
  {
    step: "B",
    title: "No QR shortcut",
    copy: "QR surfaces should appear only when the backend issues or validates them.",
  },
  {
    step: "C",
    title: "No operator assignment",
    copy: "Local fulfillment must follow governed readiness and exposure rules.",
  },
];

export default function TravelerHomePage() {
  return (
    <main className="dp-home-shell">
      <section className="dp-home-frame">
        <nav className="dp-home-topbar" aria-label="Traveler app status">
          <div className="dp-home-brand">
            <span className="dp-home-mark">DP</span>
            <div>
              <p className="dp-home-brand-title">Dinagat Pass Traveler</p>
              <p className="dp-home-brand-copy">Protected island journey surface</p>
            </div>
          </div>

          <span className="dp-home-status-pill">Backend session required</span>
        </nav>

        <section className="dp-home-hero">
          <header className="dp-home-panel dp-home-hero-main">
            <div className="dp-home-hero-content">
              <span className="dp-eyebrow">Traveler home</span>
              <h1 className="dp-home-title">Your official Dinagat journey starts here.</h1>
              <p className="dp-home-copy">
                A premium traveler dashboard for pass readiness, trip requests, and
                protected island actions. Final booking, payment, QR, and fulfillment
                decisions stay under backend control.
              </p>

              <div className="dp-home-actions">
                <a className="dp-primary-action" href="/traveler/trip-booking">
                  Start trip request
                </a>
                <a className="dp-secondary-action" href="/login?mode=returning">
                  Return to access
                </a>
              </div>
            </div>
          </header>

          <aside className="dp-home-panel dp-home-side" aria-label="Pass readiness">
            <article className="dp-home-pass-card">
              <p className="dp-home-kicker">Official pass state</p>
              <h2 className="dp-home-card-title">Session-gated traveler app</h2>
              <p className="dp-home-card-copy">
                This surface should only be reached after backend session verification.
              </p>
            </article>

            <article className="dp-home-alert">
              <strong>No browser-side approval</strong>
              <span>
                The app can guide the traveler, but it must not create fake payment,
                booking, QR, or operator-assignment states.
              </span>
            </article>
          </aside>
        </section>

        <section className="dp-home-readiness-grid" aria-label="Traveler readiness cards">
          {readinessCards.map((item) => (
            <article className="dp-home-mini-card" key={item.title}>
              <span className="dp-home-mini-icon">{item.icon}</span>
              <h2 className="dp-home-mini-title">{item.title}</h2>
              <p className="dp-home-mini-copy">{item.copy}</p>
            </article>
          ))}
        </section>

        <section className="dp-home-section-grid">
          <article className="dp-home-panel dp-side-panel">
            <p className="dp-home-kicker">Traveler flow</p>
            <h2 className="dp-section-title">Clear next actions.</h2>
            <p className="dp-section-copy">
              Keep the traveler moving without inventing backend-owned outcomes.
            </p>

            <div className="dp-home-list">
              {journeySteps.map((item) => (
                <div className="dp-home-list-item" key={item.step}>
                  <span className="dp-home-list-dot">{item.step}</span>
                  <div>
                    <p className="dp-home-list-title">{item.title}</p>
                    <p className="dp-home-list-copy">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="dp-home-panel dp-side-panel">
            <p className="dp-home-kicker">Governance guardrails</p>
            <h2 className="dp-section-title">System authority preserved.</h2>
            <p className="dp-section-copy">
              The dashboard stays premium and useful without bypassing controlled
              booking and fulfillment logic.
            </p>

            <div className="dp-home-list">
              {operationsNotes.map((item) => (
                <div className="dp-home-list-item" key={item.step}>
                  <span className="dp-home-list-dot">{item.step}</span>
                  <div>
                    <p className="dp-home-list-title">{item.title}</p>
                    <p className="dp-home-list-copy">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
