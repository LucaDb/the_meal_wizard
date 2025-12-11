import { createContext, useContext } from 'react'

export interface TabsContextValue {
  value: string
  tabValues: string[]
  keyboardNavigating: boolean
  onChange: (value: string) => void
  registerTab: (value: string) => void
  unregisterTab: (value: string) => void
  setKeyboardNavigating: (value: boolean) => void
}

export const TabsContext = createContext<TabsContextValue | undefined>(
  undefined
)

export function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tab/Panel must be used within Tabs')
  }
  return context
}
