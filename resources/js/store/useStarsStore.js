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
      selectedLanguage: null,
      worker: new StarsWorker(),
    }
  },
  getters: {
    starsById() {
      return keyBy(this.stars, star => `${star.repo_id}`)
    },
    languages() {
      return Object.entries(
        this.githubStars
          .map(star => {
            return star.node.primaryLanguage || null
          })
          .filter(Boolean)
          .map(repo => repo.name)
          .reduce((totals, lang) => {
            return { ...totals, [lang]: (totals[lang] || 0) + 1 }
          }, {})
      )
        .map(language => {
          const [name, count] = language

          return {
            name,
            count,
          }
        })
        .sort((a, b) => b.count - a.count)
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
