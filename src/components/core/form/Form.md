## Examples

### Simple

Simple implementation of a `Form` with one field.

```js
const onSubmit = props => alert('It Worked!');
const fields = [
  {
    name: 'Field1',
    label: 'Field 1',
    type: 'text',
  },
];
<Form fields={fields} onSubmit={onSubmit}>
  {({ form }) => <div>{form}</div>}
</Form>;
```
