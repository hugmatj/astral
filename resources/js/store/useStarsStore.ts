import { defineStore } from 'pinia'
import { Inertia } from '@inertiajs/inertia'
import { useUserStore } from '@/store/useUserStore'
import { useStarsFilterStore } from '@/store/useStarsFilterStore'
import { removeStarQuery } from '@/queries'
import keyBy from 'lodash/keyBy'
import { Dictionary, every, some, reject, get } from 'lodash'
import {
  UserStar,
  GitHubRepo,
  GitHubRepoNode,
  RepoLanguage,
  PaginationResponse,
  FetchDirection,
  StarMetaInput,
  TagEditorTag,
} from '@/types'
import {
  PredicateGroup,
  Predicate,
  stringOperators,
  numberOperators,
  tagOperators,
  dateOperators,
  languageOperators,
  stateOperators,
  PredicateOperator,
  PredicateTarget,
} from '@/utils/predicates'
export const useStarsStore = defineStore({
  id: 'stars',
  state() {
    return {
      isDraggingRepo: false,
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
      worker: new Worker(new URL('/resources/js/workers/githubStars.worker.ts', window.location.href), {
        type: 'module',
      }),
      hasFetchedFromStorage: false,
    }
  },
  getters: {
    userStarsByRepoId(): Dictionary<UserStar> {
      return keyBy(this.userStars, (star: UserStar) => `${star.repo_id}`)
    },
    allStars(): GitHubRepo[] {
      return this.starredRepos
    },
    untaggedStars(): GitHubRepo[] {
      return this.allStars.filter((repo) => {
        const userStar: UserStar = this.userStarsByRepoId[repo.node.databaseId]

        return !userStar || !userStar.tags?.length
      })
    },
    filteredRepos(): GitHubRepo[] {
      const starsFilterStore = useStarsFilterStore()
      const selectedTag = starsFilterStore.selectedTag

      let filteredRepos = starsFilterStore.isFilteringByUntagged ? this.untaggedStars : this.allStars

      if (starsFilterStore.isFilteringByTag || starsFilterStore.isFilteringByLanguage) {
        if (starsFilterStore.isFilteringByTag) {
          filteredRepos = filteredRepos.filter((repo) => {
            const userStar = this.userStarsByRepoId[repo.node.databaseId]

            return !!userStar && !!selectedTag && userStar.tags.map((tag) => tag.id).includes(selectedTag.id)
          })
        }

        if (starsFilterStore.isFilteringByLanguage) {
          filteredRepos = filteredRepos.filter(
            (repo: GitHubRepo) => repo.node.primaryLanguage?.name === starsFilterStore.selectedLanguage
          )
        }
      }

      if (starsFilterStore.isFilteringBySmartFilter && starsFilterStore.selectedSmartFilter) {
        const predicate = JSON.parse(starsFilterStore.selectedSmartFilter.body)

        const logicalTypeMap = {
          any: some,
          all: every,
          none: reject,
        } as const

        const operators: PredicateOperator[] = [
          ...stringOperators,
          ...numberOperators,
          ...tagOperators,
          ...dateOperators,
          ...languageOperators,
          ...stateOperators,
        ]

        filteredRepos = this.allStars.filter((repo) => {
          return predicate.groups.every((group: PredicateGroup) => {
            // @ts-ignore
            return get(logicalTypeMap, group.logicalType)(group.predicates, (p: Predicate) => {
              const operator: Maybe<PredicateOperator> = operators.find((o) => o.key === p.operator)
              if (operator) {
                if (get(repo, p.selectedTarget)) {
                  return operator.check(get(repo, p.selectedTarget), p.argument)
                } else {
                  return operator.check(get(repo, (p.argument as PredicateTarget).key))
                }
              }
            })
          })
        })
      }

      if (starsFilterStore.isFilteringBySearch) {
        const search = starsFilterStore.search

        filteredRepos = filteredRepos.filter((repo: GitHubRepo) => {
          const starNotes = this.userStarsByRepoId[repo.node.databaseId]?.notes || ''
          const repoTextHaystack = [repo.node.nameWithOwner, repo.node.description, starNotes]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          const repoHasStringMatches = search.strings.every((searchString) => repoTextHaystack.includes(searchString))

          if (search.tags.length) {
            const repoTagNames = (this.userStarsByRepoId[repo.node.databaseId]?.tags || []).map((tag) =>
              tag.name.toLowerCase()
            )
            const repoHasTagMatches = search.tags.every((tag) => repoTagNames.includes(tag))

            return repoHasTagMatches && repoHasStringMatches
          } else {
            return repoHasStringMatches
          }
        })
      }

      return filteredRepos
    },
    languages(): RepoLanguage[] {
      return Object.entries(
        this.allStars
          .map((repo) => {
            return repo.node.primaryLanguage?.name || ''
          })
          .filter(Boolean)
          .reduce((totals: Record<string, number>, lang: string): Record<string, number> => {
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
    isAnyRepoSelected(): boolean {
      return !!Object.keys(this.selectedRepo).length
    },
  },
  actions: {
    fetchStars(cursor: Nullable<string> = null, direction: FetchDirection = FetchDirection.DESC) {
      const userStore = useUserStore()

      this.worker.postMessage({
        token: userStore.user?.access_token,
        cursor,
        direction,
      })
    },
    addTagToStars(tagId: number, repos: StarMetaInput[]) {
      Inertia.post('/stars/tag', { tagId, repos } as any, { only: ['stars', 'tags', 'abilities'] })
    },
    syncTagsToStar(starInput: StarMetaInput, tags: TagEditorTag[]) {
      Inertia.put(`/star/sync-tags`, { ...starInput, tags } as any, { only: ['stars', 'tags', 'abilities', 'errors'] })
    },
    async fetchReadme(repo: GitHubRepoNode): Promise<string> {
      const userStore = useUserStore()

      const readme = await (
        await fetch(`https://api.github.com/repos/${repo.nameWithOwner}/readme`, {
          headers: {
            Accept: 'application/vnd.github.v3.html',
            Authorization: `bearer ${userStore.user?.access_token}`,
          },
        })
      ).text()

      return readme
    },
    async removeStar(id: string) {
      const userStore = useUserStore()
      const repo: Maybe<GitHubRepo> = this.starredRepos.find((repo) => repo.node.id === id)

      await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `bearer ${userStore.user?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: removeStarQuery(id),
        }),
      })

      if (repo) {
        const userStar: Maybe<UserStar> = this.userStars.find((star) => star.repo_id === repo.node.databaseId)
        this.selectedRepos = this.selectedRepos.filter((selectedRepo) => selectedRepo.id !== id)
        this.starredRepos.splice(this.starredRepos.indexOf(repo), 1)

        if (userStar) {
          Inertia.delete(`/star/${userStar.id}`, { only: ['stars', 'tags', 'abilities'] })
        }
      }
    },
    resetPageInfo() {
      this.pageInfo = {
        startCursor: null,
        endCursor: null,
        hasNextPage: true,
      }
    },
  },
})
