import React, { useState, type ReactNode } from 'react'

import type { FormData, FormErrors } from './formContext'
import { FormContext, type FormContextValue } from './formContext'

interface FormProviderProps {
  children: ReactNode
  initialData?: FormData
}

export const FormProvider: React.FC<FormProviderProps> = ({ 
  children,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<FormData>(initialData)
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const updateFormData = (
    name: string,
    value: string,
    meta?: Record<string, unknown>
  ) => {
    setFormData({
      ...formData,
      [name]: value,
      ...(meta && Object.keys(meta).length > 0
        ? { [`${name}_meta`]: JSON.stringify(meta) }
        : {}),
    })

    if (name in formErrors) {
      const newErrors = { ...formErrors }
      delete newErrors[name]
      setFormErrors(newErrors)
    }
  }

  const value: FormContextValue = {
    formData,
    formErrors,
    updateFormData,
    setFormErrors,
  }

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}
