import { get } from 'immutable';

export const splitTeamName = team => {
  const [local, ...parents] = get(team, 'name')
    .split('::')
    .reverse();
  return [parents.reverse().join('::'), local];
};
