const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search'
const NOMINATIM_CONTACT_EMAIL = 'opensource@nextgenius.com.au'
const NSW_CADASTRE_QUERY_ENDPOINT =
  'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Cadastre/MapServer/9/query'
const NSW_LAND_ZONING_QUERY_ENDPOINT =
  'https://mapprod3.environment.nsw.gov.au/arcgis/rest/services/Planning/Principal_Planning_Layers/MapServer/11/query'

const ADDRESSES = [
  '48 Pirrama Rd, Pyrmont NSW, Australia',
  '12 Smith St, Chatswood NSW, Australia',
  '25 Harris Street, Pyrmont NSW, Australia',
]

const REQUEST_TIMEOUT_MS = 15000
const MAX_RETRIES = 2
const CADASTRE_REQUEST_TIMEOUT_MS = 25000
const CADASTRE_MAX_RETRIES = 3

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchJsonWithRetry(url, label, options = {}) {
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS
  const maxRetries = options.maxRetries ?? MAX_RETRIES
  let lastError = null

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'small-developer-copilot/0.0.0 (verification script)',
        },
        signal: controller.signal,
      })

      if (!response.ok) throw new Error(`${label} failed with status ${response.status}`)
      return await response.json()
    } catch (error) {
      lastError = error
      if (attempt === maxRetries) break
      await sleep(1000 * (attempt + 1))
    } finally {
      clearTimeout(timeout)
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError)
  throw new Error(`${label} failed after ${maxRetries + 1} attempts: ${message}`)
}

function normalizeComparableText(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(street|st)\b/g, 'st')
    .replace(/\b(road|rd)\b/g, 'rd')
    .replace(/\b(avenue|ave)\b/g, 'ave')
    .replace(/\b(place|pl)\b/g, 'pl')
    .replace(/\b(drive|dr)\b/g, 'dr')
    .replace(/\b(lane|ln)\b/g, 'ln')
    .replace(/\b(crescent|cres)\b/g, 'cres')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseAddressQuery(address) {
  const [streetLine = '', suburbLine = ''] = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  const streetMatch = streetLine.match(/^(\d+[a-zA-Z]?)\s+(.+)$/)

  return {
    houseNumber: streetMatch?.[1]?.toLowerCase() || '',
    streetName: normalizeComparableText(streetMatch?.[2] || streetLine),
    suburbHint: normalizeComparableText(suburbLine.replace(/\bNSW\b/gi, '').replace(/\bAustralia\b/gi, '')),
  }
}

function scoreNominatimResults(results, address) {
  const expected = parseAddressQuery(address)

  return results
    .map((result) => {
      const houseNumber = result.address?.house_number?.toLowerCase() || ''
      const road = normalizeComparableText(result.address?.road || '')
      const locality = normalizeComparableText(
        result.address?.suburb ||
          result.address?.town ||
          result.address?.city ||
          result.address?.village ||
          '',
      )

      let score = 0
      if (expected.houseNumber && houseNumber === expected.houseNumber) score += 4
      if (expected.streetName && road === expected.streetName) score += 3
      if (expected.suburbHint && locality.includes(expected.suburbHint)) score += 2

      return { result, score, houseNumber, road, locality }
    })
    .sort((left, right) => right.score - left.score)
}

function pickBestNominatimResult(results, address) {
  const expected = parseAddressQuery(address)
  const scored = scoreNominatimResults(results, address)

  const best = scored[0]
  if (!best) return null

  if (expected.houseNumber && best.houseNumber !== expected.houseNumber) return null
  if (expected.streetName && best.road !== expected.streetName) return null

  return best.result
}

async function fetchLiveAddressMatch(address) {
  const normalizedAddress = address.trim()
  const query = /\bAustralia\b/i.test(normalizedAddress)
    ? normalizedAddress
    : [normalizedAddress, 'NSW', 'Australia'].filter(Boolean).join(', ')
  const url = new URL(NOMINATIM_ENDPOINT)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '5')
  url.searchParams.set('countrycodes', 'au')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('email', NOMINATIM_CONTACT_EMAIL)
  url.searchParams.set('q', query)

  const results = await fetchJsonWithRetry(url, 'Geocoding')
  const best = pickBestNominatimResult(results, normalizedAddress)
  const candidates = scoreNominatimResults(results, normalizedAddress)
    .slice(0, 3)
    .map(({ result, score, houseNumber, road, locality }) => ({
      score,
      houseNumber: houseNumber || null,
      road: road || null,
      locality: locality || null,
      displayName: result.display_name,
    }))

  if (!best) {
    return {
      displayName: null,
      suburb: null,
      postcode: null,
      lat: null,
      lon: null,
      candidates,
    }
  }

  const locality =
    best.address?.suburb ||
    best.address?.town ||
    best.address?.city ||
    best.address?.village ||
    ''

  return {
    displayName: best.display_name,
    suburb: locality,
    postcode: best.address?.postcode || '',
    lat: best.lat,
    lon: best.lon,
    candidates,
  }
}

async function readCadastre(url) {
  const payload = await fetchJsonWithRetry(url, 'Cadastre lookup', {
    timeoutMs: CADASTRE_REQUEST_TIMEOUT_MS,
    maxRetries: CADASTRE_MAX_RETRIES,
  })
  if (payload.error) throw new Error(payload.error.message || 'Cadastre lookup failed')
  return payload.features ?? []
}

function featureDistance(feature, targetLat, targetLon) {
  const points = feature.geometry?.rings?.flat() || []
  if (!points.length) return Number.POSITIVE_INFINITY

  let minLat = Number.POSITIVE_INFINITY
  let maxLat = Number.NEGATIVE_INFINITY
  let minLon = Number.POSITIVE_INFINITY
  let maxLon = Number.NEGATIVE_INFINITY

  for (const [pointLon, pointLat] of points) {
    minLon = Math.min(minLon, pointLon)
    maxLon = Math.max(maxLon, pointLon)
    minLat = Math.min(minLat, pointLat)
    maxLat = Math.max(maxLat, pointLat)
  }

  const centerLon = (minLon + maxLon) / 2
  const centerLat = (minLat + maxLat) / 2
  return Math.hypot(centerLon - targetLon, centerLat - targetLat)
}

function buildCadastreUrl(geometry, geometryType, returnGeometry = false) {
  const url = new URL(NSW_CADASTRE_QUERY_ENDPOINT)
  url.searchParams.set('f', 'json')
  url.searchParams.set('geometry', geometry)
  url.searchParams.set('geometryType', geometryType)
  url.searchParams.set('inSR', '4326')
  url.searchParams.set('outSR', '4326')
  url.searchParams.set('spatialRel', 'esriSpatialRelIntersects')
  url.searchParams.set('outFields', 'lotnumber,planlabel,planlotarea,planlotareaunits,lotidstring')
  url.searchParams.set('returnGeometry', returnGeometry ? 'true' : 'false')
  return url
}

async function fetchCadastreMatch(lat, lon) {
  const targetLat = Number(lat)
  const targetLon = Number(lon)

  const pointFeatures = await readCadastre(buildCadastreUrl(`${lon},${lat}`, 'esriGeometryPoint'))
  const point = pointFeatures[0]?.attributes
  if (point) return point

  const envelopeFeatures = await readCadastre(
    buildCadastreUrl(
      `${targetLon - 0.0002},${targetLat - 0.0002},${targetLon + 0.0002},${targetLat + 0.0002}`,
      'esriGeometryEnvelope',
      true,
    ),
  )

  return envelopeFeatures
    .filter((feature) => feature.attributes)
    .sort((left, right) => featureDistance(left, targetLat, targetLon) - featureDistance(right, targetLat, targetLon))[0]
    ?.attributes ?? null
}

async function fetchLandZoningMatch(lat, lon) {
  const url = new URL(NSW_LAND_ZONING_QUERY_ENDPOINT)
  url.searchParams.set('f', 'json')
  url.searchParams.set('geometry', `${lon},${lat}`)
  url.searchParams.set('geometryType', 'esriGeometryPoint')
  url.searchParams.set('inSR', '4326')
  url.searchParams.set('outSR', '4326')
  url.searchParams.set('spatialRel', 'esriSpatialRelIntersects')
  url.searchParams.set('outFields', 'EPI_NAME,LGA_NAME,LAY_CLASS,SYM_CODE,MAP_NAME,EPI_TYPE')
  url.searchParams.set('returnGeometry', 'false')

  const payload = await fetchJsonWithRetry(url, 'Land zoning lookup', {
    timeoutMs: CADASTRE_REQUEST_TIMEOUT_MS,
    maxRetries: CADASTRE_MAX_RETRIES,
  })

  if (payload.error) throw new Error(payload.error.message || 'Land zoning lookup failed')
  return payload.features?.[0]?.attributes ?? null
}

for (const address of ADDRESSES) {
  const live = await fetchLiveAddressMatch(address)
  const cadastre = live?.lat && live?.lon ? await fetchCadastreMatch(live.lat, live.lon) : null
  const zoning = live?.lat && live?.lon ? await fetchLandZoningMatch(live.lat, live.lon) : null
  console.log(JSON.stringify({
    address,
    match: live?.displayName ?? null,
    coordinates: live?.lat && live?.lon ? `${live.lat},${live.lon}` : null,
    suburb: live?.suburb ?? null,
    postcode: live?.postcode ?? null,
    lot: cadastre?.lotnumber ?? null,
    plan: cadastre?.planlabel ?? null,
    lotArea: cadastre?.planlotarea ?? null,
    lotAreaUnits: cadastre?.planlotareaunits ?? null,
    lotIdString: cadastre?.lotidstring ?? null,
    zoningCode: zoning?.SYM_CODE ?? null,
    zoningClass: zoning?.LAY_CLASS ?? null,
    zoningPlan: zoning?.EPI_NAME ?? null,
    zoningLga: zoning?.LGA_NAME ?? null,
    candidateMatches: live?.candidates ?? [],
  }))
}
