import React, { useCallback, useState, type ReactNode } from 'react'
import { Toast } from '../components/Toast'
import { ErrorContext, type ToastMessage } from './errorContext'

interface ErrorProviderProps {
  children: ReactNode
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showError = useCallback((message: string, duration = 5000) => {
    const id = `${Date.now()}-${Math.random()}`
    const toast: ToastMessage = { id, message, duration }

    setToasts(prev => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ErrorContext.Provider
      value={{
        showError,
        dismissToast,
      }}
    >
      {children}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              onDismiss={() => dismissToast(toast.id)}
            />
          ))}
        </div>
      )}
    </ErrorContext.Provider>
  )
}
