import React from 'react'
import styles from './Dropdown.module.scss'
import { useDropdownContext } from './dropdownContext'
import { highlightMatch } from './dropdownUtils'

interface DropdownOptionProps {
  option: {
    value: string
    label: string
    meta?: Record<string, unknown>
  }
  index: number
  onOptionKeyDown: (
    e: React.KeyboardEvent<HTMLLIElement>,
    optionValue: string
  ) => void
}

export const DropdownOption = ({
  option,
  index,
  onOptionKeyDown,
}: DropdownOptionProps) => {
  const {
    selectedValue,
    highlightedIndex,
    searchable,
    searchTerm,
    handleSelect,
    setHighlightedIndex,
  } = useDropdownContext()

  const isSelected = option.value === selectedValue
  const isHighlighted = index === highlightedIndex

  const thumbnail = option.meta?.thumb as string | undefined

  return (
    <li
      role="option"
      aria-selected={isSelected}
      className={`${styles.dropdown__option} ${
        isSelected ? styles.dropdown__optionSelected : ''
      } ${isHighlighted ? styles.dropdown__optionHighlighted : ''} ${
        thumbnail ? styles.dropdown__optionWithThumb : ''
      }`}
      onMouseDown={e => {
        e.stopPropagation()
      }}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        handleSelect(option.value, e)
      }}
      onKeyDown={e => onOptionKeyDown(e, option.value)}
      onMouseEnter={() => setHighlightedIndex(index)}
    >
      {thumbnail && (
        <img src={thumbnail} alt="" className={styles.dropdown__optionThumb} />
      )}
      <span className={styles.dropdown__optionLabel}>
        {searchable && searchTerm
          ? highlightMatch(option.label, searchTerm)
          : option.label}
      </span>
    </li>
  )
}
