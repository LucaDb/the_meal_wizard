import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import styles from './Dropdown.module.scss'
import { DropdownButton } from './DropdownButton'
import { DropdownContext } from './dropdownContext'
import { DropdownInput } from './DropdownInput'
import { DropdownList } from './DropdownList'
import {
  calculateDomIndex,
  filterGroups,
  filterOptions,
  getAllOptions,
} from './dropdownUtils'

export interface DropdownOption {
  value: string
  label: string
  meta?: Record<string, unknown>
}

export interface DropdownOptionGroup {
  label: string
  options: DropdownOption[]
}

interface DropdownProps {
  id?: string
  name?: string
  value: string
  options?: DropdownOption[]
  groups?: DropdownOptionGroup[]
  placeholder?: string
  isLoading?: boolean
  searchable?: boolean
  required?: boolean
  error?: string
  onSearch?: (_searchTerm: string) => void
  onChange: (_value: string) => void
  'aria-label'?: string
  'aria-describedby'?: string
}

export function Dropdown({
  id: providedId,
  name,
  value,
  options,
  groups,
  placeholder = 'Select an option...',
  isLoading = false,
  searchable = false,
  required = false,
  error,
  onSearch,
  onChange,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: DropdownProps) {
  const generatedId = useId()
  const id = providedId ?? generatedId

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const shouldScrollRef = useRef(false)

  const allOptions = getAllOptions(options, groups)
  const selectedOption = allOptions.find(opt => opt.value === value)

  // For non-searchable dropdowns, show selected value or placeholder
  // For searchable dropdowns when closed, show selected label
  const displayValue = searchable
    ? selectedOption?.label || ''
    : selectedOption?.label || placeholder

  const shouldFilter = searchable && !onSearch && searchTerm
  const filteredOptions = useMemo(() => {
    return shouldFilter ? filterOptions(allOptions, searchTerm) : allOptions
  }, [shouldFilter, allOptions, searchTerm])

  const filteredGroups = useMemo(() => {
    return groups && shouldFilter
      ? filterGroups(groups, searchTerm)
      : groups || []
  }, [groups, shouldFilter, searchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        if (!searchable) {
          setSearchTerm('')
        }
        setHighlightedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, searchable])

  useEffect(() => {
    if (onSearch && searchTerm) {
      //simple debounce
      const timeoutId = setTimeout(() => {
        onSearch(searchTerm)
      }, 300)
      return () => clearTimeout(timeoutId)
    }
  }, [onSearch, searchTerm])

  const handleToggle = () => {
    if (searchable) {
      setIsOpen(true)
      inputRef.current?.focus()
    } else {
      setIsOpen(!isOpen)
      if (!isOpen) {
        setSearchTerm('')
        setHighlightedIndex(-1)
      }
    }
  }

  const handleSelect = (optionValue: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm('')
    setHighlightedIndex(-1)
  }

  const getFlatOptions = (): DropdownOption[] => {
    if (filteredGroups.length > 0) {
      return filteredGroups.flatMap(group => group.options)
    }
    return filteredOptions
  }

  const flatOptions = getFlatOptions()

  const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      shouldScrollRef.current = true
      if (!isOpen) {
        setIsOpen(true)
        setHighlightedIndex(0)
      } else {
        setHighlightedIndex(prev =>
          prev < flatOptions.length - 1 ? prev + 1 : 0
        )
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      shouldScrollRef.current = true
      if (!isOpen) {
        setIsOpen(true)
        setHighlightedIndex(flatOptions.length - 1)
      } else {
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : flatOptions.length - 1
        )
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchTerm('')
      setHighlightedIndex(-1)
    } else if (e.key === 'Tab') {
      setIsOpen(false)
    }
  }

  const handleOptionKeyDown = (
    e: KeyboardEvent<HTMLLIElement>,
    optionValue: string
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect(optionValue)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.trimStart()
    setSearchTerm(term)
    setHighlightedIndex(-1)
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || (e.key === ' ' && !isOpen)) {
      e.preventDefault()
      shouldScrollRef.current = true
      if (!isOpen) {
        setIsOpen(true)
        setHighlightedIndex(0)
      } else if (e.key === 'ArrowDown') {
        setHighlightedIndex(prev =>
          prev < flatOptions.length - 1 ? prev + 1 : 0
        )
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      shouldScrollRef.current = true
      if (!isOpen) {
        setIsOpen(true)
        setHighlightedIndex(flatOptions.length - 1)
      } else {
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : flatOptions.length - 1
        )
      }
    } else if (e.key === 'Backspace') {
      if (
        value &&
        (searchTerm === '' || searchTerm === selectedOption?.label)
      ) {
        e.preventDefault()
        onChange('')
        setSearchTerm('')
        setHighlightedIndex(-1)
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (highlightedIndex >= 0 && flatOptions[highlightedIndex]) {
        e.preventDefault()
        handleSelect(flatOptions[highlightedIndex].value)
      } else if (e.key === 'Enter' && flatOptions.length === 1) {
        e.preventDefault()
        handleSelect(flatOptions[0].value)
      } else if (e.key === ' ' && searchTerm === '') {
        e.preventDefault()
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchTerm('')
      setHighlightedIndex(-1)
      inputRef.current?.blur()
    } else if (e.key === 'Tab') {
      setIsOpen(false)
    }
  }

  const handleInputFocus = () => {}

  const handleInputClick = () => {
    if (!isOpen) {
      setIsOpen(true)
      setSearchTerm('')

      // Highlight the currently selected option if there is one
      if (value) {
        shouldScrollRef.current = true
        const selectedIndex = flatOptions.findIndex(opt => opt.value === value)
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : -1)
      } else {
        setHighlightedIndex(-1)
      }

      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    } else {
      setIsOpen(false)
      setSearchTerm('')
      setHighlightedIndex(-1)
    }
  }

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current && shouldScrollRef.current) {
      const domIndex = calculateDomIndex(highlightedIndex, filteredGroups)
      const optionElement = listRef.current.children[domIndex] as HTMLElement
      optionElement?.scrollIntoView({ block: 'nearest' })
    }

    shouldScrollRef.current = false
  }, [highlightedIndex, filteredGroups])

  const contextValue = {
    id,
    isOpen,
    searchTerm,
    highlightedIndex,
    selectedValue: value,
    selectedLabel: selectedOption?.label,
    displayValue,
    placeholder,
    searchable,
    required,
    error,
    ariaLabel,
    ariaDescribedBy,
    isLoading,
    setIsOpen,
    setSearchTerm,
    setHighlightedIndex,
    handleToggle,
    handleSelect,
    handleInputChange,
    handleInputKeyDown,
    handleInputFocus,
    handleInputClick,
    handleButtonKeyDown,
    inputRef,
  }

  return (
    <DropdownContext.Provider value={contextValue}>
      <div
        ref={dropdownRef}
        className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ''} ${
          error ? styles.dropdownError : ''
        }`}
      >
        {name && <input type="hidden" name={name} value={value} />}
        {searchable ? <DropdownInput /> : <DropdownButton />}
        <DropdownList
          listRef={listRef}
          filteredOptions={filteredOptions}
          filteredGroups={filteredGroups}
          onOptionKeyDown={handleOptionKeyDown}
        />
      </div>
    </DropdownContext.Provider>
  )
}
