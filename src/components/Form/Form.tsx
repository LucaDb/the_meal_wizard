import { type FormEvent, type ReactNode, useId } from 'react'
import styles from './Form.module.scss'

// ============================================================================
// Form Root Component
// ============================================================================

interface FormProps {
  children: ReactNode
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void
  className?: string
}

export function Form({ children, onSubmit, className }: FormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit?.(e)
  }

  return (
    <form
      className={`${styles.form} ${className || ''}`}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  )
}

// ============================================================================
// Form.Field Component
// ============================================================================

interface FormFieldProps {
  label: string
  name: string
  required?: boolean
  error?: string
  id?: string
  children: (id: string, name: string) => ReactNode
}

function Field({
  label,
  name,
  required = false,
  error,
  id,
  children,
}: FormFieldProps) {
  const generatedId = useId()
  const fieldId = id || generatedId

  return (
    <div className={styles.formField}>
      <label htmlFor={fieldId} className={styles.formField__label}>
        {label}
        {required && <span className={styles.formField__required}>*</span>}
      </label>
      {children(fieldId, name)}
      {error && (
        <span
          id={`${fieldId}-error`}
          className={styles.formField__error}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  )
}

// ============================================================================
// Form.Actions Component
// ============================================================================

interface FormActionsProps {
  children: ReactNode
}

function Actions({ children }: FormActionsProps) {
  return <div className={styles.formActions}>{children}</div>
}

// ============================================================================
// Compound Component Export
// ============================================================================

Form.Field = Field
Form.Actions = Actions
