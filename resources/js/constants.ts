import { FetchDirections, AbilityContexts } from '@/types'

export const FETCH_DIRECTIONS: FetchDirections = {
  DESC: 'DESC',
  ASC: 'ASC',
} as const

export const ABILITY_CONTEXTS: AbilityContexts = {
  CREATE_TAG: 'create_tag',
  ADD_NOTES: 'add_notes'
} as const
