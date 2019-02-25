import React from 'react';
import { shallow } from 'enzyme';

import UserList from './UserList';

describe('<UserList />', () => {
  it('should render correctly', () => {
    const component = shallow(<UserList />);

    expect(component).toMatchSnapshot();
  });
});
