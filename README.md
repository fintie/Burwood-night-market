# smart-developer

Deployment target for the Small Developer Copilot app.

Published via GitHub Pages from the `main` branch using GitHub Actions.

## Current status

This version supports live address matching for ordinary Australian addresses through OpenStreetMap Nominatim geocoding.

When an exact live address is found, the app now populates NSW cadastre-backed parcel fields such as plan / DP, lot, lot area, and NSW land zoning where supported. Ambiguous street-level geocoder results are still rejected rather than attaching parcel data to the wrong property.

Important limitation: broader planning controls and overlays are still **not connected yet**. So the honest product state is:

- live address lookup: yes, for exact matches only
- real NSW cadastre parcel facts: yes, where an exact supported match is found
- real NSW land zoning: yes, where an exact supported match is found
- broader overlays and enrichment such as frontage / flood / bushfire / heritage: not yet
- demo seeded properties: yes

## Release check

Current verification status: `npm run verify:release` passed on 2026-04-30 after confirming one exact live address + cadastre match (`48 Pirrama Rd, Pyrmont NSW`) and two rejected ambiguous/non-exact samples.

Before publishing, run:

```bash
npm run verify:prepush
```

The repo now includes `public/CNAME` for `smart-developer.nextgenius.com.au`.

If the custom domain is intentionally deferred for now, use:

```bash
npm run verify:prepush:pages-only
```

Once the repo is wired, the release commit is ready, and you want the concise pages-only release gate, you can also use:

```bash
npm run verify:pages-only
```

After publishing, verify the deployed site itself with:

```bash
npm run verify:published
```

The published verifier now also fails loudly when a target URL is serving a known wrong site or a GitHub Pages 404, so it is safe to use as a release gate once the correct remote and URLs are wired.

Use Node `>=20.19.0 || >=22.12.0` for the build and verification path.

`npm run verify:prepush` runs:

- `npm run verify:publish-readiness`
- `npm run verify:release`

`npm run verify:prepush:pages-only` runs:

- `npm run verify:publish-readiness:pages-only`
- `npm run verify:release`

`npm run verify:release` runs both:

- `npm run verify:live-data`
- `npm run build`

`npm run verify:published` checks the published HTML for the expected current live-data copy markers on:

- `https://fintie.github.io/smart-developer/`
- `https://smart-developer.nextgenius.com.au/`

You can override the checked URLs with `VERIFY_PUBLISHED_URLS=url1,url2`.

If the custom domain is not being published yet, use the pages-only published verifier and check only the GitHub Pages path explicitly with:

```bash
npm run verify:published:pages-only
```

That helper currently checks only:

```bash
VERIFY_PUBLISHED_URLS=https://fintie.github.io/smart-developer/ node --experimental-fetch scripts/verify-published.mjs
```

If you need to debug only the custom-domain binding after Pages is otherwise live, use:

```bash
npm run verify:published:custom-domain-only
```

Current publish blockers from this workspace: this checkout does not have a git remote configured yet, and the local branch is still `master` while the GitHub Pages workflow deploys from `main`. So the app can be verified locally, but it still cannot be pushed cleanly from here until the intended repository/Pages target is confirmed and the branch mismatch is corrected. The local publish-readiness verifier now prints the exact next-step commands from this checkout too: `git remote remove origin 2>/dev/null || true`, `git remote add origin <REPO_URL>`, `git remote get-url origin`, `git branch -M main`, and `git push -u origin HEAD:main`. When the remote is confirmed, the cleanest fix is usually `git branch -M main` before the final push.

When the intended publish repo is confirmed, the shortest clean publish path from this checkout is:

```bash
git remote add origin <REPO_URL>
git branch -M main
npm run verify:prepush:pages-only
git push -u origin main
npm run verify:published:pages-only
```

If the custom domain is already fully wired and expected to pass, use the full verification path instead:

```bash
npm run verify:prepush
git push -u origin main
npm run verify:published
```

Latest observed published-state diagnostics before that blocker is resolved, rechecked on 2026-05-09 after another `npm run verify:published:pages-only` run:

- `https://fintie.github.io/smart-developer/` currently redirects to `https://smart-developer.nextgenius.com.au/`.
- the published HTML shell returns `200` with the correct title, but the referenced JS bundle is still `/frontend/assets/index-CTrcTsDX.js`, not this workspace's current build output.
- that live JS bundle still contains seeded demo content such as `18 sample street, parramatta nsw`, so published verification correctly fails because the live target is still serving the older seeded frontend bundle instead of the current real-data cadastre/zoning build.
- the latest re-run still resolves `https://fintie.github.io/smart-developer/` to `https://smart-developer.nextgenius.com.au/` and fails on the same seeded bundle marker, so there has still been no published-state movement yet, only repeat confirmation of the same binding/deploy-target problem.

## Deployment

GitHub Pages deploys from the `main` branch via `.github/workflows/deploy-pages.yml`.

Important: the Vite base path comes from `VITE_BASE_PATH`, and the deploy workflow currently sets it to `/${{ github.event.repository.name }}/`.

That means the final repository name and published GitHub Pages path must match. If the intended public URL is `https://fintie.github.io/smart-developer/`, then either:

- the repository name must be `smart-developer`, or
- the workflow/base-path configuration must be changed before publishing.
