import { createContext, useContext } from 'react'

export interface ToastMessage {
  id: string
  message: string
  duration?: number
}

export interface ErrorContextValue {
  showError: (message: string, duration?: number) => void
  dismissToast: (id: string) => void
}

export const ErrorContext = createContext<ErrorContextValue | undefined>(
  undefined
)

export function useError(): ErrorContextValue {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}
