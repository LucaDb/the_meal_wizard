import { Stepper } from '../../components/Stepper'
import styles from './StepFormHeader.module.scss'

interface StepFormHeaderProps {
  currentStep: number
  totalSteps: number
  title: string
}

export const StepFormHeader = ({
  currentStep,
  totalSteps,
  title,
}: StepFormHeaderProps) => {
  return (
    <div className={styles.stepFormHeader}>
      <Stepper currentStep={currentStep} totalSteps={totalSteps} />
      <h2 className={styles.stepFormHeader__title}>{title}</h2>
    </div>
  )
}

