import * as React from 'react'
import { checkCondition, Condition } from './checkCondition'

type Config =
  | {
      type: 'text' | 'email' | 'password' | 'number'
      name: string
      label: string
      placeholder: string
      required: boolean
      defaultValue: string | number
    }
  | {
      type: 'radio'
      name: string
      label: string
      placeholder: string
      required: boolean
      defaultValue: string
      options: Array<{ value: string; label: string }>
    }

type Structure = Array<Field | FieldWithChildren['children']>

type Field = string
type FieldWithChildren = {
  condition: Condition
  children: Field | [Field, FieldWithChildren]
}

function useDynamicForm(configs: Record<string, Config>, structure: Structure) {
  const [form, setForm] = React.useState<Record<string, string | number | boolean>>(
    structure.reduce((acc, field) => {
      if (typeof field === 'string') {
        return { ...acc, [field]: configs[field].defaultValue }
      }
      return acc
    }, {}),
  )

  const buildForm = React.useCallback(
    (
      structure: Structure,
      configs: Record<string, Config>,
      form: Record<PropertyKey, string | number | boolean | undefined>,
    ) => {
      const finalForm: (Config & { id: string })[] = []

      const tree: string[] = []
      setup(structure, 1)

      function addToForm(field: string, depth: number | string) {
        const input = configs[field]
        if (!input) throw new Error(`Config not found for field: ${field}`)

        // TODO: use a unique id to identify fields
        const hasDuplicateField = tree.find((field) => field === input.name)
        if (hasDuplicateField) {
          throw new Error(
            `There is already a field with the same name: "${field}". Please use a unique name for each field.`,
          )
        }
        const id = field + depth
        finalForm.push({ ...input, id })
        tree.push(field)
      }

      function setup(structure: Structure, depth: number) {
        for (let i = 0; i < structure.length; i++) {
          const field = structure[i]

          if (typeof field === 'string') {
            depth++
            addToForm(field, depth)
            continue
          }

          const [fieldName, fieldWithCondition] = field
          depth++
          addToForm(fieldName, depth)

          const { condition, children } = fieldWithCondition
          const fieldValue = form[fieldName]

          if (typeof fieldValue === 'undefined') {
            continue
          }

          const match = checkCondition(condition, fieldValue)
          if (match) {
            depth++
            setup([children], depth)
            continue
          }
        }
      }

      return [finalForm, tree] as const
    },
    [],
  )

  const [finalForm, tree] = React.useMemo(
    () => buildForm(structure, configs, form),
    [buildForm, configs, form, structure],
  )

  // Sync form
  React.useEffect(() => {
    setForm((form) => {
      const newForm = tree.reduce((acc, field) => {
        return { ...acc, [field]: form[field] ?? configs[field].defaultValue }
      }, {})
      return newForm
    })
  }, [configs, JSON.stringify(tree)])

  return [finalForm, setForm] as const
}

export { useDynamicForm }
export type { Config, Condition, Structure }
