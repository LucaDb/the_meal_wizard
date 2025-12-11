import styles from './Dropdown.module.scss'
import { useDropdownContext } from './dropdownContext'

export const DropdownArrow = () => {
  const { isOpen } = useDropdownContext()

  return (
    <span
      className={`${styles.dropdown__arrow} ${
        isOpen ? styles.dropdown__arrowOpen : ''
      }`}
      aria-hidden="true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none" />
        <polyline
          points="208 96 128 176 48 96"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="24"
        />
      </svg>
    </span>
  )
}
