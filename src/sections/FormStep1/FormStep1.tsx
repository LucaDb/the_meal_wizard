import { useMemo } from 'react'
import { Dropdown, type DropdownOption } from '../../components/Dropdown'
import { Form, useForm } from '../../components/Form'
import { usePreferences } from '../../context/preferenceContext'
import { useAreas } from '../../hooks/useAreas'

export function FormStep1() {
  const { formData, formErrors, updateFormData } = useForm()
  const { areas, isLoading } = useAreas()
  const { sortOptionsByPreference } = usePreferences()

  const options = useMemo(() => {
    const opts: DropdownOption[] = areas.map(area => ({
      value: area.strArea || '',
      label: area.strArea || '',
    }))
    return sortOptionsByPreference(opts, 'area')
  }, [areas, sortOptionsByPreference])

  return (
    <Form.Field
      label="Cuisine / Area"
      name="cuisine"
      required
      error={formErrors.cuisine}
    >
      {(id, name) => (
        <Dropdown
          id={id}
          name={name}
          value={formData.cuisine}
          onChange={value => updateFormData('cuisine', value)}
          options={options}
          placeholder="Select a cuisine..."
          required
          searchable
          isLoading={isLoading}
          aria-label="Cuisine / Area"
        />
      )}
    </Form.Field>
  )
}
