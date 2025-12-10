"use client";

import React, { useEffect, useState } from "react";

const STORAGE_KEY = "aetech_consent";
const MEASUREMENT_ID = "G-B8LHFL56CT";

export default function ConsentBanner(): JSX.Element | null {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Show banner by default until user makes a choice
        setVisible(true);
      } else {
        setAccepted(stored === "granted");
        setVisible(false);
      }
    } catch (e) {
      // If localStorage is unavailable, show banner as fallback
      setVisible(true);
    }
  }, []);

  function updateGtagConsent(state: "granted" | "denied") {
    try {
      if (typeof window !== "undefined" && (window as any).gtag) {
        const consentState = state === "granted" ? "granted" : "denied";
        (window as any).gtag("consent", "update", {
          ad_storage: consentState,
          analytics_storage: consentState,
        });

        if (state === "granted") {
          // Ensure GA config runs now that consent is granted
          (window as any).gtag("config", MEASUREMENT_ID, { send_page_view: true });
        }
      } else {
        // gtag not available yet — push to dataLayer so it applies when gtag loads
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push([
          "consent",
          "update",
          { ad_storage: state === "granted" ? "granted" : "denied", analytics_storage: state === "granted" ? "granted" : "denied" },
        ] as any);
      }
    } catch (err) {
      // ignore errors; consent best-effort
      console.warn("Consent update error", err);
    }
  }

  function acceptAll() {
    try {
      localStorage.setItem(STORAGE_KEY, "granted");
    } catch (e) {}
    updateGtagConsent("granted");
    setAccepted(true);
    setVisible(false);
  }

  function rejectAll() {
    try {
      localStorage.setItem(STORAGE_KEY, "denied");
    } catch (e) {}
    updateGtagConsent("denied");
    setAccepted(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={bannerStyle} role="region" aria-label="Cookie consent banner">
      <div style={{ maxWidth: 1024, margin: "0 auto", display: "flex", gap: 16, alignItems: "center", padding: "12px 16px" }}>
        <div style={{ flex: 1 }}>
          <strong>We respect your privacy.</strong>
          <div style={{ marginTop: 6 }}>
            We use cookies and similar technologies to give you a better experience, analyze traffic, and for advertising. You can accept or reject non-essential cookies.
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={rejectAll} style={rejectButtonStyle}>
            Reject All
          </button>
          <button onClick={acceptAll} style={acceptButtonStyle}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

const bannerStyle: React.CSSProperties = {
  position: "fixed",
  left: 12,
  right: 12,
  bottom: 12,
  background: "rgba(255,255,255,0.98)",
  border: "1px solid rgba(16,24,40,0.06)",
  boxShadow: "0 6px 24px rgba(2,6,23,0.08)",
  borderRadius: 10,
  zIndex: 9999,
};

const acceptButtonStyle: React.CSSProperties = {
  background: "#0B74FF",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
};

const rejectButtonStyle: React.CSSProperties = {
  background: "transparent",
  color: "#0B74FF",
  border: "1px solid #0B74FF",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
};
