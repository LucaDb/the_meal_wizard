import styles from './Dropdown.module.scss'
import { DropdownArrow } from './DropdownArrow'
import { useDropdownContext } from './dropdownContext'

export const DropdownInput = () => {
  const {
    id,
    inputRef,
    placeholder,
    isOpen,
    error,
    required,
    ariaLabel,
    ariaDescribedBy,
    selectedLabel,
    selectedValue,
    searchTerm,
    handleInputChange,
    handleInputKeyDown,
    handleInputFocus,
    handleInputClick,
  } = useDropdownContext()

  const showFloatingLabel = selectedValue && !searchTerm
  const hideInputText = selectedValue && !searchTerm
  const inputValue = searchTerm
  const inputPlaceholder = showFloatingLabel ? '' : placeholder

  return (
    <div className={styles.dropdown__inputWrapper} onClick={handleInputClick}>
      {showFloatingLabel && (
        <span className={styles.dropdown__floatingLabel} aria-hidden="true">
          {selectedLabel}
        </span>
      )}
      <input
        ref={inputRef}
        type="text"
        id={id}
        className={styles.dropdown__input}
        style={
          hideInputText
            ? { color: 'transparent', caretColor: 'transparent' }
            : {}
        }
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onFocus={handleInputFocus}
        placeholder={inputPlaceholder}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required}
        aria-autocomplete="list"
        aria-controls={`${id}-listbox`}
      />
      <DropdownArrow />
    </div>
  )
}
