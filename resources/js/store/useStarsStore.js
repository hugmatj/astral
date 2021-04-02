import { defineStore } from 'pinia'
import { Inertia } from '@inertiajs/inertia'
import { useUserStore } from '@/store/useUserStore'
import StarsWorker from '@/workers/githubStars.worker.js'
import keyBy from 'lodash/keyBy'

export const useStarsStore = defineStore({
  id: 'stars',
  state() {
    return {
      isDraggingStar: false,
      stars: [],
      githubStars: [],
      selectedStar: {},
      worker: new StarsWorker(),
    }
  },
  getters: {
    starsById() {
      return keyBy(this.stars, star => `${star.repo_id}`)
    },
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
    async fetchReadme(repo) {
      const userStore = useUserStore()

      const readme = await (
        await fetch(
          `https://api.github.com/repos/${repo.nameWithOwner}/readme`,
          {
            headers: {
              Accept: 'application/vnd.github.v3.html',
              Authorization: `bearer ${userStore.user.access_token}`,
            },
          }
        )
      ).text()

      return readme
    },
  },
})
