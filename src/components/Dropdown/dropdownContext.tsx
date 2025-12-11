import React, { createContext, useContext } from 'react'

interface DropdownContextValue {
  id?: string
  isOpen: boolean
  searchTerm: string
  highlightedIndex: number
  selectedValue: string
  selectedLabel?: string
  displayValue: string
  placeholder: string
  searchable: boolean
  required: boolean
  error?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  isLoading: boolean
  setIsOpen: (isOpen: boolean) => void
  setSearchTerm: (term: string) => void
  setHighlightedIndex: (index: number) => void
  handleToggle: () => void
  handleSelect: (value: string, e?: React.MouseEvent) => void
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handleInputFocus: () => void
  handleInputClick: () => void
  handleButtonKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void
  inputRef: React.RefObject<HTMLInputElement | null>
}

export const DropdownContext = createContext<DropdownContextValue | undefined>(
  undefined
)

export const useDropdownContext = () => {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error('useDropdownContext must be used within DropdownProvider')
  }
  return context
}
