import type { PropertyInput } from '../types'

export interface ExampleScenario {
  id: string
  title: string
  summary: string
  input: PropertyInput
}

export const exampleScenarios: ExampleScenario[] = [
  {
    id: 'rear-lot-narrow-access',
    title: 'Rear lot with narrow access',
    summary: 'Strong rebuild or granny-flat case, but medium-density paths are weak. Assembly has some value.',
    input: {
      address: '12A Quietway, Blacktown NSW',
      zoning: 'R2 Low Density Residential',
      lotSize: 720,
      frontage: 10.5,
      accessWidth: 2.8,
      rearLot: true,
      cornerBlock: false,
      heritage: false,
      flood: false,
      bushfire: false,
      distanceToStation: 950,
      withinCatchment: 'false',
      userGoal: 'develop',
    },
  },
  {
    id: 'corner-near-station',
    title: 'Corner block near station',
    summary: 'A cleaner townhouse play with improved flexibility and stronger assembly upside.',
    input: {
      address: '88 Junction Road, Kogarah NSW',
      zoning: 'R3 Medium Density Residential',
      lotSize: 860,
      frontage: 20,
      accessWidth: 6,
      rearLot: false,
      cornerBlock: true,
      heritage: false,
      flood: false,
      bushfire: false,
      distanceToStation: 420,
      withinCatchment: 'true',
      userGoal: 'develop',
    },
  },
  {
    id: 'standard-suburban-block',
    title: 'Standard suburban block',
    summary: 'Practical duplex or granny-flat outcome on a normal suburban site.',
    input: {
      address: '34 Garden Street, Campbelltown NSW',
      zoning: 'R2 Low Density Residential',
      lotSize: 645,
      frontage: 15.2,
      accessWidth: 4,
      rearLot: false,
      cornerBlock: false,
      heritage: false,
      flood: false,
      bushfire: false,
      distanceToStation: 1100,
      withinCatchment: 'unknown',
      userGoal: 'rent',
    },
  },
]
