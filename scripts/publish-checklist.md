# Publish checklist

Use this once the correct repository remote and production URLs are confirmed.

## 1. Wire the repo remote

```bash
git remote add origin <REPO_URL>
```

If `origin` already exists and is wrong:

```bash
git remote set-url origin <REPO_URL>
```

If you are unsure whether `origin` already exists, this idempotent reset flow is safer right before release:

```bash
git remote remove origin 2>/dev/null || true
git remote add origin <REPO_URL>
```

Verify:

```bash
git remote -v
```

Then confirm the remote repository name matches the intended GitHub Pages path. If the published URL should stay `https://fintie.github.io/smart-developer/`, the remote repository should be named `smart-developer` unless you also change the workflow/base-path config.

Quick sanity check after setting `origin`:

```bash
git remote get-url origin
```

The repo name at the end of that URL should match the intended Pages path segment.

## 2. Verify local publish readiness before push

Default path:

```bash
npm run verify:prepush
```

If the custom domain is intentionally deferred for now:

```bash
npm run verify:prepush:pages-only
```

Or use the end-to-end shortcut once the repo is wired and pushed state is ready to check:

```bash
npm run verify:pages-only
```

## 3. Commit current app + deploy workflow changes

```bash
git status --short
git add .
git commit -m "Publish real-data small-developer app"
```

If your local working branch is still `master` but the target publish repository uses `main`, rename the local branch before the final push if you want the local checkout to mirror the publish branch cleanly, or push `HEAD` to `main` explicitly as a one-off.

Examples:

```bash
git branch -M main
```

or

```bash
git push -u origin HEAD:main
```

## 4. Push for GitHub Pages deployment

Push to the branch that the target repository actually uses for Pages and Actions. For the currently observed `fintie/smart-developer` repo, that branch is `main`, not `master`.

```bash
git push -u origin main
```

## 5. Verify published targets

Default published verification:

```bash
npm run verify:published
```

If the final URLs differ from the current defaults:

```bash
VERIFY_PUBLISHED_URLS=https://example1,https://example2 npm run verify:published
```

## 6. Make the custom-domain decision explicit

Choose one path before treating published verification as a release gate:

### Option A, keep the custom domain

- `public/CNAME` is already present with `smart-developer.nextgenius.com.au`
- wire GitHub Pages custom-domain settings
- wire DNS to GitHub Pages
- keep the current default `npm run verify:published` targets

### Option B, publish only to the GitHub Pages path for now

- continue using `npm run verify:prepush:pages-only` before push until the custom domain is ready
- continue verifying the GitHub Pages path explicitly until the custom domain is ready
- use this temporary release-gate command:

```bash
npm run verify:published:pages-only
```

That script currently expands to:

```bash
VERIFY_PUBLISHED_URLS=https://fintie.github.io/smart-developer/ node --experimental-fetch scripts/verify-published.mjs
```

## Current known blockers

- this workspace now has `origin=https://github.com/fintie/smart-developer.git` and local branch `main`, but after fetching the remote the histories are heavily diverged (`origin/main...HEAD` currently reports `46 47`), so this checkout should not be pushed blindly onto that repo
- the currently inspected publish repo `fintie/smart-developer` uses `main` as its remote default branch, but its fetched tip still does not look like the intended release target for this app
- even though the separate local checkout `smart-developer-publish` is clean, on `main`, and contains the expected root-path build files (`/assets/...`), the live published HTML is still serving `./frontend/assets/...`, so GitHub Pages or the custom-domain binding is still pointed at older content
- the live bundle and the stale `smart-developer-publish` checkout still contain seeded demo markers like `18 sample street, parramatta nsw`, while the current `small-developer-copilot` local build contains real-data markers like `NSW_Cadastre`, which confirms the active published target is still not this build
- before any push meant to publish this app, the repo owner needs to confirm whether `fintie/smart-developer` is truly the intended Pages source or whether the real deployment target is a different repository entirely
- a fresh fetch on 2026-05-10 made the repo-identity mismatch even clearer: `small-developer-copilot` and `origin/main` are heavily diverged (`46 47`), `origin/main:README.md` still describes an internal ML pipeline repo, and `origin/main:index.html` still points at `./frontend/assets/index-CTrcTsDX.js`, matching the currently published seeded site rather than this workspace's real-data build

## Important deployment note

The GitHub Actions deploy workflow in this app currently builds with:

```bash
VITE_BASE_PATH=/${GITHUB_REPOSITORY_NAME}/
```

So the final repository name and GitHub Pages URL must agree with the intended public path. If the intended published URL is `https://fintie.github.io/smart-developer/`, the repository name must be `smart-developer` or the workflow/base-path config must be updated before publishing.

Also note the custom-domain path expectation: the separate `smart-developer-publish` checkout is currently a root-path publish shape, with `index.html` referencing `/assets/...` and `CNAME=smart-developer.nextgenius.com.au`. That means a custom-domain publish should normally serve root-based asset paths, not `./frontend/assets/...` and not a repo-name-prefixed path. If the final release path is the custom domain, the workflow/base-path choice must explicitly match that root-path deployment model.

## Custom domain note

If `https://smart-developer.nextgenius.com.au/` is meant to be a live target, GitHub Pages also needs the custom-domain side wired correctly, typically including:

- DNS pointing at GitHub Pages
- repository Pages custom-domain settings
- a `public/CNAME` file containing `smart-developer.nextgenius.com.au`

Without that, the custom domain can keep returning a Pages 404 even after a successful deploy.

## Current known observed failures

- `https://fintie.github.io/smart-developer/` currently redirects to `https://smart-developer.nextgenius.com.au/`
- the live published HTML currently serves only the app shell with the correct title, but references older frontend assets: `/frontend/assets/index-CTrcTsDX.js` and `/frontend/assets/index-Dxs4emra.css`
- re-running `npm run verify:published:pages-only` still fails directly: after the title-only shell match and redirect to the custom domain, the strengthened verifier detects seeded app content in the live bundle and fails on `18 sample street, parramatta nsw`
- the latest recheck on 2026-05-09 shows the same result again, with `https://smart-developer.nextgenius.com.au/frontend/assets/index-CTrcTsDX.js` still identified as the seeded bundle behind the redirect from `https://fintie.github.io/smart-developer/`
- the published verifier now also spells out the structural mismatch when a shell-only deployment points at `/frontend/assets/...`: this repo's current build shape is root-path `/assets/...`, so that live asset path pattern is now treated as strong evidence that the custom domain or Pages source is still bound to an older deployment target
- the current local build shape continues to expect root-path assets, and the latest local recheck on 2026-05-09 shows `dist/index.html` now referencing `/assets/index-BAPTH0ZI.js` with `/assets/index-Dxs4emra.css`, while older local build artifacts like `index-Dq8-EfDM.js` are still present in `dist/assets/`. That sharpens the mismatch against the live `/frontend/assets/index-CTrcTsDX.js` references even further: the currently served JS hash is not this workspace's latest built JS artifact
- direct inspection of the live JS bundle at `https://smart-developer.nextgenius.com.au/frontend/assets/index-CTrcTsDX.js` confirms it is still the old seeded app: it contains `18 sample street, parramatta nsw`, `12 smith st, chatswood nsw`, and `25 harris street, pyrmont nsw`, but does not contain current real-data markers like `48 Pirrama Rd, Pyrmont NSW, Australia` or `NSW_Cadastre`
- those referenced frontend assets do not contain the current real-data app markers, so the current publish target is still serving older content than this workspace build
- a fresh recheck on 2026-05-09 also reconfirmed that the local `smart-developer-publish/assets/index-CTrcTsDX.js` bundle itself is still the old seeded app, with all three seeded address markers present and none of the current real-data markers (`48 Pirrama Rd, Pyrmont NSW, Australia`, `NSW_Cadastre`)
- this mismatch persists even though the separate local publish checkout `smart-developer-publish` currently has `main` checked out, `origin=https://github.com/fintie/smart-developer.git`, and the expected root-path files in the repository root
- another recheck on 2026-05-09 found that same `smart-developer-publish` checkout is also `behind 18` relative to `origin/main`, so it is not just stale in content, it is also stale relative to its own remote tip before any rebuild or release attempt
- inspecting those missing `origin/main` commits explains the confusing live-path evidence: the remote history includes `ec129cd` (`Updated repo structure, moved all previous files into frontend/`) plus later Pages-entrypoint fixes, which strongly fits the current live `/frontend/assets/...` references. In other words, the publish repo remote likely evolved into a different deployment layout after this stale local checkout, so local `smart-developer-publish` cannot currently be treated as an accurate mirror of the active Pages source
- direct inspection of `origin/main:index.html` in `smart-developer-publish` now confirms that remote tip is intentionally wired to `./frontend/assets/index-CTrcTsDX.js` and `./frontend/assets/index-Dxs4emra.css`, while `origin/main:frontend/index.html` points one level deeper to `./assets/...`. That neatly matches the live shell's `/frontend/assets/...` pattern and further confirms that the currently published site is following the publish repo's nested-frontend layout, not the root-level `/assets/...` build shape used by the current `small-developer-copilot` workspace
- checking the remote tip asset itself removes the last ambiguity: `origin/main:frontend/assets/index-CTrcTsDX.js` still contains the seeded markers `18 sample street, parramatta nsw`, `12 smith st, chatswood nsw`, and `25 harris street, pyrmont nsw`, and still does not contain current real-data markers like `48 Pirrama Rd, Pyrmont NSW, Australia` or `NSW_Cadastre`. So the active publish repo remote is not merely wired differently, it is actively publishing the old seeded frontend bundle
- another 2026-05-09 recheck confirmed the asset hash lines up exactly too: `smart-developer-publish` remote `origin/main:index.html` and `origin/main:frontend/index.html` both reference `index-CTrcTsDX.js` and `index-Dxs4emra.css`, which is the same hashed JS/CSS pair observed on the live site. This makes it overwhelmingly likely that the currently published site is serving directly from that seeded remote artifact pair, not from the current `small-developer-copilot` build output
- inspecting `smart-developer-publish` remote tip also found no `.github/workflows/*` deployment workflow at all. That matters because it means the active Pages publish path is probably the repository's checked-in static artifact layout itself, not a build-on-push workflow that might secretly be producing a newer bundle elsewhere. In practice, the stale seeded files visible on `origin/main` are very likely the exact files GitHub Pages is serving
- CNAME is not the differentiator here: `origin/main:CNAME`, `origin/main:frontend/CNAME`, and the current `small-developer-copilot/public/CNAME` all resolve to the same hostname, `smart-developer.nextgenius.com.au`. So the problem is no longer about choosing the right custom-domain string, it is about which repository layout and artifact set GitHub Pages is actually serving behind that domain
- another 2026-05-09 recheck of `smart-developer-publish` `origin/main:README.md` makes the repo-ownership mismatch explicit: the remote README describes `Smart Developer` as an internal ML pipeline repo with `algorithm/`, training, reranking, and explanation workflows, not as the current real-data frontend release repo. That matches the seeded publish artifact evidence and further supports treating `fintie/smart-developer` as the wrong active Pages source for the current `small-developer-copilot` app until proven otherwise
- the latest local `dist-pages` artifact check is a useful contrast point: `dist-pages/assets/index-CxHkFwVC.js` contains `NSW_Cadastre` and does **not** contain the seeded demo markers `18 sample street, parramatta nsw`, `12 smith st, chatswood nsw`, or `25 harris street, pyrmont nsw`. That means the local Pages-shaped build output is materially different from the currently published seeded bundle, even though it still cannot be deployed from this checkout until the repo/branch wiring is fixed
- the HTML entrypoints now make the deploy-target mismatch very concrete. Local `dist-pages/index.html` expects root-hosted Pages assets under `/smart-developer/assets/index-CxHkFwVC.js`, while `smart-developer-publish` remote `origin/main:index.html` still points at `./frontend/assets/index-CTrcTsDX.js`. So even before looking inside the JS bundle, the two repos are generating fundamentally different publish layouts, and the live site is still aligned with the stale nested-frontend layout rather than the current local Pages build
- another repo-state recheck on 2026-05-10 confirms there is still no local wiring movement in `small-developer-copilot`: branch is still `master`, `git remote -v` is still empty, and the README publish section still documents the same blocked sequence (`git remote add origin <REPO_URL>`, `git branch -M main`, `npm run verify:prepush:pages-only`, `git push -u origin main`). So there has still been no meaningful progress in the last hour beyond further confirmation of the unchanged repo/branch blocker
- direct inspection of that separate `smart-developer-publish/assets/index-CTrcTsDX.js` bundle shows it is also still the seeded app, not the current real-data build: it contains `18 sample street, parramatta nsw`, `12 smith st, chatswood nsw`, and `25 harris street, pyrmont nsw`, but does not contain `48 Pirrama Rd, Pyrmont NSW, Australia`, `NSW_Cadastre`, or the current live-data copy marker. So the standalone publish checkout itself is not yet a trustworthy release candidate
- published verification was previously too weak because title-only HTML could pass; the verifier has now been tightened to fail when expected app-content markers are missing and to print the referenced asset paths when shell-only deployments are encountered
- local pre-push readiness is now re-confirmed to fail for the same two blocking reasons in this checkout: no configured `origin` remote and local branch still `master` while the Pages workflow deploys from `main`; the readiness script now prints the exact next-step commands `git push -u origin HEAD:main` and `git branch -M main` to reduce ambiguity at publish time
- another fresh run of `npm run verify:publish-readiness:pages-only` on 2026-05-09 still fails with that exact same pair of issues and no new ones, which confirms there has been no local publish-readiness movement yet in the current checkout, only repeated validation of the same repo-wiring blocker
- re-running `npm run verify:publish-readiness:pages-only` still fails with the same two issues and reiterates that `https://fintie.github.io/smart-developer/` only stays unchanged if the target repository name is `smart-developer`

## What this means before the next push

Treat the GitHub Pages target as untrusted until all three line up together:

- the `origin` remote points at the intended repository
- that repository name matches the expected Pages path, or the workflow/base path is updated to compensate
- GitHub Pages for that repository is actually publishing this app, not the older ML pipeline site currently live at `https://fintie.github.io/smart-developer/`

## Fast ownership check for the current blocker

Before the next publish attempt, confirm which repository actually owns the current live custom-domain binding and Pages artifact:

1. open the GitHub Pages settings for the repository you believe should publish this app
2. confirm the custom domain is set to `smart-developer.nextgenius.com.au`
3. confirm the deploy source is the same repository and branch you expect, not an older frontend repo
4. confirm the latest Pages deployment artifact corresponds to this app build shape, meaning root assets like `/assets/...` for the custom domain or `/smart-developer/assets/...` for a repo-path deployment, not `/frontend/assets/...`

If any of those checks fail, the current live site is still bound to the wrong repository or an older deployment target, and published verification should keep failing until ownership is corrected.

## Recommended path from the current state

Given the latest evidence, the safest next publish path is to stop treating `smart-developer-publish` as the release source and publish directly from `small-developer-copilot` once repo ownership is confirmed.

Why:

- `smart-developer-publish` currently contains the old seeded bundle too, so it is not a clean fallback release candidate
- keeping two local publish sources increases the chance of pushing stale assets again
- the current app repo already contains the live-data verification scripts and the latest diagnostics

Recommended sequence once repository ownership is confirmed:

1. add or fix `origin` in `small-developer-copilot`
2. rename the local branch to `main` or push `HEAD:main`
3. run `npm run verify:prepush:pages-only`
4. push from `small-developer-copilot`
5. run `npm run verify:published:pages-only`
6. only then re-enable the custom-domain target if Pages settings and DNS clearly point at the same repo

Concrete pages-only release flow from this checkout once wiring is fixed:

```bash
git remote add origin <REPO_URL>
git remote get-url origin
git branch -M main
git status --short
git add .
git commit -m "Publish real-data small-developer app"
npm run verify:prepush:pages-only
git push -u origin main
npm run verify:published:pages-only
```

Or, after the commit is ready and the repo is wired, use the shortcut:

```bash
npm run verify:pages-only
```
