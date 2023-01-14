import { defineStore } from 'pinia'
import { User } from '@/types'
import { router } from '@inertiajs/core'
import { useStarsStore } from '@/store/useStarsStore'

export const useUserStore = defineStore({
  id: 'user',
  state() {
    return {
      user: null as Nullable<User>,
    }
  },
  actions: {
    deleteUser() {
      const starsStore = useStarsStore()
      starsStore.selectedRepos = []
      starsStore.starredRepos = []
      starsStore.resetPageInfo()

      router.delete('/user')
    },
  },
})
