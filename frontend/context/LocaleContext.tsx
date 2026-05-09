"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { translations, type Locale } from "@/lib/i18n";

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Record<string, unknown>
    ? DeepReadonly<T[K]>
    : string;
};

export type T = DeepReadonly<typeof translations.en>;

interface LocaleContextValue {
  locale: Locale;
  t: T;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "es",
  t: translations.es as unknown as T,
  toggleLocale: () => {},
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es");

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "en" ? "es" : "en"));
  }, []);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        t: translations[locale] as unknown as T,
        toggleLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useT() {
  return useContext(LocaleContext);
}
