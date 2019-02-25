### Usage

The `DiscussionForm` component is used to render a form for editing discussions. It takes a few render props that allow you to
customize the behavior of certain fields. Understanding how to use these is important.

#### Owning Usera and Teams Input

The owning users and teams render functions are used to provide a input for these fields. Both render props take the same function signature.
The function receives three props:

```js static
function({ id, onChange, value })
```

### Example

```js
import { DiscussionForm } from 'react-kinetic-lib';

const PeopleSelect = props => {
  console.log(props);
  return <select />;
};

const handleSubmit = () => alert('Form submitted.');

<DiscussionForm
  onSubmit={handleSubmit}
  renderOwningUsersInput={props => <PeopleSelect {...props} />}
  renderOwningTeamsInput={props => <PeopleSelect {...props} />}
  render={({ formElement, dirty, invalid, submit }) => (
    <div>
      {formElement}
      <button
        className="btn btn-primary"
        type="submit"
        disabled={!dirty || invalid}
        onClick={submit}
      >
        Save
      </button>
    </div>
  )}
/>;
```
