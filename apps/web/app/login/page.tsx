"use client";

import { FormEvent, useMemo, useState } from "react";

const accessPills = ["Official pass entry", "Verified session", "Role-aware routing"];

type LoginState =
  | {
      kind: "idle";
      message: string;
    }
  | {
      kind: "loading";
      message: string;
    }
  | {
      kind: "success";
      message: string;
    }
  | {
      kind: "error";
      message: string;
    };

function getRedirectTarget(): string {
  if (typeof window === "undefined") {
    return "/traveler/home";
  }

  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");

  if (next?.startsWith("/traveler/")) {
    return next;
  }

  return "/traveler/home";
}

export default function LoginPage() {
  const [email, setEmail] = useState("qa.traveler@dinagat.local");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<LoginState>({
    kind: "idle",
    message: "Use your backend-issued traveler credential to continue."
  });

  const statusClass = useMemo(() => {
    if (state.kind === "success") {
      return "dp-status-box dp-status-success";
    }

    if (state.kind === "error") {
      return "dp-status-box dp-status-error";
    }

    return "dp-status-box";
  }, [state.kind]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setState({
      kind: "loading",
      message: "Verifying with backend authority..."
    });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password
        })
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.authenticated !== true || payload?.authority !== "backend") {
        setState({
          kind: "error",
          message: "Backend could not verify those credentials."
        });
        return;
      }

      setState({
        kind: "success",
        message: "Backend session verified. Opening traveler app..."
      });

      window.location.assign(getRedirectTarget());
    } catch {
      setState({
        kind: "error",
        message: "Could not reach the backend login service."
      });
    }
  }

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
                Sign in through the backend-owned session layer built for travelers,
                local partners, and destination operations.
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

          <section className="dp-glass-panel dp-side-panel" aria-label="Backend sign in">
            <div className="dp-access-card">
              <p className="dp-card-kicker">Returning access</p>
              <h2 className="dp-section-title">Verify your session.</h2>
              <p className="dp-section-copy">
                Protected traveler areas open only after the backend issues your
                Dinagat session cookie.
              </p>
            </div>

            <form className="dp-form-shell" onSubmit={handleSubmit}>
              <label className="dp-field">
                <span>Email</span>
                <input
                  className="dp-input"
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label className="dp-field">
                <span>Password</span>
                <input
                  className="dp-input"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={12}
                  required
                />
              </label>

              <div className={statusClass} role="status">
                {state.message}
              </div>

              <button
                className="dp-primary-action"
                type="submit"
                disabled={state.kind === "loading"}
              >
                {state.kind === "loading" ? "Verifying..." : "Sign in to traveler app"}
              </button>
            </form>

            <article className="dp-access-card">
              <p className="dp-nuclear-card-title">Trip request</p>
              <p className="dp-nuclear-card-copy">
                Prepare a guided request for backend review without claiming approval
                or payment.
              </p>
              <div className="dp-action-row">
                <a className="dp-secondary-action" href="/traveler/trip-booking">
                  Start request
                </a>
              </div>
            </article>

            <p className="dp-quiet-note">
              Dinagat Pass keeps final access decisions server-side. This page does
              not create public signup, frontend JWT, or fake dashboard access.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
