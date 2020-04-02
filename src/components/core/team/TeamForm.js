import { generateForm } from '../../form/Form';
import {
  createTeam,
  updateTeam,
  fetchAttributeDefinitions,
  fetchTeam,
} from '../../../apis';
import { splitTeamName } from '../../../helpers';
import { get, List, Map } from 'immutable';

const TEAM_INCLUDES = 'attributesMap,memberships.user';

const dataSources = ({ teamSlug }) => ({
  team: {
    fn: fetchTeam,
    params: teamSlug && [{ teamSlug, include: TEAM_INCLUDES }],
    transform: result => result.team,
  },
  attributeDefinitions: {
    fn: fetchAttributeDefinitions,
    params: [{ attributeType: 'teamAttributeDefinitions' }],
    transform: result => result.attributeDefinitions,
  },
});

const handleSubmit = ({ teamSlug }) => values =>
  new Promise((resolve, reject) => {
    const team = values.toJS();
    (teamSlug ? updateTeam({ teamSlug, team }) : createTeam({ team })).then(
      ({ team, error }) => {
        if (team) {
          resolve(team);
        } else {
          reject(error.message || 'There was an error saving the team');
        }
      },
    );
  });

const fields = ({ teamSlug }) => ({ team }) =>
  (!teamSlug || team) && [
    {
      name: 'parentTeam',
      label: 'Parent Team',
      type: 'team',
      required: false,
      transient: true,
      placeholder: 'Select a parent team...',
      helpText:
        'Teams are hierarchical and can be nested within each other. To nest a team within another team, simply add a parent team.',
      options: [],
      initialValue:
        team && splitTeamName(team)[0]
          ? {
              name: splitTeamName(team)[0],
            }
          : null,
    },
    {
      name: 'localName',
      label: 'Name',
      type: 'text',
      required: true,
      transient: true,
      initialValue: team ? splitTeamName(team)[1] : '',
    },
    {
      name: 'name',
      type: 'text',
      visible: false,
      serialize: ({ values }) =>
        values.getIn(['parentTeam', 'name'], '') !== ''
          ? `${values.getIn(['parentTeam', 'name'])}::${values.get(
              'localName',
            )}`
          : values.get('localName'),
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: false,
      initialValue: team ? team.get('description') : '',
    },
    {
      name: 'attributesMap',
      label: 'Attributes',
      type: 'attributes',
      required: false,
      options: ({ attributeDefinitions }) => attributeDefinitions,
      initialValue: get(team, 'attributesMap'),
    },
    {
      name: 'memberships',
      label: 'Members',
      type: 'user-multi',
      required: false,
      placeholder: 'Start typing to select a user...',
      options: () => [],
      initialValue: get(team, 'memberships', List()).map(m => m.get('user')),
      serialize: ({ values }) =>
        values.get('memberships').map(user => Map({ user })),
    },
  ];

export const TeamForm = generateForm({
  formOptions: ['teamSlug'],
  dataSources,
  fields,
  handleSubmit,
});

TeamForm.displayName = 'TeamForm';
