import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import styles from './Tabs.module.scss'
import { TabsContext, useTabsContext } from './tabsContext'

// ============================================================================
// Tabs.List Component
// ============================================================================

interface TabListProps {
  children: ReactNode
}

function TabList({ children }: TabListProps) {
  const {
    value: activeValue,
    onChange,
    tabValues,
    setKeyboardNavigating,
  } = useTabsContext()

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabValues.indexOf(activeValue)
    let nextIndex: number | null = null

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabValues.length - 1
        break
      case 'ArrowRight':
        event.preventDefault()
        nextIndex = currentIndex < tabValues.length - 1 ? currentIndex + 1 : 0
        break
      case 'Home':
        event.preventDefault()
        nextIndex = 0
        break
      case 'End':
        event.preventDefault()
        nextIndex = tabValues.length - 1
        break
    }

    if (nextIndex !== null && tabValues[nextIndex]) {
      setKeyboardNavigating(true)
      onChange(tabValues[nextIndex])
    }
  }

  return (
    <div className={styles.tabs} role="tablist" onKeyDown={handleKeyDown}>
      {children}
    </div>
  )
}

// ============================================================================
// Tabs.Tab Component
// ============================================================================

interface TabProps {
  value: string
  children: ReactNode
}

function Tab({ value, children }: TabProps) {
  const {
    value: activeValue,
    onChange,
    registerTab,
    unregisterTab,
    keyboardNavigating,
    setKeyboardNavigating,
  } = useTabsContext()
  const isActive = activeValue === value
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    registerTab(value)
    return () => unregisterTab(value)
  }, [value, registerTab, unregisterTab])

  useEffect(() => {
    if (isActive && buttonRef.current && keyboardNavigating) {
      buttonRef.current.focus()
      setKeyboardNavigating(false)
    }
  }, [isActive, keyboardNavigating, setKeyboardNavigating])

  const panelId = `panel-${value}`
  const tabId = `tab-${value}`

  return (
    <button
      ref={buttonRef}
      id={tabId}
      className={`${styles.tabs__button} ${
        isActive ? styles['tabs__button--active'] : ''
      }`}
      onClick={() => onChange(value)}
      onFocus={() => {
        if (!isActive) {
          onChange(value)
        }
      }}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
    >
      {children}
    </button>
  )
}

// ============================================================================
// Tabs.Panel Component
// ============================================================================

interface TabPanelProps {
  value: string
  children: ReactNode
}

function TabPanel({ value, children }: TabPanelProps) {
  const { value: activeValue } = useTabsContext()
  const isActive = value === activeValue

  const panelId = `panel-${value}`
  const tabId = `tab-${value}`

  return (
    <div
      id={panelId}
      className={styles.tabs__panel}
      role="tabpanel"
      aria-labelledby={tabId}
      hidden={!isActive}
      tabIndex={0}
    >
      {isActive ? children : null}
    </div>
  )
}

// ============================================================================
// Tabs Root Component
// ============================================================================

interface TabsProps {
  value: string
  onChange: (value: string) => void
  children: ReactNode
}

export function Tabs({ value, onChange, children }: TabsProps) {
  const [tabValues, setTabValues] = useState<string[]>([])
  const [keyboardNavigating, setKeyboardNavigating] = useState(false)

  const registerTab = useCallback((tabValue: string) => {
    setTabValues(prev => {
      if (!prev.includes(tabValue)) {
        return [...prev, tabValue]
      }
      return prev
    })
  }, [])

  const unregisterTab = useCallback((tabValue: string) => {
    setTabValues(prev => prev.filter(v => v !== tabValue))
  }, [])

  return (
    <TabsContext.Provider
      value={{
        value,
        tabValues,
        keyboardNavigating,
        onChange,
        registerTab,
        unregisterTab,
        setKeyboardNavigating,
      }}
    >
      {children}
    </TabsContext.Provider>
  )
}

// ============================================================================
// Compound Component Exports
// ============================================================================

Tabs.List = TabList
Tabs.Tab = Tab
Tabs.Panel = TabPanel
