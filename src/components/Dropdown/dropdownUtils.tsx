import React from 'react'
import { getHighlightParts, levenshteinDistance } from '../../utils/utils'
import type { DropdownOption, DropdownOptionGroup } from './Dropdown'
import styles from './Dropdown.module.scss'

/**
 * Highlight matching text in option label with Dropdown styles
 */
export const highlightMatch = (
  text: string,
  searchTerm: string
): React.ReactNode => {
  const parts = getHighlightParts(text, searchTerm)

  return (
    <>
      {parts.map((part, index) =>
        part.isHighlighted ? (
          <mark key={index} className={styles.dropdown__highlight}>
            {part.text}
          </mark>
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        )
      )}
    </>
  )
}

/**
 * Get all options from groups or flat options array
 */
export const getAllOptions = (
  options: DropdownOption[] | undefined,
  groups: DropdownOptionGroup[] | undefined
): DropdownOption[] => {
  if (groups && groups.length > 0) {
    return groups.flatMap(group => group.options)
  }
  return options || []
}

/**
 * Filter and score options based on search term
 */
export const filterOptions = (
  allOptions: DropdownOption[],
  searchTerm: string
): DropdownOption[] => {
  if (!searchTerm || allOptions.length === 0) {
    return allOptions
  }

  const searchLower = searchTerm.toLowerCase()
  const maxDistance = Math.min(3, Math.floor(searchTerm.length / 2)) // Allow up to 3 character differences or half the search length

  return allOptions
    .map(opt => {
      const labelLower = opt.label.toLowerCase()

      // Exact match (contains)
      if (labelLower.includes(searchLower)) {
        const index = labelLower.indexOf(searchLower)
        return { option: opt, score: index } // Lower score (better) for earlier matches
      }

      // Fuzzy match using Levenshtein distance
      const distance = levenshteinDistance(searchTerm, opt.label)
      if (distance <= maxDistance) {
        return { option: opt, score: 100 + distance } // Higher score for fuzzy matches
      }

      return null
    })
    .filter(
      (item): item is { option: DropdownOption; score: number } => item !== null
    )
    .sort((a, b) => a.score - b.score) // Sort by score (exact matches first, then fuzzy)
    .map(item => item.option)
}

/**
 * Filter groups based on search term
 */
export const filterGroups = (
  groups: DropdownOptionGroup[],
  searchTerm: string
): DropdownOptionGroup[] => {
  if (!groups || groups.length === 0 || !searchTerm) {
    return groups
  }

  const searchLower = searchTerm.toLowerCase()
  const maxDistance = Math.min(3, Math.floor(searchTerm.length / 2))

  return groups
    .map(group => {
      const filteredOptions = group.options
        .map(opt => {
          const labelLower = opt.label.toLowerCase()

          if (labelLower.includes(searchLower)) {
            const index = labelLower.indexOf(searchLower)
            return { option: opt, score: index }
          }

          const distance = levenshteinDistance(searchTerm, opt.label)
          if (distance <= maxDistance) {
            return { option: opt, score: 100 + distance }
          }

          return null
        })
        .filter(
          (item): item is { option: DropdownOption; score: number } =>
            item !== null
        )
        .sort((a, b) => a.score - b.score)
        .map(item => item.option)

      if (filteredOptions.length > 0) {
        return { label: group.label, options: filteredOptions }
      }
      return null
    })
    .filter((item): item is DropdownOptionGroup => item !== null)
}

/**
 * Calculate the DOM index for a flat option index accounting for group headers
 */
export const calculateDomIndex = (
  highlightedIndex: number,
  filteredGroups: DropdownOptionGroup[]
): number => {
  if (filteredGroups.length === 0) {
    return highlightedIndex
  }

  let optionsCount = 0
  for (const group of filteredGroups) {
    if (highlightedIndex < optionsCount + group.options.length) {
      // Found the group, add 1 for the header, then the offset within the group
      return (
        filteredGroups.slice(0, filteredGroups.indexOf(group)).reduce(
          (sum, g) => sum + 1 + g.options.length, // +1 for each group header
          0
        ) +
        1 + // +1 for current group header
        (highlightedIndex - optionsCount)
      )
    }
    optionsCount += group.options.length
  }

  return highlightedIndex
}
