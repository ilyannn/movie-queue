import { defaultLocale } from "./default";

export const locales = ["en", "de", "ru", "uk"] as const;
export type Locale = (typeof locales)[number];

export const translations = Object.fromEntries(
  locales.map((locale) => [
    locale,
    {
      translation: require(`./${locale}`).default,
    },
  ])
);

type LocalizationKeys = typeof defaultLocale;

export type LocalizationPaths = {
  [K in keyof LocalizationKeys]: LocalizationKeys[K] extends object
    ? `${K}.${keyof LocalizationKeys[K] & string}`
    : K;
}[keyof LocalizationKeys];

interface LocaleOption {
  locale: Locale;
  i18n_key: LocalizationPaths;
  native: string;
}

export const localeOptions: LocaleOption[] = locales.map((locale) => ({
  locale,
  i18n_key: `languages.${locale}`,
  native: translations[locale].translation.languages[locale],
}));
