# Dynamic Form (React)

There is 2 possibilities when building forms: completely static (the most common case) and highly dynamic.

When it is static then this is the frontend responsability to build the form and send the data correctly to the backend.

But when it is totally dynamic then only the backend handles the logic: structure, what to display, on what conditions
to show it, etc. Front-end just becomes a dummy UI replicating the logic.

So this is my attempt to create a library that will help you to build dynamic forms.

First import `useDynamicForm` and call it inside your component.

Then you must provide it with 2 arguments:

- `configs`, an object that will be the dictionary of all the fields that will be displayed.
- `structure`, an array that will be the fields in the wished order and their conditions. The `structure` is an array of
  strings and objects. If the field is a string then it means that it is a simple field that will always be displayed.
  On the other hand if the field is a an array string followed by an object then it means that the object field is
  conditionally displayed based on the field value (string).
