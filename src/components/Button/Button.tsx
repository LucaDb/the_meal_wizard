import { type ReactNode } from 'react'
import styles from './Button.module.scss'

export interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit' | 'reset'
  className?: string
  onClick?: () => void
}

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  className,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}
