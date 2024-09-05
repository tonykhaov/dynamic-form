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

export { checkCondition }
export type { Condition }
