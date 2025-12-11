"use client";

import React, { useEffect, useState } from "react";
import ConsentPreferencesModal from "./ConsentPreferencesModal";

const STORAGE_KEY = "aetech_consent";
const PREFS_KEY = "aetech_consent_prefs";
const MEASUREMENT_ID = "G-B8LHFL56CT";

type Prefs = { analytics: boolean; ads: boolean };

export default function ConsentBanner(): React.ReactElement | null {
  const [visible, setVisible] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ analytics: false, ads: false });
  const [modalOpen, setModalOpen] = useState(false);
  const ENABLE_ADS = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedPrefs = localStorage.getItem(PREFS_KEY);

      if (storedPrefs) {
        const parsed = JSON.parse(storedPrefs) as Prefs;
        setPrefs(parsed);
        // If user already allowed ads, load AdSense (respect env guard)
        if (parsed.ads && ENABLE_ADS) {
          loadAdSenseScript();
        }
      }

      if (!stored) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    } catch (e) {
      setVisible(true);
    }
  }, []);

  function updateGtagConsentGranular(p: Prefs) {
    try {
      const a = p.analytics ? "granted" : "denied";
      const ad = p.ads ? "granted" : "denied";

      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("consent", "update", {
          ad_storage: ad,
          analytics_storage: a,
        });

        if (p.analytics) {
          (window as any).gtag("config", MEASUREMENT_ID, { send_page_view: true });
        }
      } else {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push(["consent", "update", { ad_storage: ad, analytics_storage: a }] as any);
      }
    } catch (err) {
      console.warn("Consent update error", err);
    }
  }

  function acceptAll() {
    const p = { analytics: true, ads: true };
    try {
      localStorage.setItem(STORAGE_KEY, "granted");
      localStorage.setItem(PREFS_KEY, JSON.stringify(p));
    } catch (e) {}
    setPrefs(p);
    updateGtagConsentGranular(p);
    if (ENABLE_ADS) loadAdSenseScript();
    setVisible(false);
  }

  function rejectAll() {
    const p = { analytics: false, ads: false };
    try {
      localStorage.setItem(STORAGE_KEY, "denied");
      localStorage.setItem(PREFS_KEY, JSON.stringify(p));
    } catch (e) {}
    setPrefs(p);
    updateGtagConsentGranular(p);
    setVisible(false);
  }

  function openPreferences() {
    setModalOpen(true);
  }

  function savePreferences(p: Prefs) {
    try {
      // store a coarse consent flag too so banner stays closed once user saved prefs
      localStorage.setItem(STORAGE_KEY, p.analytics || p.ads ? "granted" : "denied");
      localStorage.setItem(PREFS_KEY, JSON.stringify(p));
    } catch (e) {}
    setPrefs(p);
    updateGtagConsentGranular(p);
    if (p.ads && ENABLE_ADS) loadAdSenseScript();
    setModalOpen(false);
    setVisible(false);
  }

  function loadAdSenseScript() {
    try {
      if (typeof document === 'undefined') return;
      // avoid injecting twice
      if (document.querySelector('script[data-adsbygoogle]') || document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) return;
      const s = document.createElement('script');
      s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7208632097886901';
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.setAttribute('data-adsbygoogle', 'true');
      document.head.appendChild(s);
    } catch (err) {
      // swallow
    }
  }

  if (!visible) return null;

  return (
    <>
      <div className="fixed left-3 right-3 bottom-3 sm:left-6 sm:right-6 z-50">
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#0b0b0b] border border-gray-200 dark:border-neutral-800 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">We respect your privacy</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">We use cookies to personalise content, provide social media features, and analyse our traffic. Manage your preferences or accept to help us improve.</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openPreferences}
                className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                aria-label="Manage cookie preferences"
              >
                Manage preferences
              </button>

              <button onClick={rejectAll} className="px-3 py-2 rounded-md border border-[var(--brand-red)] text-[var(--brand-red)] text-sm hover:bg-red-50">
                Reject all
              </button>

              <button onClick={acceptAll} className="px-3 py-2 rounded-md bg-[var(--brand-red)] text-white text-sm font-medium">
                Accept all
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConsentPreferencesModal visible={modalOpen} initial={prefs} onClose={() => setModalOpen(false)} onSave={savePreferences} />
    </>
  );
}
