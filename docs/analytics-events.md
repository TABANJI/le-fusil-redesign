# Analytics events

The allow-list lives in `analytics-events.js`. Events are disabled unless both Analytics consent and a configured provider flag are true; no provider or network transport exists now. Allowed metadata is product slug, category, brand, locale, source page, UI action, anonymous session ID and timestamp. Never include name, email, phone, messages, inquiry bodies or appointment details.
