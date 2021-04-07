export interface User {
  access_token: string
  avatar: string
  github_id: number
  name: string
  username: string
  scope: string
  settings: {
    autosave_notes: boolean
    github_sponsor: boolean
    show_language_tags: boolean
  }
  created_at: Date
  updated_at: Date
}

export interface Tag {
  readonly id: number
  name: string
  readonly created_at: Date
  readonly updated_at: Date
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
  primaryLanguage?: {
    name: string
  }
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

// Utility types
export type Values<T> = T[keyof T]
