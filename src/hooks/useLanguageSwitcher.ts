import { useEffect, useState } from "react";
import { NextPageContext } from "next";

export const COOKIE_NAME = "googtrans";

export interface LanguageDescriptor {
  name: string;
  title: string;
}

export interface LanguageConfig {
  languages: LanguageDescriptor[];
  defaultLanguage: string;
}

export type UseLanguageSwitcherResult = {
  currentLanguage: string;
  switchLanguage: (lang: string) => () => void;
  languageConfig: LanguageConfig | undefined;
};

export type UseLanguageSwitcherOptions = {
  context?: NextPageContext;
};

export const getLanguageConfig = (): LanguageConfig | undefined => {
  let cfg: LanguageConfig | undefined;

  if (process.env.NEXT_PUBLIC_GOOGLE_TRANSLATION_CONFIG) {
    try {
      cfg = JSON.parse(
        process.env.NEXT_PUBLIC_GOOGLE_TRANSLATION_CONFIG ?? "{}",
      );
    } catch (e) {}
  }

  return cfg;
};

export const useLanguageSwitcher = ({
  context,
}: UseLanguageSwitcherOptions = {}): UseLanguageSwitcherResult => {
  const [currentLanguage, setCurrentLanguage] = useState<string>("");

  useEffect(() => {
    const cfg = getLanguageConfig();

    let languageValue = "";
    if (cfg && !languageValue) {
      languageValue = cfg.defaultLanguage;
    }

    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
      if (match) {
        const val = match[2].split("/");
        if (val.length > 2) {
          languageValue = val[2];
        }
      }
    }

    setCurrentLanguage(languageValue);
  }, []);

  const switchLanguage = (lang: string) => () => {
    const cfg = getLanguageConfig();
    const defaultLanguage = cfg?.defaultLanguage ?? "en";

    if (lang === defaultLanguage) {
      document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
    } else {
      document.cookie = `${COOKIE_NAME}=/${defaultLanguage}/${lang}; path=/`;
    }

    window.location.reload();
  };

  return {
    currentLanguage,
    switchLanguage,
    languageConfig: getLanguageConfig(),
  };
};

export default useLanguageSwitcher;
