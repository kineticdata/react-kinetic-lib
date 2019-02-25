import React from 'react';
import { shallow } from 'enzyme';

import UserDetails from './UserDetails';

describe('<UserDetails />', () => {
  it('should be sane', () => {
    expect(false).not.toBe(true);
  });

  it('should render correctly', () => {
    const component = shallow(<UserDetails />);

    expect(component).toMatchSnapshot();
  });
});
