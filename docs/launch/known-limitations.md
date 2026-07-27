# Known limitations

1. Supabase runtime is prepared but not connected; no migrations or RLS runtime tests were executed.
2. Public forms and Admin/CRM/Media remain demo/local-storage flows in the currently served HTML.
3. Production provider preparation covers public catalogue reads and protected submission contract; authenticated Admin repositories still require implementation after Auth/RLS verification.
4. No production domain, DNS, HTTPS custom-domain verification or Search Console property exists.
5. Localization uses query parameters and client-side overlays; separate crawlable static locale routes are recommended before mature multilingual SEO.
6. Product routes remain query-based.
7. Legal copy, business registration, public contact details and operating hours require owner/legal approval.
8. GitHub Pages cannot supply arbitrary repository-defined security headers.
9. Browser installability, field performance and production offline/update behavior cannot be verified without the final HTTPS origin.
10. Analytics is disabled; no analytics or marketing provider is connected.

These limitations prevent a `READY FOR GO-LIVE` or `LIVE AND VERIFIED` claim.
