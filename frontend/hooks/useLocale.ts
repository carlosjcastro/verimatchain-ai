"use client";

import { useState, useCallback } from "react";
import { translations, type Locale, type T } from "@/lib/i18n";

export function useLocale(defaultLocale: Locale = "es") {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  const t = translations[locale];

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "en" ? "es" : "en"));
  }, []);

  return { locale, t, toggleLocale };
}