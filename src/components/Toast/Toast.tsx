import React, { useEffect, useState } from 'react'
import styles from './Toast.module.scss'

interface ToastProps {
  message: string
  onDismiss: () => void
}

export const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss()
    }, 300)
  }

  return (
    <div
      className={`${styles.toast} ${isVisible ? styles['toast--visible'] : ''}`}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.toast__content}>
        <span className={styles.toast__icon}>⚠️</span>
        <span className={styles.toast__message}>{message}</span>
      </div>
      <button
        className={styles.toast__close}
        onClick={handleDismiss}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  )
}
