```js static
import { Discussion } from 'react-kinetic-lib';

const discussion = {
  id: 'id',
};
const renderDiscussion = ({ elements, discussion, canManage }) => (
  <div>
    {elements.viewUnreadButton}
    {elements.chatInput}
  </div>
);

<Discussion id={discussion.id} render={renderDiscussion} />;
```
