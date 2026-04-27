import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "./ru.json";
import uz from "./uz.json";
import uzCyrl from "./uz_cyrl.json";

// ✅ SAFE locale detection (Expo SDK 49+ / 50+ / 51+)
const rawLocale = Localization.getLocales()?.[0]?.languageTag ?? "uz";

const locale = rawLocale.toLowerCase();

// ✅ language resolver
const getLang = () => {
  if (locale.startsWith("ru")) return "ru";
  if (locale.startsWith("uz-cyrl")) return "uz-Cyrl";
  return "uz";
};

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    "uz-Cyrl": { translation: uzCyrl },
    ru: { translation: ru },
  },

  lng: getLang(), // ✅ initial language
  fallbackLng: "uz",

  interpolation: {
    escapeValue: false,
  },

  // i18next 23+ / v26 types: plural format; use "v4" (not "v3")
  compatibilityJSON: "v4",
});

export default i18n;
