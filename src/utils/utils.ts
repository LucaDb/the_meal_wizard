/**
 * Format a timestamp into a human readable string
 * @param timestamp - The timestamp to format
 * @returns A human readable string
 */

export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / 60000)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Calculate Levenshtein distance between two strings for fuzzy matching
 * @param str1 - The first string
 * @param str2 - The second string
 * @returns The Levenshtein distance between the two strings
 */
export const levenshteinDistance = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase()
  const s2 = str2.toLowerCase()
  const matrix: number[][] = []

  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        )
      }
    }
  }

  return matrix[s2.length][s1.length]
}

/**
 * A part of a text with a highlight flag
 * @param text - The text
 * @param isHighlighted - Whether the text is highlighted
 */
export interface TextPart {
  text: string
  isHighlighted: boolean
}

/**
 * Find matching text parts in a string
 * @param text - The text
 * @param searchTerm - The search term
 * @returns An array of text parts with highlight flag
 */
export const getHighlightParts = (
  text: string,
  searchTerm: string
): TextPart[] => {
  if (!searchTerm) {
    return [{ text, isHighlighted: false }]
  }

  const lowerText = text.toLowerCase()
  const lowerSearch = searchTerm.toLowerCase()
  const index = lowerText.indexOf(lowerSearch)

  if (index === -1) {
    return [{ text, isHighlighted: false }]
  }

  const parts: TextPart[] = []

  const before = text.substring(0, index)
  if (before) {
    parts.push({ text: before, isHighlighted: false })
  }

  const match = text.substring(index, index + searchTerm.length)
  parts.push({ text: match, isHighlighted: true })

  const after = text.substring(index + searchTerm.length)
  if (after) {
    parts.push({ text: after, isHighlighted: false })
  }

  return parts
}
