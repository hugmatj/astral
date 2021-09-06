import { defineStore } from 'pinia'
import { Inertia } from '@inertiajs/inertia'
import type { Abilities, Limits } from '@/types'
import { ABILITY_CONTEXTS } from '@/constants'

export const useAuthorizationsStore = defineStore({
  id: 'authorizations',
  state() {
    return {
      abilities: {
        [ABILITY_CONTEXTS.CREATE_TAG]: false,
        [ABILITY_CONTEXTS.ADD_NOTES]: false,
      } as Abilities,
      limits: null as Nullable<Limits>
    }
  },
  actions: {
    checkForSponsorship() {
      Inertia.get('/check-sponsorship')
    }
  }
})
