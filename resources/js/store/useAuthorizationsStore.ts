import { defineStore } from 'pinia'
import { Inertia } from '@inertiajs/inertia'
import { Ability, Limit, Limits, Authorizations } from '@/types'

export const useAuthorizationsStore = defineStore({
  id: 'authorizations',
  state() {
    return {
      abilities: {
        [Ability.CREATE_TAG]: false,
        [Ability.ADD_NOTES]: false,
      } as Authorizations,
      limits: {
        [Limit.MAX_TAGS]: -1,
      } as Limits,
    }
  },
  actions: {
    checkForSponsorship() {
      Inertia.get('/check-sponsorship')
    }
  }
})
