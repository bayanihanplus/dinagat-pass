"use client";

import { useState } from "react";

type BookingResponse = {
  bookingCode?: string;
  status?: string;
  message?: string;
};

function getTravelerSafeBookingError(status: number, message?: string) {
  if (status === 401 || status === 403) {
    return "Please sign in before requesting backend review.";
  }

  if (message) {
    return message;
  }

  return "Trip request could not be sent. Please review your details and try again.";
}

export default function TravelerTripBookingPage() {
  const [title, setTitle] = useState("Dinagat trip request");
  const [notes, setNotes] = useState(
    "I want to request backend review for a Dinagat travel service.",
  );
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [showSignInCta, setShowSignInCta] = useState(false);
  const [result, setResult] = useState<BookingResponse | null>(null);

  async function submitIntent() {
    setState("loading");
    setError("");
    setShowSignInCta(false);
    setResult(null);

    try {
      const response = await fetch("/api/trip-bookings/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productType: "GOVERNED_TOUR",
          pricingMode: "REQUEST_TO_CONFIRM",
          title,
          travelerRequestJson: {
            notes,
            source: "traveler-trip-booking-page",
            frontendAuthority: false,
          },
        }),
      });

      const data = (await response.json().catch(() => null)) as BookingResponse | null;

      if (!response.ok) {
        setError(getTravelerSafeBookingError(response.status, data?.message));
        setShowSignInCta(response.status === 401 || response.status === 403);
        setState("error");
        return;
      }

      setResult(data);
      setState("success");
    } catch {
      setError("Trip request could not be sent. Please check the local server and try again.");
      setState("error");
    }
  }

  return (
    <main className="dp-visual-shell">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 lg:px-10">
        <header className="dp-premium-header">
          <span className="dp-eyebrow">Trip request review</span>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="dp-visual-title">
                Request backend review before any trip confirmation.
              </h1>
              <p className="dp-visual-copy">
                Dinagat Pass keeps booking status, payment readiness, and official access
                permissions backend-governed. This page only submits a traveler request for review.
              </p>
            </div>

            <div className="rounded-[22px] border border-[rgba(217,232,234,0.95)] bg-white/85 p-4 shadow-[var(--dp-card-shadow-soft)]">
              <p className="m-0 text-xs font-black uppercase tracking-[0.12em] text-[var(--dp-sea-teal)]">
                Authority boundary
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[var(--dp-trust-navy)]">
                Frontend authority: false
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--dp-slate)]">
                No frontend-owned confirmation, payment, QR, or operator assignment.
              </p>
            </div>
          </div>

          <div className="dp-trust-strip">
            <span className="dp-trust-chip">Submit intent only</span>
            <span className="dp-trust-chip">Backend-owned booking</span>
            <span className="dp-trust-chip">No operator dump</span>
            <span className="dp-trust-chip">No frontend-owned payment</span>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            className="dp-nuclear-card"
            onSubmit={(event) => {
              event.preventDefault();
              void submitIntent();
            }}
          >
            <p className="dp-eyebrow">Request details</p>

            <label className="mt-5 block">
              <span className="text-sm font-black text-[var(--dp-trust-navy)]">
                Request title
              </span>
              <input
                className="mt-2 w-full rounded-[18px] border border-[rgba(217,232,234,0.95)] bg-white px-4 py-3 text-sm font-semibold text-[var(--dp-trust-navy)] outline-none transition focus:shadow-[var(--dp-focus-ring)]"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label className="mt-5 block">
              <span className="text-sm font-black text-[var(--dp-trust-navy)]">
                Traveler notes
              </span>
              <textarea
                className="mt-2 min-h-36 w-full rounded-[18px] border border-[rgba(217,232,234,0.95)] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[var(--dp-trust-navy)] outline-none transition focus:shadow-[var(--dp-focus-ring)]"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </label>

            <button className="dp-primary-action mt-5" disabled={state === "loading"} type="submit">
              {state === "loading" ? "Requesting review..." : "Request backend review"}
            </button>

            {state === "error" ? (
              <div className="dp-alert dp-alert-error mt-5">
                <p className="dp-alert-title">{error}</p>
                {showSignInCta ? (
                  <a className="dp-alert-action" href="/login">
                    Sign in to continue
                  </a>
                ) : null}
              </div>
            ) : null}

            {state === "success" ? (
              <div className="mt-5 rounded-[20px] border border-[rgba(14,154,167,0.2)] bg-[rgba(234,248,247,0.72)] p-4">
                <p className="m-0 text-sm font-black text-[var(--dp-sea-teal)]">
                  Request sent for backend review.
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--dp-slate)]">
                  Status: {result?.status ?? "Review pending"}
                </p>
                {result?.bookingCode ? (
                  <p className="mt-1 text-sm leading-6 text-[var(--dp-slate)]">
                    Reference: {result.bookingCode}
                  </p>
                ) : null}
              </div>
            ) : null}
          </form>

          <aside className="flex flex-col gap-4">
            <article className="dp-nuclear-card">
              <p className="dp-nuclear-card-title">What this page does</p>
              <p className="dp-nuclear-card-copy">
                It sends a request intent to the backend through the local proxy with cookies included.
              </p>
            </article>

            <article className="dp-nuclear-card">
              <p className="dp-nuclear-card-title">What this page does not do</p>
              <p className="dp-nuclear-card-copy">
                It does not approve bookings, open payment, issue QR access, or assign operators.
              </p>
            </article>

            <article className="dp-nuclear-card">
              <p className="dp-nuclear-card-title">Expected logged-out state</p>
              <p className="dp-nuclear-card-copy">
                Backend auth guard should return 403 and show a safe sign-in action.
              </p>
            </article>
          </aside>
        </section>
      </section>
    </main>
  );
}
