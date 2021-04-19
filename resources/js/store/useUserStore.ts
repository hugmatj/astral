import { defineStore } from 'pinia'
import { User } from '@/types'

export const useUserStore = defineStore({
  id: 'user',
  state() {
    return {
      user: null as Nullable<User>,
    }
  },
})
