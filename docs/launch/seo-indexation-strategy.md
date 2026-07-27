# Multilingual SEO and indexation strategy

## Current safe state

The existing GitHub Pages site uses static HTML plus `?lang=en|ar|fr` client localization and `product.html?slug=…`. The sitemap contains all 34 catalogue slugs and core public routes. Admin is `noindex,nofollow,noarchive` and is not in the sitemap. No rating, review, geo, hours or unverified contact schema is used.

## Production target

Generate separate crawlable static routes for `/en/`, `/ar/` and `/fr/`, with server/static-rendered visible copy and metadata. Each equivalent must have a self-referencing same-language canonical, reciprocal hreflang links and an `x-default`. Product/model names remain unchanged while approved surrounding copy is localized.

Clean `/products/<slug>/` routes are preferable long-term, but implementing language and product route generation together immediately before launch is high regression risk. The safe launch choice is to retain query product URLs with unique runtime metadata, then migrate through a generator with redirects/canonical tests after production content and domain approval.

Do not publish hreflang for routes that do not genuinely render distinct crawlable localized content. Do not add `lastmod` unless sourced from a real content timestamp. Filter/search states remain non-canonical and excluded from sitemap.

## Structured data boundaries

Use Organization/LocalBusiness, BreadcrumbList, ItemList, WebPage/ContactPage where visible content supports them. Product schema must remain informational and must not claim ecommerce availability, shipping or checkout. Never add AggregateRating, Review, openingHours, geo, telephone or fabricated Offers.

## Pre-index gate

Exact production domain, approved translations, legal content and catalogue publication status are required before sitemap/canonical generation. Validate generated routes, reciprocal hreflang, structured data and rendered metadata before Search Console submission.
