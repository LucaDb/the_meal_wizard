import { Button } from '@components/Button/Button'
import { Form, FormProvider, useForm } from '@components/Form'
import { FormStep1 } from '@sections/FormStep1'
import { FormStep2 } from '@sections/FormStep2'
import { RecipeRecommendation } from '@sections/RecipeRecommendation'
import { StepFormHeader } from '@sections/StepFormHeader'
import { useState, type ComponentType } from 'react'

type FormStepComponent = ComponentType
type ResultStepComponent = ComponentType<{ onBack: () => void }>

interface BaseStepConfig {
  title: string
  submitText: string
}

interface FormStepConfig extends BaseStepConfig {
  component: FormStepComponent
  validateField: 'cuisine' | 'ingredientOrCategory'
  isResult?: false
}

interface ResultStepConfig extends BaseStepConfig {
  component: ResultStepComponent
  validateField?: never
  isResult: true
}

type StepConfig = FormStepConfig | ResultStepConfig

const STEPS: StepConfig[] = [
  {
    title: 'Step 1: Choose Cuisine',
    component: FormStep1,
    validateField: 'cuisine',
    submitText: 'Next',
  },
  {
    title: 'Step 2: Choose Ingredient or Category',
    component: FormStep2,
    validateField: 'ingredientOrCategory',
    submitText: 'Get Recommendation',
  },
  {
    title: 'Step 3: Your Recipe Recommendation',
    component: RecipeRecommendation,
    submitText: '',
    isResult: true,
  },
]

// ============================================================================
// Main StepForm Component
// ============================================================================

export function StepForm() {
  return (
    <FormProvider
      initialData={{
        cuisine: '',
        ingredientOrCategory: '',
      }}
    >
      <WizardSteps />
    </FormProvider>
  )
}

// ============================================================================
// Wizard Steps Container
// ============================================================================

function WizardSteps() {
  const [currentStep, setCurrentStep] = useState(0)
  const stepConfig = STEPS[currentStep]

  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  return (
    <>
      <StepFormHeader
        currentStep={currentStep}
        totalSteps={STEPS.length}
        title={stepConfig.title}
      />

      {stepConfig.isResult ? (
        <ResultStep
          component={stepConfig.component}
          onBack={goToPreviousStep}
        />
      ) : (
        <FormStep
          config={stepConfig}
          isFirstStep={currentStep === 0}
          onNext={goToNextStep}
          onBack={goToPreviousStep}
        />
      )}
    </>
  )
}

// ============================================================================
// Result Step (e.g., Recipe Recommendation)
// ============================================================================

interface ResultStepProps {
  component: ResultStepComponent
  onBack: () => void
}

function ResultStep({ component: Component, onBack }: ResultStepProps) {
  return <Component onBack={onBack} />
}

// ============================================================================
// Form Step (with validation and actions)
// ============================================================================

interface FormStepProps {
  config: FormStepConfig
  isFirstStep: boolean
  onNext: () => void
  onBack: () => void
}

function FormStep({ config, isFirstStep, onNext, onBack }: FormStepProps) {
  const { formData, formErrors, setFormErrors } = useForm()
  const StepComponent = config.component

  const validateAndProceed = () => {
    const fieldValue = formData[config.validateField]
    const hasExistingError = formErrors[config.validateField]

    // Check if field is empty
    if (!fieldValue) {
      setFormErrors({
        ...formErrors,
        [config.validateField]: 'This field is required',
      })
      return
    }

    // Don't proceed if field has validation error
    if (hasExistingError) {
      return
    }

    onNext()
  }

  return (
    <Form onSubmit={validateAndProceed}>
      <StepComponent />

      <Form.Actions>
        {!isFirstStep && (
          <Button variant="secondary" type="button" onClick={onBack}>
            Go Back
          </Button>
        )}
        <Button variant="primary" type="submit">
          {config.submitText}
        </Button>
      </Form.Actions>
    </Form>
  )
}
