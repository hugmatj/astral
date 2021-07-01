import { defineStore } from 'pinia'
import { Inertia } from '@inertiajs/inertia'
import { useUserStore } from '@/store/useUserStore'
import { useStarsFilterStore } from '@/store/useStarsFilterStore'
import StarsWorker from 'worker-loader!@/workers/githubStars.worker'
import { FETCH_DIRECTIONS } from '@/constants'
import keyBy from 'lodash/keyBy'
import type {
  UserStar,
  GitHubRepo,
  GitHubRepoNode,
  RepoLanguage,
  PaginationResponse,
  FetchDirection,
  Tag,
} from '@/types'

export const useStarsStore = defineStore({
  id: 'stars',
  state() {
    return {
      isDraggingStar: false,
      userStars: [] as UserStar[],
      starredRepos: [] as GitHubRepo[],
      pageInfo: {
        startCursor: null,
        endCursor: null,
        hasNextPage: true,
      } as PaginationResponse,
      totalRepos: 0,
      selectedRepos: [] as GitHubRepoNode[],
      draggingRepos: [] as GitHubRepoNode[],
      worker: new StarsWorker(),
      hasFetchedFromStorage: false,
    }
  },
  getters: {
    userStarsByRepoId(): Record<string, UserStar> {
      return keyBy(this.userStars, (star: UserStar) => `${star.repo_id}`)
    },
    allStars(): GitHubRepo[] {
      return this.starredRepos
    },
    untaggedStars(): GitHubRepo[] {
      return this.allStars.filter(repo => {
        const userStar: UserStar = this.userStarsByRepoId[repo.node.databaseId]
        return !userStar || !userStar.tags.length
      })
    },
    filteredRepos(): GitHubRepo[] {
      const starsFilterStore = useStarsFilterStore()
      const selectedTag = starsFilterStore.selectedTag

      let filteredRepos = starsFilterStore.isFilteringByUntagged
        ? this.untaggedStars
        : this.allStars

      if (
        starsFilterStore.isFilteringByTag ||
        starsFilterStore.isFilteringByLanguage
      ) {
        if (starsFilterStore.isFilteringByTag) {
          filteredRepos = filteredRepos.filter(repo => {
            const userStar = this.userStarsByRepoId[repo.node.databaseId]

            return (
              !!userStar &&
              !!selectedTag &&
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
    languages(): RepoLanguage[] {
      return Object.entries(
        this.allStars
          .map(repo => {
            return repo.node.primaryLanguage?.name || ''
          })
          .filter(Boolean)
          .reduce((totals: Record<string, number>, lang: string): Record<
            string,
            number
          > => {
            return { ...totals, [lang]: (totals[lang] || 0) + 1 }
          }, {})
      )
        .map((language: [string, number]) => {
          const [name, count] = language

          return {
            name,
            count,
          }
        })
        .sort((a, b) => b.count - a.count)
    },
    selectedRepo(): GitHubRepoNode {
      return this.selectedRepos[0] || {}
    },
  },
  actions: {
    fetchStars(
      cursor: Nullable<string> = null,
      direction: FetchDirection = FETCH_DIRECTIONS.DESC
    ) {
      const userStore = useUserStore()

      this.worker.postMessage({
        token: userStore.user?.access_token,
        cursor,
        direction,
      })
    },
    addTagToStars(tagId: number, repoIds: number[]) {
      Inertia.post('/stars/tag', { tagId, repoIds } as any)
    },
    syncTagsToStar(repoId: number, tags: Partial<Tag>[]) {
      Inertia.put(`/star/sync-tags`, { repoId, tags } as any)
    },
    async fetchReadme(repo: GitHubRepoNode): Promise<string> {
      const userStore = useUserStore()

      const readme = await (
        await fetch(
          `https://api.github.com/repos/${repo.nameWithOwner}/readme`,
          {
            headers: {
              Accept: 'application/vnd.github.v3.html',
              Authorization: `bearer ${userStore.user?.access_token}`,
            },
          }
        )
      ).text()

      return readme
    },
  },
})
