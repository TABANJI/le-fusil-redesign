# Localized SEO

Query localization updates language, direction, title/OG title, canonical and `hreflang` at runtime. Search engines may treat query variants inconsistently; production should use crawlable `/en/`, `/ar/`, `/fr/` routes with server/static localized metadata and `x-default`. Until a production domain is approved, relative URLs are used and sitemap query variants are intentionally not added.
