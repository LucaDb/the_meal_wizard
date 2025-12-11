import styles from './Stepper.module.scss'

interface StepperProps {
  currentStep: number
  totalSteps: number
}

export function Stepper({ currentStep, totalSteps }: StepperProps) {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100
  return (
    <div className={styles.stepper}>
      <span className={styles.stepper__label}>
        Step {currentStep + 1} of {totalSteps}
      </span>
      <div className={styles.stepper__bar}>
        <div
          className={styles.stepper__fill}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}
