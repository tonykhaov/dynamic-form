import { Config, Structure, useDynamicForm } from './useDynamicForm'

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
const structure = [
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
] as const satisfies Structure

function App() {
  // There is 2 possibilities when building forms: completely static (the most common case) and highly dynamic.
  // When it is static then this is the frontend responsability to build the form and send the data correctly to the backend.
  // But when it is totally dynamic then the backend handles the whole logic: structure, what to display, on what conditions to show it, etc. Front-end is just a UI replicating the logic given by the backend.
  // So this is my attempt to create a library that will help you to build dynamic forms.

  // First you must provide a `configs` object that will be the dictionary of all the fields that will be displayed.
  // Second you must provide a `structure` that will be the fields in the wished order and their conditions.
  // The `structure` is an array of strings and objects.
  // If the field is a string then it means that it is a simple field that will be displayed.
  // If the field is a string followed by an object then it means that the followed object is conditionally displayed based on the field value.
  const [form, setForm] = useDynamicForm(configs, structure)

  // Finally you can use the `form` object to render the form.

  return form.map((config) => (
    <div key={config.id}>
      <h1>{config.name}</h1>
      {(() => {
        switch (config.type) {
          case 'text':
            return (
              <input
                type={config.type}
                name={config.name}
                placeholder={config.placeholder}
                required={config.required}
                defaultValue={config.defaultValue}
                onChange={(e) => setForm((f) => ({ ...f, [config.name]: e.target.value }))}
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
                onChange={(e) => setForm((f) => ({ ...f, [config.name]: e.target.value }))}
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
                onChange={(e) => setForm((f) => ({ ...f, [config.name]: e.target.value }))}
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
                  onChange={(e) => setForm((f) => ({ ...f, [config.name]: e.target.value }))}
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
                onChange={(e) => setForm((f) => ({ ...f, [config.name]: e.target.valueAsNumber }))}
              />
            )
          default:
            return null
        }
      })()}
    </div>
  ))
}

export default App
