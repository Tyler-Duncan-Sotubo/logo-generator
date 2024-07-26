/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

"use client";

import Link from "next/link";
import { getLocalStorage, setLocalStorage } from "@/helper/storageHelper";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState(false);

  useEffect(() => {
    const storedCookieConsent = getLocalStorage("cookie_consent", null);

    setCookieConsent(storedCookieConsent);
  }, [setCookieConsent]);

  useEffect(() => {
    const newValue = cookieConsent ? "granted" : "denied";

    window.gtag("consent", "update", {
      analytics_storage: newValue,
    });

    setLocalStorage("cookie_consent", cookieConsent);

    //For Testing
    console.log("Cookie Consent: ", cookieConsent);
  }, [cookieConsent]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 mx-auto my-10 ${cookieConsent != null ? "hidden" : "flex"} max-w-max flex-col items-center justify-between gap-4 rounded-lg bg-gray-700 px-3 py-3 text-lg shadow sm:flex-row md:max-w-screen-lg md:px-4`}
    >
      <div className="text-center">
        <Link href="/cookies">
          <p className="text-white">
            We use <span className="font-bold text-sky-400">cookies</span> on
            our site.
          </p>
        </Link>
      </div>

      <div className="flex gap-2">
        <button
          className="rounded-md border-gray-900 px-5 py-2 text-gray-300"
          onClick={() => setCookieConsent(false)}
        >
          Decline
        </button>
        <button
          className="rounded-lg bg-gray-900 px-5 py-2 text-white"
          onClick={() => setCookieConsent(true)}
        >
          Allow Cookies
        </button>
      </div>
    </div>
  );
}
