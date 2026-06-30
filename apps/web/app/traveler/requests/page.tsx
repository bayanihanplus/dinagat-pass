"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { TravelerAppShell } from "../_components/TravelerAppShell";

type TravelerRequestStatusCode =
  | "REQUEST_RECEIVED"
  | "MORE_INFORMATION_NEEDED"
  | "UNDER_REVIEW"
  | "APPROVED_FOR_NEXT_STEP"
  | "NOT_APPROVED"
  | "CLOSED";

type TravelerRequestStatus = {
  code: TravelerRequestStatusCode;
  label: string;
  guidance: string;
  updatedAt: string;
};

type TravelerRequest = {
  bookingCode: string;
  title: string;
  destinationName: string | null;
  serviceDate: string | null;
  paxCount: number;
  travelerStatus: TravelerRequestStatus;
  createdAt: string;
  updatedAt: string;
};

type TravelerRequestListResponse = {
  success: true;
  authority: "backend";
  frontendOwnsAuthority: false;
  total: number;
  requests: TravelerRequest[];
};

function formatServiceDate(value: string | null): string {
  if (!value) {
    return "Date not set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export default function TravelerRequestsPage() {
  const [data, setData] =
    useState<TravelerRequestListResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/trip-bookings/intents/mine",
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
          cache: "no-store",
        },
      );

      const payload = (await response.json()) as
        | TravelerRequestListResponse
        | {
            message?: string;
          };

      if (!response.ok) {
        throw new Error(
          "message" in payload && payload.message
            ? payload.message
            : "Unable to load your requests.",
        );
      }

      setData(payload as TravelerRequestListResponse);
    } catch (caughtError) {
      setData(null);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load your requests.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const requests = data?.requests ?? [];

  const actionNeededCount = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.travelerStatus.code ===
          "MORE_INFORMATION_NEEDED",
      ).length,
    [requests],
  );

  const activeReviewCount = useMemo(
    () =>
      requests.filter((request) =>
        [
          "REQUEST_RECEIVED",
          "UNDER_REVIEW",
        ].includes(request.travelerStatus.code),
      ).length,
    [requests],
  );

  return (
    <TravelerAppShell activeTab="requests">
      <section
        className="dp-requests-hero"
        aria-labelledby="traveler-requests-title"
      >
        <div className="dp-requests-kicker">
          Trip Requests
        </div>

        <h1 id="traveler-requests-title">
          Track your requests
        </h1>

        <p>
          View backend-owned request outcomes and official
          traveler guidance without exposing internal review
          notes or operational records.
        </p>
      </section>

      <section
        className="dp-requests-card"
        aria-label="Request summary"
      >
        <div className="dp-requests-section-head">
          <div>
            <p>Current request history</p>
            <h2>
              {isLoading
                ? "Loading your requests"
                : `${data?.total ?? 0} request${
                    data?.total === 1 ? "" : "s"
                  }`}
            </h2>
          </div>

          <button
            className="dp-requests-secondary"
            type="button"
            onClick={() => void loadRequests()}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing" : "Refresh"}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginTop: "18px",
          }}
        >
          <div className="dp-requests-chip">
            Active review: {activeReviewCount}
          </div>

          <div className="dp-requests-chip">
            Action needed: {actionNeededCount}
          </div>

          <div className="dp-requests-chip">
            Authority: backend
          </div>
        </div>
      </section>

      {error ? (
        <section
          className="dp-requests-card"
          role="alert"
        >
          <div className="dp-requests-status">
            <span aria-hidden="true" />
            <strong>Unable to load requests</strong>
          </div>

          <p>{error}</p>
        </section>
      ) : null}

      {!error && !isLoading && requests.length === 0 ? (
        <section className="dp-requests-card dp-requests-primary">
          <div className="dp-requests-status">
            <span aria-hidden="true" />
            <strong>No requests yet</strong>
          </div>

          <div className="dp-requests-empty">
            <p>Your request history</p>
            <h2>Start a Dinagat trip request</h2>
            <span>
              Once submitted, the request and its
              backend-owned status will appear here.
            </span>
          </div>

          <div className="dp-requests-action-stack">
            <Link
              className="dp-requests-action"
              href="/traveler/trip-booking"
            >
              Start request
            </Link>
          </div>
        </section>
      ) : null}

      {!error && requests.length > 0 ? (
        <section
          className="dp-requests-timeline"
          aria-label="Traveler request history"
        >
          {requests.map((request, index) => (
            <article
              className="dp-requests-step"
              key={request.bookingCode}
            >
              <div className="dp-requests-step-index">
                {index + 1}
              </div>

              <div
                style={{
                  width: "100%",
                  display: "grid",
                  gap: "10px",
                }}
              >
                <div>
                  <p>{request.bookingCode}</p>
                  <h2>{request.title}</h2>

                  <span>
                    {request.destinationName ??
                      "Destination not set"}{" "}
                    / {formatServiceDate(request.serviceDate)} /{" "}
                    {request.paxCount}{" "}
                    {request.paxCount === 1
                      ? "traveler"
                      : "travelers"}
                  </span>
                </div>

                <div className="dp-requests-status">
                  <span aria-hidden="true" />
                  <strong>
                    {request.travelerStatus.label}
                  </strong>
                </div>

                <span>
                  {request.travelerStatus.guidance}
                </span>

                <span>
                  Status updated{" "}
                  {formatDateTime(
                    request.travelerStatus.updatedAt,
                  )}
                </span>

                <div className="dp-requests-action-stack">
                  <Link
                    className="dp-requests-secondary"
                    href={`/traveler/requests/${encodeURIComponent(
                      request.bookingCode,
                    )}`}
                  >
                    View request
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      <section
        className="dp-requests-card dp-requests-pass-link"
        aria-label="Traveler status boundary"
      >
        <div>
          <p>Traveler-safe status</p>

          <h2>
            Internal review records stay private.
          </h2>

          <span>
            This page shows only the request information and
            guidance intended for the authenticated traveler.
          </span>
        </div>

        <Link
          className="dp-requests-secondary"
          href="/traveler/trip-booking"
        >
          Start another request
        </Link>
      </section>
    </TravelerAppShell>
  );
}
