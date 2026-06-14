"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { TravelerAppShell } from "../_components/TravelerAppShell";

type RequestStatus = "idle" | "submitting" | "success" | "error";

type IntentResponse = {
  status?: string;
  message?: string;
  intent?: {
    requestId?: string;
    status?: string;
    reviewMode?: string;
    travelerAction?: string;
  };
};

const tripTypes = [
  "Island hopping",
  "Dinagat land route",
  "Local transfer",
  "Custom Dinagat request",
];

const requestGuardrails = [
  "Request only",
  "Backend review",
  "Payment protected",
  "QR controlled",
];

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const minTravelDate = toDateInputValue(today);
const maxTravelDate = toDateInputValue(addMonths(today, 24));

export default function TravelerTripBookingPage() {
  const [destination, setDestination] = useState("Dinagat Islands");
  const [tripType, setTripType] = useState(tripTypes[0]);
  const [travelDate, setTravelDate] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [message, setMessage] = useState("");

  const summary = useMemo(() => {
    const dateLabel = travelDate ? travelDate : "Date not set";
    const paxLabel = partySize ? `${partySize} traveler${partySize === "1" ? "" : "s"}` : "Travelers not set";

    return [tripType, destination || "Destination not set", dateLabel, paxLabel];
  }, [destination, partySize, travelDate, tripType]);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!travelDate || travelDate < minTravelDate || travelDate > maxTravelDate) {
      setStatus("error");
      setMessage("Choose a travel date within the next 24 months.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/trip-bookings/intent", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          destination,
          tripType,
          travelDate,
          partySize,
          notes,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as IntentResponse;

      if (!response.ok) {
        setStatus("error");

        const fallbackMessage =
          response.status === 401 || response.status === 403
            ? "Please sign in with a traveler account before sending this request."
            : "Trip request could not be sent for review.";

        setMessage(fallbackMessage);
        return;
      }

      setStatus("success");
      setMessage(payload.message || "Trip request received for backend review.");
    } catch {
      setStatus("error");
      setMessage("Trip request could not be sent. Check your connection and try again.");
    }
  }

  function handleTravelDateChange(event: ChangeEvent<HTMLInputElement>) {
    const nextDate = event.target.value;
    setTravelDate(nextDate);

    if (status === "error" && message === "Choose a travel date within the next 24 months.") {
      setMessage("");
      setStatus("idle");
    }
  }

  return (
    <TravelerAppShell activeTab="requests">
      <section className="dp-trip-app-hero" aria-labelledby="trip-booking-title">
        <p className="dp-true-app-kicker">Trip request</p>
        <h1 id="trip-booking-title">Plan your Dinagat trip</h1>
        <p>
          Send your route details for official backend review. Booking, payment, QR, and fulfillment stay protected.
        </p>

        <div className="dp-trip-app-summary" aria-label="Request summary">
          {summary.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="dp-trip-app-card" aria-labelledby="request-form-title">
        <div className="dp-trip-app-section-head">
          <div>
            <p className="dp-true-app-kicker">Request details</p>
            <h2 id="request-form-title">Start request</h2>
          </div>
          <span>Review</span>
        </div>

        <form className="dp-trip-app-form" onSubmit={submitRequest}>
          <label className="dp-trip-app-field">
            <span>Destination</span>
            <input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Dinagat Islands"
              autoComplete="off"
              required
            />
          </label>

          <label className="dp-trip-app-field">
            <span>Trip type</span>
            <select value={tripType} onChange={(event) => setTripType(event.target.value)} required>
              {tripTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <div className="dp-trip-app-two">
            <label className="dp-trip-app-field">
              <span>Date</span>
              <input
                value={travelDate}
                onChange={handleTravelDateChange}
                type="date"
                min={minTravelDate}
                max={maxTravelDate}
                required
              />
            </label>

            <label className="dp-trip-app-field">
              <span>Pax</span>
              <input
                value={partySize}
                onChange={(event) => setPartySize(event.target.value)}
                type="number"
                min="1"
                max="30"
                required
              />
            </label>
          </div>

          <label className="dp-trip-app-field">
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Pickup point, route preference, time window, or accessibility notes."
              rows={4}
            />
          </label>

          {message ? (
            <div className={`dp-trip-app-status dp-trip-app-status-${status}`} role="status">
              {message}
            </div>
          ) : null}

          <button className="dp-trip-app-submit" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending request" : "Send for review"}
            <span aria-hidden="true">{"\u2192"}</span>
          </button>
        </form>
      </section>

      <section className="dp-trip-app-card dp-trip-app-guardrails" aria-labelledby="request-guardrails-title">
        <div className="dp-trip-app-section-head">
          <div>
            <p className="dp-true-app-kicker">Before you continue</p>
            <h2 id="request-guardrails-title">Official flow</h2>
          </div>
          <span>Protected</span>
        </div>

        <div className="dp-trip-app-chip-grid">
          {requestGuardrails.map((item, index) => (
            <span key={item}>
              <em aria-hidden="true">{["\u25A3", "\u2317", "\u25CC", "\u25C7"][index]}</em>
              {item}
            </span>
          ))}
        </div>

        <p>
          No fake confirmation, no browser-side approval, no QR shortcut, and no operator assignment from the frontend.
        </p>
      </section>
    </TravelerAppShell>
  );
}



