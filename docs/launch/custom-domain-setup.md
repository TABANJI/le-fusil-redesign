# Custom domain launch process

Status: **blocked — exact domain, canonical preference and DNS provider are not supplied**. No `CNAME` file or DNS-specific value has been added.

## Required decisions

Provide the exact owned domain, registrar/DNS provider, repository owner/default Pages hostname, and choose one canonical form: apex or `www`. Inventory current A/AAAA/ALIAS/ANAME/CNAME/MX/TXT/CAA records before any edit. Preserve all mail and unrelated verification records.

## Safe order of operations

1. Enable account 2FA and verify the domain in GitHub account/organization Pages settings using the exact TXT value GitHub provides. Keep that TXT record.
2. Add the chosen custom domain in repository Pages settings before pointing DNS, reducing takeover risk.
3. Consult the current official GitHub Pages DNS table immediately before the change. Do not copy IP values from this repository.
4. Configure the chosen apex or subdomain record and, where desired, the complementary `www`/apex redirect arrangement.
5. Never create wildcard records. Do not delete or alter MX records.
6. Verify with `Resolve-DnsName` on Windows and allow normal DNS propagation.
7. Enable HTTPS only after the certificate is issued; verify no mixed content.
8. Update centralized production URL configuration, canonical/OG/hreflang/sitemap/robots/JSON-LD/manifest/Auth redirects in one reviewed change.
9. Run the full production-like QA and preserve a rollback record.

GitHub recommends domain verification before use and warns against wildcard DNS records. Current procedures and supported record types must be taken from the [official custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [domain verification guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-a-custom-domain-for-your-github-pages-site), and [HTTPS guide](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).

## Security ownership

- Registrar, GitHub and Supabase accounts require 2FA and protected recovery codes outside the repository.
- Grant least access and document domain renewal ownership.
- Keep verification TXT records; review CAA before certificate troubleshooting.
- GitHub Pages domain configuration is not complete until both DNS and repository settings agree and HTTPS is verified.

No domain-specific action is authorized until the user supplies the exact domain and explicitly approves the change.
