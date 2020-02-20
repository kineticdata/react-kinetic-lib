import { generateForm } from '../../form/Form';
import { get, Map } from 'immutable';
import {
  fetchWebApi,
  createWebApi,
  updateWebApi,
  fetchSecurityPolicyDefinitions,
  fetchSpace,
  fetchTree,
} from '../../../apis';

export const WEB_API_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

const securityEndpoints = {
  webApiExecution: {
    endpoint: 'Execution',
    label: 'WebAPI Execution',
    types: ['Space', 'Kapp'],
  },
};

const dataSources = ({ slug, kappSlug }) => ({
  webApi: {
    fn: fetchWebApi,
    params: slug && [{ slug, kappSlug, include: 'securityPolicies' }],
    transform: result => result.webApi,
  },
  securityPolicyDefinitions: {
    fn: fetchSecurityPolicyDefinitions,
    params: kappSlug ? [{ kappSlug }] : [],
    transform: result => result.securityPolicyDefinitions,
  },
  platformSourceName: {
    fn: fetchSpace,
    params: [{ include: 'platformComponents' }],
    transform: result =>
      result.space.platformComponents.task.config.platformSourceName,
  },
  tree: {
    fn: fetchTree,
    params: ({ platformSourceName: sourceName, webApi }) =>
      webApi &&
      sourceName && [
        {
          sourceName,
          sourceGroup: kappSlug ? `WebApis > ${kappSlug}` : 'WebApis',
          name: webApi.get('slug'),
        },
      ],
    transform: result =>
      result.error && result.error.notFound ? {} : result.tree,
  },
});

const handleSubmit = ({ slug, kappSlug }) => values =>
  (slug ? updateWebApi : createWebApi)({
    kappSlug,
    slug,
    webApi: values.toJS(),
    include: 'securityPolicies',
  }).then(({ webApi, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the WebAPI';
    }
    return webApi;
  });

const fields = ({ slug }) => ({ tree, webApi }) =>
  (!slug || (webApi && tree)) && [
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      initialValue: get(webApi, 'slug') || '',
    },
    {
      name: 'method',
      label: 'Method',
      type: 'select',
      required: true,
      options: WEB_API_METHODS.map(el => ({
        value: el,
        label: el,
      })),
      initialValue: get(webApi, 'method') || '',
    },
    ...Object.entries(securityEndpoints).map(
      ([endpointFieldName, endpoint]) => ({
        name: endpointFieldName,
        label: endpoint.label,
        type: 'select',
        options: ({ securityPolicyDefinitions }) =>
          securityPolicyDefinitions
            ? securityPolicyDefinitions
                .filter(definition =>
                  endpoint.types.includes(definition.get('type')),
                )
                .map(definition =>
                  Map({
                    value: definition.get('name'),
                    label: definition.get('name'),
                  }),
                )
            : [],
        initialValue: webApi
          ? webApi
              .get('securityPolicies')
              .find(
                pol => pol.get('endpoint') === endpoint.endpoint,
                null,
                Map({}),
              )
              .get('name', '')
          : '',
        transient: true,
      }),
    ),
    {
      name: 'securityPolicies',
      label: 'Security Policies',
      type: null,
      visible: false,
      serialize: ({ values }) =>
        Object.entries(securityEndpoints)
          .map(([endpointFieldName, policy]) => ({
            endpoint: policy.endpoint,
            name: values.get(endpointFieldName),
          }))
          .filter(endpoint => endpoint.name !== ''),
      initialValue: get(webApi, 'securityPolicies'),
    },
  ];

export const WebApiForm = generateForm({
  formOptions: ['slug', 'kappSlug'],
  dataSources,
  fields,
  handleSubmit,
});

WebApiForm.displayName = 'WebApiForm';
