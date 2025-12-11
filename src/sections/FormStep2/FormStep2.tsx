import { useMemo } from 'react'
import {
  Dropdown,
  type DropdownOption,
  type DropdownOptionGroup,
} from '../../components/Dropdown'
import { Form, useForm } from '../../components/Form'
import { usePreferences } from '../../context/preferenceContext'
import { useIngredientsAndCategories } from '../../hooks/useIngredientsAndCategories'

export function FormStep2() {
  const { formData, formErrors, updateFormData } = useForm()
  const { data, isLoading } = useIngredientsAndCategories()
  const { sortOptionsByPreference } = usePreferences()

  const groups = useMemo(() => {
    const ingredientOptions: DropdownOption[] = data.ingredients.map(
      ingredient => ({
        value: ingredient.strIngredient || '',
        label: ingredient.strIngredient || '',
        meta: { type: 'ingredient' },
      })
    )

    const categoryOptions: DropdownOption[] = data.categories.map(category => ({
      value: category.strCategory || '',
      label: category.strCategory || '',
      meta: { type: 'category' },
    }))

    const optionGroups: DropdownOptionGroup[] = [
      {
        label: 'Ingredients',
        options: sortOptionsByPreference(ingredientOptions, 'ingredient'),
      },
      {
        label: 'Categories',
        options: sortOptionsByPreference(categoryOptions, 'category'),
      },
    ]

    return optionGroups
  }, [data, sortOptionsByPreference])

  const handleChange = (value: string) => {
    const allOptions = groups.flatMap(group => group.options)
    const option = allOptions.find(opt => opt.value === value)

    updateFormData('ingredientOrCategory', value, option?.meta)
  }

  return (
    <Form.Field
      label="Ingredient or Category"
      name="ingredientOrCategory"
      required
      error={formErrors.ingredientOrCategory}
    >
      {(id, name) => (
        <Dropdown
          id={id}
          name={name}
          value={formData.ingredientOrCategory}
          onChange={handleChange}
          groups={groups}
          placeholder="Select an ingredient or category..."
          required
          searchable
          isLoading={isLoading}
          aria-label="Ingredient or Category"
        />
      )}
    </Form.Field>
  )
}
