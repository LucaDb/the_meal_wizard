import styles from './PageHeader.module.scss'

interface PageHeaderProps {
  title: string
  description: string
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.pageHeader__title}>{title}</h1>
      <p className={styles.pageHeader__description}>{description}</p>
    </div>
  )
}
