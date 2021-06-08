import { defineStore } from 'pinia'
import { Inertia } from '@inertiajs/inertia'
import type { Abilities, Limits } from '@/types'

export const useAuthorizationsStore = defineStore({
  id: 'authorizations',
  state() {
    return {
      abilities: null as Nullable<Abilities>,
      limits: null as Nullable<Limits>
    }
  },
  actions: {
    checkForSponsorship() {
      Inertia.get('/check-sponsorship')
    }
  }
})
