# Localization guide

English is the fallback; Arabic (`dir=rtl`) and French use translation overlays without changing product data. URL `?lang=` wins over namespaced localStorage, then browser language. Brand/model/calibre/SKU remain unchanged; missing localized product descriptions fall back to English. RTL uses logical properties and preserves LTR for email, phone, URL and codes. Translations require professional native-speaker review before production launch.
