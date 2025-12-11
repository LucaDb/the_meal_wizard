import { createContext, useContext } from 'react'

export type FormData = Record<string, string>
export type FormErrors = Record<string, string>

export interface FormContextValue {
  formData: FormData
  formErrors: FormErrors
  updateFormData: (
    name: string,
    value: string,
    meta?: Record<string, unknown>
  ) => void
  setFormErrors: (errors: FormErrors) => void
}

export const FormContext = createContext<FormContextValue | undefined>(
  undefined
)

export function useForm(): FormContextValue {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useForm must be used within a FormProvider')
  }
  return context
}
