import { useQuery } from '@tanstack/react-query'
import { Config, Structure, useDynamicForm } from './useDynamicForm'

function App() {
  const { data } = useQuery({
    queryKey: ['form'],
    queryFn: () => {
      return Promise.resolve({
        configs,
        structure,
      })
    },
    initialData: {
      configs: {},
      structure: [],
    },
  })

  const [form, setForm] = useDynamicForm(data.configs, data.structure)

  return (
    <form>
      {form.map((config) => (
        <div key={config.id}>
          <h1>{config.name}</h1>
          <FormField config={config} updateValue={(value) => setForm((f) => ({ ...f, [config.name]: value }))} />
        </div>
      ))}
    </form>
  )
}

function FormField({ config, updateValue }: { config: Config; updateValue: (value: string | number) => void }) {
  switch (config.type) {
    case 'text':
      return (
        <input
          type={config.type}
          name={config.name}
          placeholder={config.placeholder}
          required={config.required}
          defaultValue={config.defaultValue}
          onChange={(e) => updateValue(e.currentTarget.value)}
        />
      )
    case 'email':
      return (
        <input
          type={config.type}
          name={config.name}
          placeholder={config.placeholder}
          required={config.required}
          defaultValue={config.defaultValue}
          onChange={(e) => updateValue(e.currentTarget.value)}
        />
      )
    case 'password':
      return (
        <input
          type={config.type}
          name={config.name}
          placeholder={config.placeholder}
          required={config.required}
          defaultValue={config.defaultValue}
          onChange={(e) => updateValue(e.currentTarget.value)}
        />
      )
    case 'radio':
      return config.options.map((option) => (
        <label key={option.value}>
          <input
            type={config.type}
            name={config.name}
            placeholder={config.placeholder}
            required={config.required}
            value={option.value}
            defaultChecked={config.defaultValue === option.value}
            onChange={(e) => updateValue(e.currentTarget.value)}
          />
          {option.label}
        </label>
      ))

    case 'number':
      return (
        <input
          type={config.type}
          name={config.name}
          placeholder={config.placeholder}
          required={config.required}
          defaultValue={config.defaultValue}
          onChange={(e) => updateValue(e.currentTarget.valueAsNumber)}
        />
      )
    default:
      return null
  }
}

const configs: Record<string, Config> = {
  age: {
    type: 'text',
    name: 'age',
    label: 'Age',
    placeholder: 'Enter your age',
    required: true,
    defaultValue: 0,
  },
  name: {
    type: 'text',
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your name',
    required: true,
    defaultValue: 'Tony Khaov',
  },
  transaction_id: {
    type: 'text',
    name: 'transaction_id',
    label: 'Transaction ID',
    placeholder: 'Enter your transaction id',
    required: true,
    defaultValue: '',
  },
  email: {
    type: 'email',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
    defaultValue: 'tony.khaov@gmail.com',
  },
  subEmail: {
    type: 'email',
    name: 'subEmail',
    label: 'Email',
    placeholder: 'Enter your sub email',
    required: true,
    defaultValue: 'subemail.tonykhaov@gmail.com',
  },
  password: {
    type: 'password',
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
    defaultValue: '123456',
  },
  gender: {
    type: 'radio',
    name: 'gender',
    label: 'Gender',
    placeholder: 'Select your gender',
    required: true,
    defaultValue: 'male',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
    ],
  },
}
const structure: Structure = [
  [
    'email',
    {
      condition: {
        rule: 'is_not_equal',
        value: 'tony.khaov@gmail.com',
      },
      children: 'email',
    },
  ],
  'name',
  'password',
  [
    'age',
    {
      condition: {
        rule: 'is_less_or_equal_than',
        value: 12345,
      },
      children: [
        'gender',
        {
          condition: {
            rule: 'is_equal',
            value: 'male',
          },
          children: [
            'transaction_id',
            {
              condition: {
                rule: 'contains',
                value: /[0-9]/,
              },
              children: 'gender',
            },
          ],
        },
      ],
    },
  ],
]

export default App
