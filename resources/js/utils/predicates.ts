export interface Predicate {
  selectedTarget: string
  operator: string
  argument: unknown
}

export interface PredicateGroup {
  logicalType: 'any' | 'all' | 'none'
  predicates: Predicate[]
}

export interface PredicateOperator {
  key: string
  label: string
}

export type PredicateTargetType = 'String' | 'Number' | 'State' | 'Tags' | 'Language' | 'Date'

export interface PredicateTarget {
  label: string
  key: string
  type: PredicateTargetType
  operators: PredicateOperator[]
  defaultValue?: unknown | (() => unknown)
}

export const defaultPredicate: Predicate = {
  selectedTarget: 'node.nameWithOwner',
  operator: 'is',
  argument: '',
}

export const defaultGroup: PredicateGroup = {
  logicalType: 'any',
  predicates: [{ ...defaultPredicate }],
}

const stringOperators: PredicateOperator[] = [
  { key: 'is', label: 'is' },
  { key: 'contains', label: 'contains' },
  { key: 'notContains', label: "doesn't contain" },
  { key: 'isnt', label: "isn't" },
]

const numberOperators: PredicateOperator[] = [
  { key: 'greaterThan', label: '>' },
  { key: 'greaterThanOrEqualTo', label: '>=' },
  { key: 'equals', label: '=' },
  { key: 'lessThan', label: '<' },
  { key: 'lessThanOrEqualTo', label: '<=' },
]

const tagOperators: PredicateOperator[] = [
  { key: 'hasAnyTags', label: 'has any' },
  { key: 'hasAllTags', label: 'has all' },
  { key: 'hasNoneTags', label: 'has none' },
]

const dateOperators: PredicateOperator[] = [
  { key: 'before', label: 'before' },
  { key: 'after', label: 'after' },
]

const languageOperators: PredicateOperator[] = [
  { key: 'hasAnyLanguage', label: 'has any' },
  { key: 'hasNoneLanguage', label: 'has none' },
]

const stateOperators: PredicateOperator[] = [
  { key: 'isState', label: 'is' },
  { key: 'isntState', label: "isn't" },
]

export const predicateTargets: PredicateTarget[] = [
  {
    label: 'Name',
    key: 'node.nameWithOwner',
    type: 'String',
    operators: stringOperators,
    defaultValue: '',
  },
  {
    label: 'Description',
    key: 'node.description',
    type: 'String',
    operators: stringOperators,
    defaultValue: '',
  },
  {
    label: 'Notes',
    key: 'notes',
    type: 'String',
    operators: stringOperators,
    defaultValue: '',
  },
  {
    label: 'Star Count',
    key: 'node.stargazers.totalCount',
    type: 'Number',
    operators: numberOperators,
    defaultValue: '0',
  },
  {
    label: 'Tags',
    key: 'tags',
    type: 'Tags',
    operators: tagOperators,
    defaultValue: [],
  },
  {
    label: 'Language',
    key: 'node.primaryLanguage.name',
    type: 'Language',
    operators: languageOperators,
    defaultValue: [],
  },
  {
    label: 'State',
    type: 'State',
    key: 'astralRepoState',
    operators: stateOperators,
    defaultValue: { key: 'node.isArchived', label: 'archived' },
  },
  {
    label: 'Updated At',
    type: 'Date',
    key: 'node.pushedAt',
    operators: dateOperators,
  },
]
