import { defineStore } from 'pinia'
import { Inertia } from '@inertiajs/inertia'
import { useUserStore } from '@/store/useUserStore'
import StarsWorker from '@/workers/githubStars.worker.js'

export const useStarsStore = defineStore({
  id: 'stars',
  state() {
    return {
      isDraggingStar: false,
      stars: [],
      githubStars: [],
      worker: new StarsWorker(),
    }
  },
  actions: {
    fetchStars() {
      const userStore = useUserStore()

      this.worker.postMessage({ token: userStore.user.access_token })

      this.worker.onmessage = ({ data }) => {
        this.githubStars = this.githubStars.concat(
          data.viewer.starredRepositories.edges
        )
      }
    },
    addTagToStar(tagId, repoId) {
      Inertia.post('/stars/tag', { tagId, repoId })
    },
  },
})
