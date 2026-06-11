"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

type IntentResponse = {
  ok?: boolean;
  message?: string;
  bookingCode?: string;
  status?: string;
};

const tripPills = ["Request to confirm", "Backend review", "Local fulfillment"];

const flowItems = [
  {
    step: "1",
    title: "Send request",
    copy: "Share the trip window, group size, and destination needs.",
  },
  {
    step: "2",
    title: "Review readiness",
    copy: "The backend keeps confirmation and pricing authority.",
  },
  {
    step: "3",
    title: "Coordinate locally",
    copy: "Approved fulfillment is handled through governed local participation.",
  },
];

export default function TravelerTripBookingPage() {
  const [title, setTitle] = useState("Dinagat guided trip request");
  const [notes, setNotes] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [bookingCode, setBookingCode] = useState("");
  const [showSignInCta, setShowSignInCta] = useState(false);

  async function submitIntent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitState("loading");
    setMessage("");
    setBookingCode("");
    setShowSignInCta(false);

    try {
      const response = await fetch("/api/trip-bookings/intent", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          productType: "GOVERNED_TOUR",
          pricingMode: "REQUEST_TO_CONFIRM",
          title,
          travelerRequestJson: {
            notes,
            source: "traveler-trip-booking-premium-recovery",
            frontendAuthority: false,
          },
        }),
      });

      const data = (await response.json().catch(() => null)) as IntentResponse | null;

      if (!response.ok) {
        const safeMessage =
          response.status === 401 || response.status === 403
            ? "Please sign in before requesting backend review."
            : data?.message || "Trip request could not be submitted.";

        setSubmitState("error");
        setMessage(safeMessage);
        setShowSignInCta(response.status === 401 || response.status === 403);
        return;
      }

      setSubmitState("success");
      setMessage(data?.message || "Your trip request was received for backend review.");
      setBookingCode(data?.bookingCode || "");
    } catch {
      setSubmitState("error");
      setMessage("Trip request service is not reachable right now.");
    }
  }

  return (
    <main className="dp-app-stage">
      <section className="dp-trip-grid">
        <header className="dp-glass-panel dp-hero-panel">
          <div className="dp-hero-content">
            <span className="dp-eyebrow">Dinagat trip request</span>
            <h1 className="dp-visual-title">
              Request the journey. Confirm through the system.
            </h1>
            <p className="dp-visual-copy">
              A guided request surface for island trips, built to keep booking,
              payment readiness, and fulfillment decisions under backend control.
            </p>

            <div className="dp-pill-row">
              {tripPills.map((item) => (
                <span className="dp-mini-pill" key={item}>
                  {item}
                </span>
              ))}
            </div>

            <div className="dp-flow-list">
              {flowItems.map((item) => (
                <article className="dp-flow-item" key={item.step}>
                  <span className="dp-flow-dot">{item.step}</span>
                  <div>
                    <p className="dp-flow-title">{item.title}</p>
                    <p className="dp-flow-copy">{item.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </header>

        <section className="dp-form-panel">
          <p className="dp-card-kicker">Request details</p>
          <h2 className="dp-section-title">Send for review.</h2>
          <p className="dp-section-copy">
            Add the minimum details needed to begin review. This does not create a
            confirmed booking.
          </p>

          <form className="dp-form-shell" onSubmit={submitIntent}>
            <label className="dp-field">
              <span className="dp-field-label">Trip title</span>
              <input
                className="dp-input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Dinagat guided trip request"
              />
            </label>

            <label className="dp-field">
              <span className="dp-field-label">Traveler notes</span>
              <textarea
                className="dp-textarea"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Travel dates, group size, preferred islands, pickup needs, and special requests."
              />
            </label>

            <button
              className="dp-primary-action"
              disabled={submitState === "loading"}
              type="submit"
            >
              {submitState === "loading" ? "Sending request..." : "Request backend review"}
            </button>
          </form>

          {message ? (
            <div className="dp-status-box">
              <p className="dp-status-title">{message}</p>

              {bookingCode ? (
                <p className="dp-status-copy">
                  Reference: <strong>{bookingCode}</strong>
                </p>
              ) : null}

              {showSignInCta ? (
                <div className="dp-action-row">
                  <a className="dp-secondary-action" href="/login?mode=returning&reason=auth-required">
                    Sign in to continue
                  </a>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
