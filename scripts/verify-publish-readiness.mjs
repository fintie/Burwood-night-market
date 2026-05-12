import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const expectedGithubPagesUrl = 'https://fintie.github.io/smart-developer/'
const expectedGithubPagesRepoName = 'smart-developer'
const expectedCustomDomain = 'smart-developer.nextgenius.com.au'
const requireCustomDomain = process.env.VERIFY_CUSTOM_DOMAIN !== '0'

const getCommandOutput = (command) => {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}

const remoteLines = getCommandOutput('git remote -v')
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)

const remoteNames = [...new Set(remoteLines.map((line) => line.split(/\s+/)[0]).filter(Boolean))]
const originFetchLine = remoteLines.find((line) => {
  const [name, url, direction] = line.split(/\s+/)
  return name === 'origin' && direction === '(fetch)' && Boolean(url)
}) || null
const originUrl = originFetchLine ? originFetchLine.split(/\s+/)[1] : null
const originRepoName = originUrl
  ? originUrl
      .replace(/\.git$/, '')
      .split(/[/:]/)
      .filter(Boolean)
      .at(-1) || null
  : null
const workflowText = readFileSync(new URL('../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8')
const publishedVerifierText = readFileSync(new URL('./verify-published.mjs', import.meta.url), 'utf8')
const currentBranch = getCommandOutput('git branch --show-current')
const cnamePath = new URL('../public/CNAME', import.meta.url)
const hasCname = existsSync(cnamePath)
const cnameValue = hasCname ? readFileSync(cnamePath, 'utf8').trim() : null
const originMainIndexHtml = originUrl ? getCommandOutput('git show origin/main:index.html') : ''
const originMainFrontendIndexHtml = originUrl ? getCommandOutput('git show origin/main:frontend/index.html') : ''
const originMainUsesNestedFrontendAssets = originMainIndexHtml.includes('./frontend/assets/')
const originMainFrontendUsesRootAssets = originMainFrontendIndexHtml.includes('./assets/')

const issues = []
const notes = []
const nextSteps = []

if (remoteNames.length === 0) {
  issues.push('No git remote is configured, so this checkout cannot push or deploy yet.')
  notes.push(`When wiring origin, the remote repository should normally be named ${expectedGithubPagesRepoName} if ${expectedGithubPagesUrl} is meant to stay unchanged.`)
  notes.push(`After setting the remote, sanity-check it with: git remote get-url origin`)
  nextSteps.push('git remote remove origin 2>/dev/null || true')
  nextSteps.push('git remote add origin <REPO_URL>')
  nextSteps.push('git remote get-url origin')
} else if (!originUrl) {
  notes.push('A git remote exists, but no origin fetch URL was detected. Confirm which remote GitHub Pages deployment should use.')
} else if (originRepoName !== expectedGithubPagesRepoName) {
  notes.push(`Origin currently points to repository ${originRepoName}. If ${expectedGithubPagesUrl} should remain the published URL, rename the repository to ${expectedGithubPagesRepoName} or update the workflow/base-path and published verification targets.`)
} else {
  notes.push(`Origin repository name already matches the expected GitHub Pages path segment: ${expectedGithubPagesRepoName}.`)
}

const usesRepoNameBasePath = workflowText.includes('VITE_BASE_PATH: /${{ github.event.repository.name }}/')
  || workflowText.includes('VITE_BASE_PATH=/${GITHUB_REPOSITORY_NAME}/')
const deploysFromMaster = /branches:\s*[\s\S]*?- master/.test(workflowText)
const deploysFromMain = /branches:\s*[\s\S]*?- main/.test(workflowText)

if (!usesRepoNameBasePath) {
  notes.push('Deploy workflow no longer uses the repository-name base path shortcut. Recheck published URL assumptions before pushing.')
} else {
  notes.push(`GitHub Pages path will default to the repository name, so ${expectedGithubPagesUrl} only works unchanged if the repository is named smart-developer.`)
}

if (deploysFromMain) {
  if (currentBranch && currentBranch !== 'main') {
    issues.push(`GitHub Pages deploy is configured for pushes to main, but the current branch is ${currentBranch}. Merge or push the final publish commit to main to trigger deployment.`)
    notes.push('If you want a one-off publish without renaming the local branch, use: git push -u origin HEAD:main')
    notes.push('If you want the local checkout to match the publish branch going forward, rename it first with: git branch -M main')
    nextSteps.push('git branch -M main')
    nextSteps.push('git push -u origin HEAD:main')
  } else {
    notes.push('GitHub Pages deploy is configured for pushes to main, which matches the observed publish branch on the target repository.')
  }
} else if (deploysFromMaster) {
  if (currentBranch && currentBranch !== 'master') {
    notes.push(`GitHub Pages deploy is configured for pushes to master, but the current branch is ${currentBranch}. Merge or push the final publish commit to master to trigger deployment.`)
  } else {
    notes.push('GitHub Pages deploy is configured for pushes to master, which matches the expected publish branch.')
  }
} else {
  notes.push('Deploy workflow branch trigger is not the expected simple main/master pattern. Recheck which branch actually publishes the site before pushing.')
}

const publishedVerifierChecksCustomDomain = publishedVerifierText.includes(`'https://${expectedCustomDomain}/'`)

if (!hasCname) {
  const message = `No public/CNAME file is present. If ${expectedCustomDomain} is intended to go live, add that file and wire GitHub Pages custom-domain DNS/settings.`
  if (publishedVerifierChecksCustomDomain && requireCustomDomain) {
    issues.push(message)
  } else {
    notes.push(message)
  }
} else if (cnameValue !== expectedCustomDomain) {
  if (requireCustomDomain) {
    issues.push(`public/CNAME is present but currently set to ${cnameValue}. Confirm whether that matches the intended custom domain.`)
  } else {
    notes.push(`public/CNAME is present but currently set to ${cnameValue}. Confirm whether that matches the intended custom domain.`)
  }
}

if (publishedVerifierChecksCustomDomain) {
  notes.push(`Published verification expects both ${expectedGithubPagesUrl} and https://${expectedCustomDomain}/ to work.`)
  notes.push(`If the custom domain is being deferred, run npm run verify:prepush:pages-only before push and npm run verify:published:pages-only after deploy until CNAME, Pages custom-domain settings, and DNS are ready.`)
  notes.push('Once the repo is wired and the commit is ready, npm run verify:pages-only can be used as the concise end-to-end pages-only verification path.')
  notes.push(`For a custom-domain publish, the built site should normally resolve assets from root paths like /assets/... . If the live site is still serving /frontend/assets/... , the custom domain or Pages source is still pointed at an older deployment target.`)
}

if (originMainUsesNestedFrontendAssets) {
  notes.push('Remote origin/main:index.html currently points at ./frontend/assets/..., which matches the stale published layout rather than this repo\'s current dist asset shape.')
}

if (originMainFrontendUsesRootAssets) {
  notes.push('Remote origin/main:frontend/index.html currently points at ./assets/..., which is consistent with the nested frontend layout now live behind the custom-domain redirect.')
}

const hasOrigin = Boolean(originUrl)
const onMain = currentBranch === 'main'

if (hasOrigin && onMain) {
  nextSteps.push('npm run verify:prepush:pages-only')
  nextSteps.push('git push -u origin main')
  nextSteps.push('npm run verify:published:pages-only')
  nextSteps.push('npm run verify:pages-only')
} else {
  notes.push('Once origin is configured and the branch is aligned to main, the default pages-only publish flow is: npm run verify:prepush:pages-only, git push -u origin main, npm run verify:published:pages-only')
  notes.push('After wiring is complete and the release commit is ready, npm run verify:pages-only can be used as the concise pages-only verification shortcut.')
}

notes.push(`Expected GitHub Pages repository name for the default path is ${expectedGithubPagesRepoName}.`)

console.log(JSON.stringify({
  ok: issues.length === 0,
  currentBranch,
  originUrl,
  remotes: remoteLines,
  issues,
  notes,
  nextSteps,
}, null, 2))

if (issues.length > 0) {
  process.exit(1)
}
