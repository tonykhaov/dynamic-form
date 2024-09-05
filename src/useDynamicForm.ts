import * as React from 'react'

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

type Condition =
  | {
      rule: 'is_equal'
      value: string | number
    }
  | {
      rule: 'is_between'
      min: number
      max: number
    }
  | {
      rule: 'is_greater_than'
      value: number
    }
  | {
      rule: 'is_greater_or_equal_than'
      value: number
    }
  | {
      rule: 'is_less_than'
      value: number
    }
  | {
      rule: 'is_less_or_equal_than'
      value: number
    }
  | {
      rule: 'is_not_equal'
      value: string | number
    }
  | {
      rule: 'is_not_between'
      min: number
      max: number
    }
  | {
      rule: 'contains'
      value: string | RegExp
    }

type Structure = Array<Field | FieldWithChildren['children']>

type Field = string
type FieldWithChildren = {
  condition: Condition
  children: Field | [Field, FieldWithChildren]
}

function checkCondition(condition: Condition, value: string | number | boolean) {
  let match = false
  switch (condition.rule) {
    case 'is_equal': {
      if (condition.value === value) {
        match = true
      }
      break
    }
    case 'is_not_equal': {
      if (condition.value !== value) {
        match = true
      }
      break
    }
    case 'contains':
    default: {
      if (condition.value instanceof RegExp) {
        match = condition.value.test(value.toString())
      } else if (typeof condition.value === 'string') {
        if (value.toString().includes(condition.value.toString())) {
          match = true
        }
      }
      break
    }
    case 'is_between': {
      if (Number(value) >= condition.min && Number(value) <= condition.max) {
        match = true
      }
      break
    }
    case 'is_not_between': {
      const isBetween = Number(value) >= condition.min && Number(value) <= condition.max
      if (!isBetween) {
        match = true
      }
      break
    }
    case 'is_greater_than': {
      if (Number(value) > condition.value) {
        match = true
      }
      break
    }
    case 'is_greater_or_equal_than': {
      if (Number(value) > condition.value) {
        match = true
      }
      break
    }
    case 'is_less_than': {
      if (Number(value) < condition.value) {
        match = true
      }
      break
    }
    case 'is_less_or_equal_than': {
      if (Number(value) <= condition.value) {
        match = true
      }
      break
    }
  }
  return match
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

          if (!fieldValue) {
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
