import type {
  AnalysisResult,
  AssemblyAssessment,
  ConstraintItem,
  DevelopmentLabel,
  DevelopmentOptionKey,
  DevelopmentOptionResult,
  PropertyInput,
  StrategyRecommendation,
} from '../types'

interface OptionSeed {
  key: DevelopmentOptionKey
  name: string
  score: number
  reasons: string[]
  blocker: string
}

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)))

const asLabel = (score: number): DevelopmentLabel => {
  if (score >= 80) return 'very likely'
  if (score >= 65) return 'likely'
  if (score >= 45) return 'possible'
  if (score >= 25) return 'unlikely'
  return 'not suitable'
}

const cleanZoning = (zoning: string) => zoning.trim().toUpperCase()

export function analyseProperty(input: PropertyInput): AnalysisResult {
  const zoning = cleanZoning(input.zoning)
  const isR2 = zoning.includes('R2')
  const isR3 = zoning.includes('R3')
  const isR4 = zoning.includes('R4')
  const nearStation = input.distanceToStation <= 800
  const veryNearStation = input.distanceToStation <= 500
  const largeLot = input.lotSize >= 700
  const veryLargeLot = input.lotSize >= 900
  const narrowAccess = input.accessWidth < 3
  const moderateAccess = input.accessWidth >= 3 && input.accessWidth < 5
  const narrowFrontage = input.frontage < 12
  const mediumDensityFrontageIssue = input.frontage < 18

  const constraints: ConstraintItem[] = []

  if (narrowFrontage) {
    constraints.push({
      key: 'frontage-risk',
      label: 'Frontage risk',
      severity: 'high',
      detail: 'Frontage under 12m makes duplex and townhouse layouts materially harder in practice.',
    })
  } else if (mediumDensityFrontageIssue) {
    constraints.push({
      key: 'frontage-risk',
      label: 'Frontage risk',
      severity: 'medium',
      detail: 'Frontage under 18m can still work, but it narrows townhouse and multi-dwelling efficiency.',
    })
  }

  if (narrowAccess || moderateAccess) {
    constraints.push({
      key: 'access-risk',
      label: 'Access risk',
      severity: narrowAccess ? 'high' : 'medium',
      detail: narrowAccess
        ? 'Access under 3m is a serious functional and compliance risk for anything beyond a simple dwelling outcome.'
        : 'Access between 3m and 5m is workable for some uses, but it reduces flexibility for medium-density projects.',
    })
  }

  if (input.rearLot) {
    constraints.push({
      key: 'rear-lot',
      label: 'Rear-lot limitation',
      severity: 'high',
      detail: 'Battle-axe and rear lots usually underperform for townhouse and apartment-style outcomes.',
    })
  }

  if (input.flood || input.bushfire) {
    constraints.push({
      key: 'hazards',
      label: 'Flood / bushfire',
      severity: input.flood && input.bushfire ? 'high' : 'medium',
      detail: 'Hazard overlays add cost, design friction, and approval uncertainty.',
    })
  }

  if (input.heritage) {
    constraints.push({
      key: 'heritage',
      label: 'Heritage',
      severity: 'high',
      detail: 'Heritage control is a strong real-world constraint on demolition, yield, and confidence.',
    })
  }

  if (!isR2 && !isR3 && !isR4) {
    constraints.push({
      key: 'zoning-mismatch',
      label: 'Zoning mismatch',
      severity: 'medium',
      detail: 'This zoning is less straightforward than a standard low or medium density residential setting.',
    })
  }

  const seeds: OptionSeed[] = [
    {
      key: 'singleRebuild',
      name: 'Single dwelling rebuild',
      score: 72,
      reasons: ['Detached dwelling outcome is usually the most approval-friendly baseline.', 'Works even when higher-density schemes are weak.', 'Suited to owner-occupier or resale repositioning.'],
      blocker: 'Main risk is whether site constraints push construction cost too high.',
    },
    {
      key: 'grannyFlat',
      name: 'Granny flat',
      score: 55,
      reasons: ['Adds income without forcing a full density play.', 'Large sites support this better.', 'Often aligns with hold, rent, or live-plus-income strategies.'],
      blocker: 'Layout efficiency can fall away fast on awkward access or constrained rear portions.',
    },
    {
      key: 'dualOccupancy',
      name: 'Dual occupancy',
      score: 50,
      reasons: ['Can be realistic on standard suburban blocks.', 'Stronger in R2 or similar residential zones.', 'Usually simpler than townhouse development.'],
      blocker: 'Frontage and layout are the usual deal-breakers.',
    },
    {
      key: 'townhouse',
      name: 'Townhouse / multi-dwelling',
      score: 38,
      reasons: ['Can work where frontage, corner access, and medium-density zoning line up.', 'Near-station sites are more compelling.', 'Works best when the site shape is efficient.'],
      blocker: 'Small frontage or awkward access often kills the real-world feasibility.',
    },
    {
      key: 'lowRiseApartment',
      name: 'Low-rise apartment',
      score: 22,
      reasons: ['This only becomes realistic with stronger zoning and location support.', 'Station proximity helps.', 'Usually needs a larger site or assembly context.'],
      blocker: 'Most standalone suburban lots do not stack up for apartments.',
    },
    {
      key: 'landBankHold',
      name: 'Land bank / hold',
      score: 44,
      reasons: ['Holding can be sensible if immediate development is compromised.', 'Useful where future planning change or neighbourhood uplift is plausible.', 'Can preserve upside without forcing a weak project now.'],
      blocker: 'Holding only works if the market and planning story are strong enough.',
    },
    {
      key: 'assemblyOpportunity',
      name: 'Assembly opportunity',
      score: 34,
      reasons: ['Neighbour aggregation can rescue sites with weak standalone geometry.', 'Near-station land tends to attract more strategic interest.', 'Larger lots contribute better to combined redevelopment plays.'],
      blocker: 'Assembly needs neighbour alignment and a real uplift case.',
    },
  ]

  for (const option of seeds) {
    if (option.key === 'singleRebuild') {
      if (isR2 || isR3 || isR4) option.score += 8
      if (input.heritage) option.score -= 20
      if (input.flood || input.bushfire) option.score -= 10
      if (input.rearLot) option.score -= 4
    }

    if (option.key === 'grannyFlat') {
      if (largeLot) option.score += 15
      if (veryLargeLot) option.score += 5
      if (isR2) option.score += 10
      if (input.rearLot) option.score += 6
      if (narrowAccess) option.score -= 10
      if (input.heritage) option.score -= 20
      if (input.flood || input.bushfire) option.score -= 8
    }

    if (option.key === 'dualOccupancy') {
      if (isR2 || isR3) option.score += 12
      if (!narrowFrontage && input.frontage >= 14) option.score += 10
      if (input.cornerBlock) option.score += 6
      if (input.rearLot) option.score -= 20
      if (narrowAccess) option.score -= 16
      if (moderateAccess) option.score -= 8
      if (narrowFrontage) option.score -= 22
      if (input.heritage) option.score -= 24
      if (input.flood || input.bushfire) option.score -= 10
    }

    if (option.key === 'townhouse') {
      if (isR3 || isR4) option.score += 20
      if (input.cornerBlock) option.score += 14
      if (nearStation) option.score += 12
      if (veryNearStation) option.score += 5
      if (largeLot) option.score += 8
      if (input.rearLot) option.score -= 26
      if (narrowAccess) option.score -= 25
      if (moderateAccess) option.score -= 12
      if (narrowFrontage) option.score -= 24
      if (mediumDensityFrontageIssue) option.score -= 10
      if (input.heritage) option.score -= 26
      if (input.flood || input.bushfire) option.score -= 12
      if (isR2) option.score -= 8
    }

    if (option.key === 'lowRiseApartment') {
      if (isR4) option.score += 28
      if (isR3) option.score += 8
      if (veryNearStation) option.score += 18
      if (nearStation) option.score += 10
      if (veryLargeLot) option.score += 12
      if (input.withinCatchment === 'true') option.score += 8
      if (input.rearLot) option.score -= 26
      if (narrowAccess) option.score -= 18
      if (narrowFrontage) option.score -= 18
      if (input.heritage) option.score -= 30
      if (input.flood || input.bushfire) option.score -= 15
      if (isR2) option.score -= 24
    }

    if (option.key === 'landBankHold') {
      if (nearStation) option.score += 14
      if (input.withinCatchment === 'true') option.score += 10
      if (input.heritage) option.score += 8
      if (input.flood || input.bushfire) option.score -= 6
      if (input.userGoal === 'hold' || input.userGoal === 'sell') option.score += 10
      if (input.userGoal === 'develop') option.score -= 4
    }

    if (option.key === 'assemblyOpportunity') {
      if (largeLot) option.score += 16
      if (veryLargeLot) option.score += 8
      if (nearStation) option.score += 16
      if (input.withinCatchment === 'true') option.score += 12
      if (narrowFrontage) option.score += 8
      if (narrowAccess || input.rearLot) option.score += 10
      if (input.cornerBlock) option.score += 4
      if (input.heritage) option.score -= 10
      if (!nearStation && input.withinCatchment === 'false') option.score -= 8
    }

    option.score = clamp(option.score)
  }

  const options: DevelopmentOptionResult[] = seeds
    .map((option) => ({
      ...option,
      label: asLabel(option.score),
      realistic: option.score >= 45,
    }))
    .sort((a, b) => b.score - a.score)

  const developability = clamp(
    55 +
      (isR2 || isR3 || isR4 ? 10 : 0) +
      (largeLot ? 8 : 0) +
      (input.cornerBlock ? 8 : 0) +
      (nearStation ? 6 : 0) -
      (input.rearLot ? 15 : 0) -
      (narrowAccess ? 18 : moderateAccess ? 10 : 0) -
      (narrowFrontage ? 14 : mediumDensityFrontageIssue ? 6 : 0) -
      (input.heritage ? 22 : 0) -
      (input.flood ? 10 : 0) -
      (input.bushfire ? 8 : 0),
  )

  const constraint = clamp(
    18 +
      (input.rearLot ? 18 : 0) +
      (narrowAccess ? 22 : moderateAccess ? 12 : 0) +
      (narrowFrontage ? 18 : mediumDensityFrontageIssue ? 8 : 0) +
      (input.heritage ? 24 : 0) +
      (input.flood ? 12 : 0) +
      (input.bushfire ? 10 : 0),
  )

  const assemblyPotentialScore = clamp(
    20 +
      (largeLot ? 18 : 0) +
      (veryLargeLot ? 8 : 0) +
      (nearStation ? 18 : 0) +
      (input.withinCatchment === 'true' ? 16 : 0) +
      (input.rearLot ? 8 : 0) +
      (narrowAccess ? 10 : 0) +
      (narrowFrontage ? 10 : 0) -
      (input.heritage ? 8 : 0),
  )

  const assembly = getAssemblyAssessment(assemblyPotentialScore, input, nearStation)
  const strategy = getStrategyRecommendation(input, options, assembly)

  const siteSummary = [
    `${input.address || 'This site'} sits in ${input.zoning}, on a ${input.lotSize}sqm lot with ${input.frontage}m frontage and ${input.accessWidth}m access.`,
    input.rearLot
      ? 'The rear-lot configuration is a genuine drag on medium-density feasibility.'
      : input.cornerBlock
        ? 'The corner position improves access, layout flexibility, and redevelopment credibility.'
        : 'The block shape is more typical suburban stock, which supports practical low-density outcomes.',
    nearStation
      ? `At ${input.distanceToStation}m from the station, location supports stronger density or assembly interest.`
      : `At ${input.distanceToStation}m from the station, this is less of a transit-led density play and more of a practical suburban site.`,
  ]

  const nextSteps = buildNextSteps(input, options, assembly)

  return {
    input,
    siteSummary,
    scores: {
      developability,
      constraint,
      assemblyPotential: assemblyPotentialScore,
    },
    options,
    constraints,
    strategy,
    assembly,
    nextSteps,
  }
}

function getAssemblyAssessment(score: number, input: PropertyInput, nearStation: boolean): AssemblyAssessment {
  if (score >= 70) {
    return {
      level: 'high',
      explanation:
        'Standalone development is not the whole story here. The site has credible strategic value if combined with neighbours, especially given its size and location support.',
    }
  }

  if (score >= 45) {
    return {
      level: 'medium',
      explanation:
        nearStation || input.rearLot
          ? 'There is a believable assembly angle here, mainly because the standalone site is compromised but still contributes useful land to a larger scheme.'
          : 'Assembly is worth keeping in mind, but it is not yet the obvious primary play without a stronger neighbourhood uplift story.',
    }
  }

  return {
    level: 'low',
    explanation:
      'This looks more like a standalone suburban decision than a serious aggregation play right now.',
  }
}

function getStrategyRecommendation(
  input: PropertyInput,
  options: DevelopmentOptionResult[],
  assembly: AssemblyAssessment,
): StrategyRecommendation {
  const top = options[0]
  const second = options[1]
  const confidenceScore = Math.max(0, top.score - Math.max(0, options[3]?.score ?? 0))

  let confidence = 'moderate'
  if (top.score >= 75 && confidenceScore >= 25) confidence = 'high'
  else if (top.score < 55 || input.heritage || input.flood || input.bushfire) confidence = 'cautious'

  const mainRecommendation =
    top.key === 'assemblyOpportunity'
      ? 'Do not force a weak standalone project. Treat this as a strategic land position first.'
      : `The most realistic move is ${top.name.toLowerCase()}.`

  const primaryPath =
    top.key === 'singleRebuild'
      ? 'Rebuild or renovate with a clean low-density outcome.'
      : top.key === 'grannyFlat'
        ? 'Pursue a house plus granny-flat style income strategy.'
        : top.key === 'dualOccupancy'
          ? 'Test a duplex or dual occupancy pathway before chasing anything denser.'
          : top.key === 'townhouse'
            ? 'Explore a townhouse outcome, but keep the scheme disciplined and yield realistic.'
            : top.key === 'assemblyOpportunity'
              ? 'Explore neighbour aggregation rather than overreaching on a solo site.'
              : `${top.name} is the clearest current path.`

  const shortTerm =
    top.key === 'townhouse'
      ? 'Run a quick feasibility with local planning controls and a concept layout to confirm the site can carry a realistic townhouse yield.'
      : top.key === 'assemblyOpportunity'
        ? 'Map adjoining lots and quietly test whether neighbour alignment is even possible before spending on a detailed scheme.'
        : `Focus on ${top.name.toLowerCase()} because it has the best practical balance of approval likelihood and value.`

  const mediumTerm =
    second && second.score >= 50
      ? `Keep ${second.name.toLowerCase()} as the backup path if costs, approvals, or builder pricing weaken the lead strategy.`
      : assembly.level !== 'low'
        ? 'If the direct project is underwhelming, pivot to a hold or assembly discussion instead of forcing density.'
        : 'Review market timing and construction costs before committing capital, because execution risk matters more than theoretical yield.'

  const longTerm =
    assembly.level === 'high'
      ? 'The speculative upside is a larger redevelopment story through assembly or future planning uplift.'
      : nearFutureUpside(input, top, assembly)

  const bestImmediateMove = shortTerm
  const speculativeUpside = longTerm

  return {
    mainRecommendation,
    primaryPath,
    confidence,
    shortTerm,
    mediumTerm,
    longTerm,
    bestImmediateMove,
    speculativeUpside,
  }
}

function nearFutureUpside(
  input: PropertyInput,
  top: DevelopmentOptionResult,
  assembly: AssemblyAssessment,
): string {
  if (assembly.level === 'medium') {
    return 'The upside is optionality: complete a practical low-density outcome now, while preserving the ability to sell into a future assembly story.'
  }

  if (input.distanceToStation <= 800) {
    return 'The upside is future density support from location, but only if planning settings or surrounding site control improve.'
  }

  if (top.key === 'grannyFlat' || top.key === 'dualOccupancy') {
    return 'The upside is improved rental yield and resale flexibility, not a dramatic jump to apartments or dense townhouse stock.'
  }

  return 'The upside is mostly in a disciplined, realistic execution rather than a speculative planning leap.'
}

function buildNextSteps(
  input: PropertyInput,
  options: DevelopmentOptionResult[],
  assembly: AssemblyAssessment,
): string[] {
  const steps = [
    'Verify the exact zoning, overlays, and minimum lot controls with the local council planning map.',
    'Check whether any easements, driveway constraints, or existing structures affect the workable building envelope.',
    'Run a concept layout before spending on detailed consultants, because site geometry matters more than headline lot size.',
  ]

  if (input.distanceToStation <= 800 || input.withinCatchment === 'true') {
    steps.push('Confirm whether station catchment or precinct controls create any practical uplift, rather than assuming they do.')
  }

  if (assembly.level !== 'low') {
    steps.push('Identify adjoining ownership patterns and comparable nearby redevelopment sites to test the assembly case.')
  }

  if (options[0]?.key === 'townhouse' || options[0]?.key === 'lowRiseApartment') {
    steps.push('Get a quick residual feasibility done early, because density projects fail on margin before they fail on theory.')
  }

  return steps.slice(0, 5)
}
