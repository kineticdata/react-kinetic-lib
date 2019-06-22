import React from 'react';
import { Form } from '../form/Form';
import {
  createTeam,
  updateTeam,
  fetchTeam,
  fetchTeams,
} from '../../../apis/core';
import { splitTeamName } from '../../../helpers/splitTeamName';
import { fetchAttributeDefinitions } from '../../../apis/core/attributeDefinitions';
import { get, List, Map } from 'immutable';

const dataSources = ({ teamSlug }) => ({
  team: [
    fetchTeam,
    [{ teamSlug, include: 'attributesMap,memberships.user' }],
    {
      transform: result => result.team,
      runIf: () => !!teamSlug,
    },
  ],
  teams: [fetchTeams, [], { transform: result => result.teams }],
  attributeDefinitions: [
    fetchAttributeDefinitions,
    [{ attributeType: 'teamAttributeDefinitions' }],
    { transform: result => result.attributeDefinitions },
  ],
});

const handleSubmit = ({ teamSlug }) => values =>
  new Promise((resolve, reject) => {
    const team = values.toJS();
    (teamSlug ? updateTeam({ teamSlug, team }) : createTeam({ team })).then(
      ({ team, error }) => {
        if (team) {
          resolve(team);
        } else {
          reject(error);
        }
      },
    );
  });

const fields = ({ teamSlug }) => [
  {
    name: 'parentTeam',
    label: 'Parent Team',
    type: 'team',
    required: false,
    transient: true,
    placeholder: 'Select a parent team...',
    options: ({ teams }) => teams,
    initialValue: ({ team }) =>
      team
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
    initialValue: ({ team }) => (team ? splitTeamName(team)[1] : ''),
  },
  {
    name: 'name',
    type: 'text',
    visible: false,
    serialize: ({ values }) =>
      !!values.get('parentTeam') && !!values.get('parentTeam').name
        ? `${values.get('parentTeam').name}::${values.get('localName')}`
        : values.get('localName'),
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    required: false,
    initialValue: ({ team }) => (team ? team.get('description') : ''),
  },
  {
    name: 'attributesMap',
    label: 'Attributes',
    type: 'attributes',
    required: false,
    options: ({ attributeDefinitions }) => attributeDefinitions,
    initialValue: ({ team }) => get(team, 'attributesMap'),
  },
  {
    name: 'memberships',
    label: 'Members',
    type: 'user-multi',
    required: false,
    placeholder: 'Select a user...',
    options: () => [],
    initialValue: ({ team }) =>
      get(team, 'memberships', List()).map(m => m.get('user')),
    serialize: ({ values }) =>
      values.get('memberships').map(user => Map({ user })),
  },
];

export const TeamForm = ({
  addFields,
  alterFields,
  fieldSet,
  formKey,
  components,
  onSave,
  onError,
  children,
  ...formOptions
}) => (
  <Form
    addFields={addFields}
    alterFields={alterFields}
    fieldSet={fieldSet}
    formKey={formKey}
    components={components}
    onSubmit={handleSubmit(formOptions)}
    onSave={onSave}
    onError={onError}
    dataSources={dataSources(formOptions)}
    fields={fields(formOptions)}
  >
    {children}
  </Form>
);
