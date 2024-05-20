import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import settings from "@/config/settings";
import translations from "@/locales";
import type { AppLang } from "@/types";

const resources: { [T in AppLang]: { translation: object } } = {
  en: {
    translation: translations.en,
  },
  ru: {
    translation: translations.ru,
  },
  uz: {
    translation: translations.uz,
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: localStorage.getItem("i18nextLng") ?? settings.defaultLanguage,

    keySeparator: false,

    interpolation: {
      escapeValue: false,
    },
  })
  .catch((err) => {
    console.error(err);
  });
