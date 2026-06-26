import { useState } from "react";
import { loginApi } from "../services/api";

/* ─── Design tokens (shared across all components) ─── */
export const T = {
  bg: "#F4F5F7",
  surface: "#FFFFFF",
  surfaceAlt: "#F8F9FA",
  border: "0.5px solid #E1E4E8",
  borderEm: "0.5px solid #C8CCD0",
  textPrimary: "#0D0E10",
  textSecondary: "#586069",
  textTertiary: "#959DA5",
  radius: "8px",
  radiusLg: "12px",
  radiusXl: "16px",
  indigo: "#4F46E5",
  indigoDim: "#EEF2FF",
  indigoText: "#3730A3",
  green: "#3B6D11",
  greenBg: "#EAF3DE",
  red: "#993C1D",
  redBg: "#FAECE7",
  amber: "#854F0B",
  amberBg: "#FAEEDA",
};

export default function LoginPage({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState({});

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const s = await loginApi(form);
      onLoginSuccess({ username: form.username, token: s.token });
    } catch {
      setError("Sign-in failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: T.bg,
      padding: "1rem",
      boxSizing: "border-box",
    }}>
      {/* Brand mark */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div style={{
          width: 52, height: 52, borderRadius: "14px",
          background: T.indigo,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <h1 style={{
          margin: 0, fontSize: 22, fontWeight: 600,
          color: T.textPrimary, letterSpacing: "-0.3px",
        }}>
          Panchayat Asset Portal
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: T.textSecondary }}>
          Street lighting management system
        </p>
      </div>

      {/* Login card */}
      <div style={{
        width: "100%", maxWidth: 400,
        background: T.surface,
        borderRadius: T.radiusXl,
        border: T.border,
        padding: "2rem",
        boxSizing: "border-box",
      }}>
        <form onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          <InputField
            label="Email ID" name="username" type="text"
            value={form.username} onChange={handleChange}
            placeholder="Enter your email"
            focused={focused.username}
            onFocus={() => setFocused((p) => ({ ...p, username: true }))}
            onBlur={() => setFocused((p) => ({ ...p, username: false }))}
          />
          <InputField
            label="Password" name="password" type="password"
            value={form.password} onChange={handleChange}
            placeholder="Enter your password"
            focused={focused.password}
            onFocus={() => setFocused((p) => ({ ...p, password: true }))}
            onBlur={() => setFocused((p) => ({ ...p, password: false }))}
          />

          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 14px", borderRadius: T.radius,
              background: T.redBg, border: `0.5px solid ${T.red}30`,
              fontSize: 13, color: T.red,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.25rem",
              padding: "13px",
              background: loading ? "#9CA3AF" : T.indigo,
              color: "#fff", border: "none",
              borderRadius: T.radius, fontSize: 15, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={{
          textAlign: "center", marginTop: "1.5rem",
          fontSize: 12, color: T.textTertiary,
        }}>
          Demo: any username and password works
        </p>
      </div>
    </div>
  );
}

function InputField({ label, focused, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: T.textSecondary }}>
        {label}
      </label>
      <input
        {...props}
        style={{
          padding: "11px 14px",
          border: focused
            ? `1.5px solid ${T.indigo}`
            : `1.5px solid #C8CCD0`,
          borderRadius: T.radius, fontSize: 15,
          background: T.surface, color: T.textPrimary,
          outline: "none", transition: "border-color 0.15s",
          boxSizing: "border-box", width: "100%",
        }}
      />
    </div>
  );
}