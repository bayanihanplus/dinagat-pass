"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { TravelerAppShell } from "../../_components/TravelerAppShell";

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

type TravelerRequestDetailResponse = {
  success: true;
  authority: "backend";
  frontendOwnsAuthority: false;
  booking: TravelerRequest;
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
    month: "long",
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

export default function TravelerRequestDetailPage() {
  const params = useParams<{
    requestId: string;
  }>();

  const bookingCode = params.requestId?.trim() ?? "";

  const [data, setData] =
    useState<TravelerRequestDetailResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequest = useCallback(async () => {
    if (!bookingCode) {
      setError("Request reference is required.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/trip-bookings/intent/${encodeURIComponent(
          bookingCode,
        )}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
          cache: "no-store",
        },
      );

      const payload = (await response.json()) as
        | TravelerRequestDetailResponse
        | {
            message?: string;
          };

      if (!response.ok) {
        throw new Error(
          "message" in payload && payload.message
            ? payload.message
            : "Unable to load this request.",
        );
      }

      setData(payload as TravelerRequestDetailResponse);
    } catch (caughtError) {
      setData(null);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load this request.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [bookingCode]);

  useEffect(() => {
    void loadRequest();
  }, [loadRequest]);

  const request = data?.booking;

  return (
    <TravelerAppShell activeTab="requests">
      <section
        className="dp-request-detail-hero"
        aria-labelledby="request-detail-title"
      >
        <div className="dp-request-detail-kicker">
          Request Detail
        </div>

        <h1 id="request-detail-title">
          Your trip request
        </h1>

        <p>
          This page displays the backend-owned outcome intended
          for the authenticated request owner.
        </p>
      </section>

      {isLoading ? (
        <section className="dp-request-detail-card">
          <div className="dp-request-detail-status">
            <span aria-hidden="true" />
            <strong>Loading request</strong>
          </div>
        </section>
      ) : null}

      {error ? (
        <section
          className="dp-request-detail-card"
          role="alert"
        >
          <div className="dp-request-detail-status">
            <span aria-hidden="true" />
            <strong>Unable to load request</strong>
          </div>

          <div className="dp-request-detail-copy">
            <p>Request reference</p>
            <h2>{bookingCode || "Unavailable"}</h2>
            <span>{error}</span>
          </div>
        </section>
      ) : null}

      {request ? (
        <>
          <section
            className="dp-request-detail-card dp-request-detail-summary"
            aria-label="Traveler request status"
          >
            <div className="dp-request-detail-status">
              <span aria-hidden="true" />
              <strong>
                {request.travelerStatus.label}
              </strong>
            </div>

            <div className="dp-request-detail-copy">
              <p>{request.bookingCode}</p>
              <h2>{request.title}</h2>
              <span>
                {request.travelerStatus.guidance}
              </span>
            </div>
          </section>

          <section
            className="dp-request-detail-card"
            aria-label="Request information"
          >
            <div className="dp-request-detail-section-head">
              <p>Request information</p>
              <h2>Submitted trip details</h2>
            </div>

            <div
              className="dp-request-detail-chip-grid"
            >
              <span className="dp-request-detail-chip">
                Destination:{" "}
                {request.destinationName ??
                  "Not set"}
              </span>

              <span className="dp-request-detail-chip">
                Service date:{" "}
                {formatServiceDate(
                  request.serviceDate,
                )}
              </span>

              <span className="dp-request-detail-chip">
                Travelers: {request.paxCount}
              </span>

              <span className="dp-request-detail-chip">
                Submitted:{" "}
                {formatDateTime(request.createdAt)}
              </span>

              <span className="dp-request-detail-chip">
                Status updated:{" "}
                {formatDateTime(
                  request.travelerStatus.updatedAt,
                )}
              </span>
            </div>
          </section>

          <section
            className="dp-request-detail-card"
            aria-label="Status privacy boundary"
          >
            <div className="dp-request-detail-section-head">
              <p>Traveler-safe status</p>
              <h2>
                Internal review records remain private.
              </h2>
            </div>

            <p>
              Only your request information and official
              traveler guidance are displayed here.
            </p>
          </section>
        </>
      ) : null}

      <section
        className="dp-request-detail-actions"
        aria-label="Request navigation"
      >
        <Link
          className="dp-request-detail-action"
          href="/traveler/requests"
        >
          Back to requests
        </Link>

        <button
          className="dp-request-detail-secondary"
          type="button"
          onClick={() => void loadRequest()}
          disabled={isLoading}
        >
          {isLoading ? "Refreshing" : "Refresh status"}
        </button>
      </section>
    </TravelerAppShell>
  );
}
