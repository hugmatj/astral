import { defineStore } from 'pinia'
import { Inertia } from '@inertiajs/inertia'
import { useUserStore } from '@/store/useUserStore'
import { useStarsFilterStore } from '@/store/useStarsFilterStore'
import StarsWorker from 'worker-loader!@/workers/githubStars.worker.js'
import keyBy from 'lodash/keyBy'
import { UserStar, GitHubRepo, GitHubRepoNode, Tag } from '@/types'

export const useStarsStore = defineStore({
  id: 'stars',
  state() {
    return {
      isDraggingStar: false,
      userStars: [] as UserStar[],
      starredRepos: [] as GitHubRepo[],
      pageInfo: {
        starCursor: null as string,
        endCursor: null as string,
      },
      totalRepos: 0,
      selectedRepo: {} as GitHubRepoNode,
      worker: new StarsWorker(),
    }
  },
  getters: {
    userStarsByRepoId() {
      return keyBy(this.userStars, (star: UserStar) => `${star.repo_id}`)
    },
    allStars(): GitHubRepo[] {
      return this.starredRepos
    },
    untaggedStars(): GitHubRepo[] {
      return (this.starredRepos as GitHubRepo[]).filter(repo => {
        const userStar: UserStar = this.userStarsByRepoId[repo.node.databaseId]
        return !userStar || !userStar.tags.length
      })
    },
    filteredRepos(): GitHubRepo[] {
      const starsFilterStore = useStarsFilterStore()
      const selectedTag = starsFilterStore.selectedTag

      let filteredRepos: GitHubRepo[] = starsFilterStore.isFilteringByUntagged
        ? this.untaggedStars
        : this.allStars

      if (
        starsFilterStore.isFilteringByTag ||
        starsFilterStore.isFilteringByLanguage
      ) {
        if (starsFilterStore.isFilteringByTag) {
          filteredRepos = filteredRepos.filter(repo => {
            const userStar: UserStar = this.userStarsByRepoId[
              repo.node.databaseId
            ]

            return (
              !!userStar &&
              userStar.tags.map(tag => tag.id).includes(selectedTag.id)
            )
          })
        }

        if (starsFilterStore.isFilteringByLanguage) {
          filteredRepos = filteredRepos.filter(
            (repo: GitHubRepo) =>
              repo.node.primaryLanguage?.name ===
              starsFilterStore.selectedLanguage
          )
        }
      }

      return filteredRepos
    },
    languages() {
      return Object.entries(
        this.starredRepos
          .map((repo: GitHubRepo) => {
            return repo.node.primaryLanguage || null
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
        .sort((a: any, b: any) => b.count - a.count)
    },
  },
  actions: {
    fetchStars() {
      const userStore = useUserStore()

      this.worker.postMessage({ token: userStore.user.access_token })

      this.worker.onmessage = ({ data }) => {
        this.starredRepos = this.starredRepos.concat(
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
