import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { locales, translations, LocalizationPaths } from "@/locales";

export type Locale = (typeof locales)[number];

const isLocale = (locale: string): locale is Locale => {
  return (locales as readonly string[]).includes(locale);
};

const asLocale = (locale: string): Locale => {
  if (!isLocale(locale)) {
    console.warn(
      `Unsupported locale: ${locale}, will use ${locales[0]} instead`
    );
    return locales[0];
  }
  return locale;
};

interface UseLocaleResult {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: (path: LocalizationPaths) => string;
  tLang: (language: string) => string;
  i18n: typeof i18n;
}

export const useLocale = (): UseLocaleResult => {
  const { t, i18n } = useTranslation();

  const locale: Locale = asLocale(i18n.language);
  const setLocale = async (locale: Locale) => {
    await i18n.changeLanguage(locale);
  };

  const translator = new Intl.DisplayNames([locale], { type: "language" });

  // Translate language code to language name, e.g. "en" -> "English"
  // Fallback to native name if translation is not available
  // If the language is not supported, return the language code
  const tLang = (language: string) =>
    translator.of(language) ||
    new Intl.DisplayNames([language], { type: "language" }).of(language) ||
    language;

  return { t, tLang, i18n, locale, setLocale };
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: locales,
    resources: translations,
    fallbackLng: locales[0],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
