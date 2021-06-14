import { FetchDirections, AbilityContext } from '@/types'

export const FETCH_DIRECTIONS: FetchDirections = {
  DESC: 'DESC',
  ASC: 'ASC',
} as const

export const ABILITY_CONTEXTS: Record<Uppercase<AbilityContext>, AbilityContext> = {
  CREATE_TAG: 'create_tag'
} as const
