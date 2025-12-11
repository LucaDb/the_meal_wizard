import { Tabs } from '@components/Tabs'
import { History } from '@sections/History'
import { PageHeader } from '@sections/PageHeader'
import { Search } from '@sections/Search'
import { StepForm } from '@sections/StepForm'
import { useState } from 'react'
import styles from './App.module.scss'

function App() {
  const [activeTab, setActiveTab] = useState('wizard')

  return (
    <main className={styles.root}>
      <div className={styles.container}>
        <PageHeader
          title="Find a recipe based on your preferences!"
          description="Tell us what you're in the mood for and we'll recommend a delicious recipe for you!"
        />

        <Tabs value={activeTab} onChange={tab => setActiveTab(tab)}>
          <Tabs.List>
            <Tabs.Tab value="wizard">Wizard</Tabs.Tab>
            <Tabs.Tab value="search">Search</Tabs.Tab>
            <Tabs.Tab value="history">History</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="wizard">
            <StepForm />
          </Tabs.Panel>

          <Tabs.Panel value="search">
            <Search />
          </Tabs.Panel>

          <Tabs.Panel value="history">
            <History />
          </Tabs.Panel>
        </Tabs>
      </div>
    </main>
  )
}

export default App
