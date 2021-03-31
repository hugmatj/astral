import { defineStore } from 'pinia'
import { Inertia } from '@inertiajs/inertia'
import Worker from '@/workers/githubStars.worker.js'

export const useStarsStore = defineStore({
  id: 'stars',
  state() {
    return {
      isDraggingStar: false,
      stars: [],
      githubStars: [],
      worker: new Worker(),
    }
  },
  actions: {
    fetchStars(token) {
      this.worker.postMessage({ token })

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
