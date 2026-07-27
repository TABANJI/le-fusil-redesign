# Final production QA checklist

Status legend: **P** pass locally; **B** blocked by missing production credentials/domain; **D** deferred to production-like runtime. This checklist contains 200 explicit launch checks.

## A. HTML and routing (1–20)

1 P routes open; 2 P internal links; 3 P no empty href; 4 P no `javascript:void`; 5 P no Windows paths; 6 P no localhost URLs; 7 P duplicate IDs; 8 P one H1 where appropriate; 9 P heading review; 10 P skip links; 11 P breadcrumbs; 12 P back links; 13 P 404; 14 P offline page; 15 P Pages-relative paths; 16 P query safety; 17 P invalid product slug; 18 P history navigation; 19 P hash/header offset; 20 P external-link rel.

## B. Homepage (21–30)

21 P hero dimensions; 22 P hero CTAs; 23 P Signature Collection; 24 P Selected Houses; 25 P categories; 26 P Jdeideh address; 27 P viewing CTA; 28 P footer; 29 P mobile hero; 30 P Arabic RTL hero.

## C. Collection (31–55)

31 P products render; 32 P maker filter; 33 P category; 34 P calibre; 35 P combined filters; 36 P brand search; 37 P model search; 38 P calibre search; 39 P name sort; 40 P price sort; 41 P maker sort; 42 P chips; 43 P remove one filter; 44 P clear all; 45 P empty state; 46 P Load More; 47 P mobile drawer; 48 P Escape; 49 P focus return; 50 P shortlist; 51 P product links; 52 P availability request; 53 P query persistence; 54 P invalid query; 55 P RTL filters.

## D. Product (56–75)

56 P main image; 57 P thumbnails; 58 P lightbox; 59 P zoom; 60 P keyboard; 61 P mobile swipe; 62 P preload; 63 P specifications; 64 P empty-field suppression; 65 P related products; 66 P viewing CTA; 67 P desktop sticky summary; 68 P mobile sticky CTA; 69 P invalid slug; 70 P one-image product; 71 P multi-image product; 72 P missing optional data; 73 P RTL; 74 P 200% zoom; 75 P reduced motion.

## E. Contact and appointment (76–100)

76 P address; 77 P encoded Maps URL; 78 P `_blank`; 79 P `noopener noreferrer`; 80 P no coordinates; 81 P labels; 82 P email flow; 83 P phone flow; 84 P +961; 85 P international phone; 86 P invalid email; 87 P missing contact; 88 P past date; 89 P consent; 90 P product context; 91 P invalid context; 92 P success copy; 93 P no fake confirmation; 94 P CRM-compatible record; 95 P source; 96 P locale; 97 P preferred time; 98 P Arabic form; 99 P French form; 100 P keyboard completion.

## F. Localization (101–115)

101 P EN; 102 P AR; 103 P FR; 104 P baseline missing keys; 105 P no displayed raw keys spot-check; 106 P `lang`; 107 P `dir`; 108 P URL state; 109 P mixed-direction address; 110 P product names; 111 P prices; 112 P date controls; 113 P accessible switcher; 114 P locale persistence; 115 P runtime metadata. Static localized URLs remain Phase 6 work.

## G. Accessibility (116–135)

116 P keyboard; 117 P visible focus; 118 P order; 119 P modal trap; 120 P Escape; 121 P focus return; 122 P contrast spot-check; 123 P labels; 124 P ARIA references; 125 P live regions; 126 P 200% zoom; 127 P 400% spot-check; 128 P text spacing; 129 P 44px targets; 130 P reduced motion; 131 P landmarks; 132 P alt text review; 133 P decorative images; 134 P non-color errors; 135 P native controls.

## H. Performance (136–150)

136 P hero dimensions; 137 P lazy below-fold images; 138 P object-fit review; 139 P stable intrinsic sizing; 140 P listener review; 141 P local browser console smoke test; 142 P no observed unhandled promise; 143 P single renderers; 144 P search is synchronous over small local dataset (debounce unnecessary); 145 P stable grids; 146 P CSS audit; 147 P JS audit; 148 P unused-media inventory available; 149 P cache review; 150 P SW version present.

## I. SEO (151–170)

151 P title presence; 152 P descriptions; 153 P canonical presence; 154 D production hreflang architecture; 155 D x-default; 156 P Open Graph; 157 P Twitter metadata on primary pages; 158 P Organization review; 159 P LocalBusiness address; 160 P schema claim review; 161 P breadcrumbs; 162 P robots; 163 P sitemap; 164 P no staging metadata; 165 P no localhost; 166 P no Windows path; 167 B production domain absent; 168 P public pages indexable; 169 P Admin noindex; 170 D final query canonical strategy.

## J. Security and privacy (171–185)

171 P secret scan; 172 P no service-role key in frontend; 173 P no password committed; 174 P no form PII in URL; 175 P analytics allowlist; 176 P no PII logging; 177 P query values resolved/escaped; 178 P storage corruption fallbacks; 179 D CSP depends on hosting; 180 P external links; 181 P consent manager; 182 P Cookie Settings; 183 P privacy links; 184 P demo retention disclosed; 185 B production Admin auth absent.

## K. PWA (186–200)

186 P manifest parses; 187 P icons; 188 P theme colors; 189 P start URL; 190 P scope; 191 P offline fallback; 192 P SW install code review; 193 P update strategy review; 194 P cache version; 195 P Admin excluded from explicit cache; 196 P forms are not queued; 197 D installability on production HTTPS; 198 P offline navigation design; 199 P Pages subpath review; 200 D custom-domain verification.
