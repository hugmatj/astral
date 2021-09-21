import { Ref } from 'vue'

export interface User {
  access_token: string
  avatar: string
  github_id: number
  name: string
  username: string
  scope: string
  settings: {
    autosave_notes: boolean
    show_language_tags: boolean
  }
  created_at: Date
  updated_at: Date
}

export interface Tag {
  readonly id: number
  name: string
  created_at: Date
  updated_at: Date
  sort_order: number
  readonly stars_count: number
  readonly user_id: number
}

export interface UserStar {
  readonly id: number
  readonly repo_id: number
  readonly user_id: number
  notes?: string
  tags: Tag[]
  readonly created_at: Date
  readonly updated_at: Date
}

export interface GitHubRepoNode {
  databaseId: number
  defaultBranchRef: {
    name: string
  }
  description?: string
  forkCount: number
  id: string
  isArchived: boolean
  nameWithOwner: string
  primaryLanguage: Nullable<{ name: string }>
  releases?: {
    edges: Array<{ node: { tagName: string } }>
  }
  stargazers: {
    totalCount: number
  }
  url: string
}

export interface GitHubRepo {
  cursor: string
  node: GitHubRepoNode
}

export interface RepoLanguage {
  name: string
  count: number
}

export interface StarDragDataTransferData {
  tag: Tag
  repoIds: number[]
}

export interface PaginationResponse {
  startCursor: Nullable<string>
  endCursor: Nullable<string>
  hasNextPage: boolean
}

export enum FetchDirections {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type FetchDirection = keyof typeof FetchDirections

export enum Ability {
  CREATE_TAG = 'create_tag',
  ADD_NOTES = 'add_notes',
}

export type Authorizations = Record<Ability, boolean>

export enum Limit {
  MAX_TAGS = 'max_tags',
}

export type Limits = Record<Limit, number>

export type TagSortMethod = keyof Pick<Tag, 'stars_count' | 'name'>

export enum AuthScope {
  READ_USER = 'read:user',
  PUBLIC_REPO = 'public_repo',
}

export interface BaseDialogReturnType {
  isOpen: Ref<boolean>
  show(): void
  hide(): void
}
