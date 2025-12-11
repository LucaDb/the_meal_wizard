import React from 'react'
import type { DropdownOption, DropdownOptionGroup } from './Dropdown'
import styles from './Dropdown.module.scss'
import { useDropdownContext } from './dropdownContext'
import { DropdownOption as DropdownOptionComponent } from './DropdownOption'

interface DropdownListProps {
  listRef: React.RefObject<HTMLUListElement | null>
  filteredOptions: DropdownOption[]
  filteredGroups: DropdownOptionGroup[]
  onOptionKeyDown: (
    e: React.KeyboardEvent<HTMLLIElement>,
    optionValue: string
  ) => void
}

export const DropdownList = ({
  listRef,
  filteredOptions,
  filteredGroups,
  onOptionKeyDown,
}: DropdownListProps) => {
  const { id, isOpen, isLoading, ariaLabel, searchTerm, searchable } =
    useDropdownContext()

  if (!isOpen) return null

  return (
    <div
      className={styles.dropdown__menu}
      onMouseDown={e => {
        e.stopPropagation()
      }}
    >
      {isLoading ? (
        <div className={styles.dropdown__loading}>Loading...</div>
      ) : filteredGroups.length > 0 ? (
        <ul
          ref={listRef}
          id={`${id}-listbox`}
          className={styles.dropdown__list}
          role="listbox"
          aria-label={ariaLabel}
        >
          {filteredGroups.map((group, groupIndex) => (
            <React.Fragment key={group.label}>
              <li className={styles.dropdown__groupHeader} role="presentation">
                {group.label}
              </li>
              {group.options.map((option, optionIndex) => {
                const flatIndex =
                  filteredGroups
                    .slice(0, groupIndex)
                    .reduce((sum, g) => sum + g.options.length, 0) + optionIndex
                return (
                  <DropdownOptionComponent
                    key={option.value}
                    option={option}
                    index={flatIndex}
                    onOptionKeyDown={onOptionKeyDown}
                  />
                )
              })}
            </React.Fragment>
          ))}
        </ul>
      ) : filteredOptions.length === 0 ? (
        <div className={styles.dropdown__noResults}>
          {searchable && !searchTerm
            ? 'Start typing to search...'
            : 'No options found'}
        </div>
      ) : (
        <ul
          ref={listRef}
          id={`${id}-listbox`}
          className={styles.dropdown__list}
          role="listbox"
          aria-label={ariaLabel}
        >
          {filteredOptions.map((option, index) => (
            <DropdownOptionComponent
              key={option.value}
              option={option}
              index={index}
              onOptionKeyDown={onOptionKeyDown}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
