"use client";

import React, { useState } from "react";

type Prefs = {
  analytics: boolean;
  ads: boolean;
};

export default function ConsentPreferencesModal({
  visible,
  initial,
  onClose,
  onSave,
}: {
  visible: boolean;
  initial: Prefs;
  onClose: () => void;
  onSave: (prefs: Prefs) => void;
}) {
  const [prefs, setPrefs] = useState<Prefs>(initial);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-white dark:bg-[#0b0b0b] rounded-lg shadow-lg m-4 p-6">
        <h3 className="text-lg font-semibold mb-3">Cookie preferences</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Choose which cookies you allow. You can change these anytime.</p>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium">Analytics</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Help us understand how visitors use the site.</div>
            </div>
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={prefs.analytics}
                aria-checked={prefs.analytics}
                aria-label="Enable analytics"
                onChange={() => setPrefs({ ...prefs, analytics: !prefs.analytics })}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none relative dark:bg-gray-700 peer-checked:bg-[var(--brand-red)] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-200 after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5"></div>
            </label>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium">Ads & Marketing</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Used for personalised ads and marketing measurement.</div>
            </div>
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={prefs.ads}
                aria-checked={prefs.ads}
                aria-label="Enable ads and marketing"
                onChange={() => setPrefs({ ...prefs, ads: !prefs.ads })}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none relative dark:bg-gray-700 peer-checked:bg-[var(--brand-red)] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-200 after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-200 text-sm">Cancel</button>
          <button
            onClick={() => onSave(prefs)}
            className="px-4 py-2 rounded-md bg-[var(--brand-red)] text-white text-sm font-medium"
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}
