export type UserGoal = 'develop' | 'hold' | 'sell' | 'live' | 'rent'

export type CatchmentStatus = 'true' | 'false' | 'unknown'

export type DevelopmentOptionKey =
  | 'singleRebuild'
  | 'grannyFlat'
  | 'dualOccupancy'
  | 'townhouse'
  | 'lowRiseApartment'
  | 'landBankHold'
  | 'assemblyOpportunity'

export type DevelopmentLabel =
  | 'very likely'
  | 'likely'
  | 'possible'
  | 'unlikely'
  | 'not suitable'

export interface PropertyInput {
  address: string
  zoning: string
  lotSize: number
  frontage: number
  accessWidth: number
  rearLot: boolean
  cornerBlock: boolean
  heritage: boolean
  flood: boolean
  bushfire: boolean
  distanceToStation: number
  withinCatchment: CatchmentStatus
  userGoal: UserGoal
}

export interface ScoreBreakdown {
  developability: number
  constraint: number
  assemblyPotential: number
}

export interface DevelopmentOptionResult {
  key: DevelopmentOptionKey
  name: string
  score: number
  label: DevelopmentLabel
  reasons: string[]
  blocker: string
  realistic: boolean
}

export interface ConstraintItem {
  key: string
  label: string
  severity: 'low' | 'medium' | 'high'
  detail: string
}

export interface StrategyRecommendation {
  mainRecommendation: string
  primaryPath: string
  confidence: string
  shortTerm: string
  mediumTerm: string
  longTerm: string
  bestImmediateMove: string
  speculativeUpside: string
}

export interface AssemblyAssessment {
  level: 'low' | 'medium' | 'high'
  explanation: string
}

export interface AnalysisResult {
  input: PropertyInput
  siteSummary: string[]
  scores: ScoreBreakdown
  options: DevelopmentOptionResult[]
  constraints: ConstraintItem[]
  strategy: StrategyRecommendation
  assembly: AssemblyAssessment
  nextSteps: string[]
}
