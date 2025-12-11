import styles from './Dropdown.module.scss'
import { DropdownArrow } from './DropdownArrow'
import { useDropdownContext } from './dropdownContext'

export const DropdownButton = () => {
  const {
    id,
    displayValue,
    selectedLabel,
    isOpen,
    error,
    required,
    ariaLabel,
    ariaDescribedBy,
    handleToggle,
    handleButtonKeyDown,
  } = useDropdownContext()

  return (
    <button
      type="button"
      id={id}
      className={styles.dropdown__button}
      onClick={handleToggle}
      onKeyDown={handleButtonKeyDown}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-invalid={error ? 'true' : 'false'}
      aria-required={required}
    >
      <span
        className={`${styles.dropdown__value} ${
          !selectedLabel ? styles.dropdown__valuePlaceholder : ''
        }`}
      >
        {displayValue}
      </span>
      <DropdownArrow />
    </button>
  )
}
