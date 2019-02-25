```js
import { ContentEditable } from 'react-kinetic-lib';

initialState = {
  htmlValue: 'default value',
};

const updateOutput = (_e, value) => {
  setState({ htmlValue: value });
};
const handleHotKeys = e => {
  if (e.nativeEvent.keyCode === 13 && !e.nativeEvent.shiftKey) {
    alert(`Checking output: ${state.htmlValue}`);
    e.preventDefault();
    setState({ htmlValue: 'default value' });
  }
};

<div>
  <p>Output: {state.htmlValue}</p>
  <div style={{ border: '1px solid' }}>
    <ContentEditable
      contentEditable="plaintext-only"
      html={state.htmlValue}
      onChange={updateOutput}
      onKeyPress={handleHotKeys}
    />
  </div>
</div>;
```
