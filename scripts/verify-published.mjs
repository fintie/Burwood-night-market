const DEFAULT_URLS = ['https://fintie.github.io/Burwood-night-market/']

const urls = (process.env.VERIFY_PUBLISHED_URLS || DEFAULT_URLS.join(','))
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)

const expectedSnippets = [
  'Interactive English concept site for generated design directions, stakeholder review, and GitHub Pages publishing',
  'Generated concept direction only, derived from your materials without directly reusing the original images.',
  'Walk-in video draft',
  'Real-time prompt editor',
]

const expectedTitles = ['burwood-night-market', 'small-developer-copilot']

for (const url of urls) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'burwood-night-market/0.1.0 (published verification)',
      accept: 'text/html,application/xhtml+xml',
    },
  })

  const body = await response.text()
  const title = body.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || null
  const matchingTitle = title && expectedTitles.includes(title) ? title : null
  const matchedSnippet = expectedSnippets.find((snippet) => body.includes(snippet)) || null

  console.log(
    JSON.stringify({
      url,
      finalUrl: response.url,
      ok: response.ok,
      status: response.status,
      title,
      matchedSnippet,
      matchedTitle: matchingTitle,
    }),
  )

  if (!response.ok) {
    throw new Error(`${url} returned status ${response.status}`)
  }

  if (!matchedSnippet && !matchingTitle) {
    throw new Error(`${url} did not include an expected Burwood Night Market marker${title ? ` (title: ${title})` : ''}`)
  }
}
