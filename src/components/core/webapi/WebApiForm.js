import { generateForm } from '../../form/Form';
import { get, Map } from 'immutable';
import {
  fetchWebApi,
  createWebApi,
  updateWebApi,
  fetchSecurityPolicyDefinitions,
  fetchSpace,
  fetchTree,
  createTree,
  updateTree,
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
    params: slug && [{ slug, kappSlug, include: 'details,securityPolicies' }],
    transform: result => result.webApi,
  },
  securityPolicyDefinitions: {
    fn: fetchSecurityPolicyDefinitions,
    params: kappSlug ? [{ kappSlug }] : [],
    transform: result => result.securityPolicyDefinitions,
  },
  sourceName: {
    fn: fetchSpace,
    params: [{ include: 'platformComponents' }],
    transform: result =>
      result.space.platformComponents.task.config.platformSourceName,
  },
  sourceGroup: {
    fn: () => (kappSlug ? `WebApis > ${kappSlug}` : 'WebApis'),
    params: [],
  },
  tree: {
    fn: fetchTree,
    params: ({ sourceName, sourceGroup, webApi }) =>
      webApi &&
      sourceName && [{ sourceName, sourceGroup, name: webApi.get('slug') }],
    transform: result =>
      result.error && result.error.notFound ? {} : result.tree,
  },
});

const handleSubmit = ({ slug, kappSlug }) => async (values, bindings) => {
  const { sourceGroup, sourceName, tree } = bindings;
  const { webApi, error } = await (slug ? updateWebApi : createWebApi)({
    kappSlug,
    slug,
    webApi: values.toJS(),
    include: 'securityPolicies',
  });
  if (error) {
    throw (error.statusCode === 400 && error.message) ||
      'There was an error saving the WebAPI';
  }
  // if we created a new web api we create a corresponding tree
  if (!slug) {
    const { error: createTreeError } = await createTree({
      tree: { sourceGroup, sourceName, name: values.get('slug') },
    });
    if (createTreeError) {
      throw (createTreeError.statusCode === 400 && createTreeError.message) ||
        'There was an error creating the WebAPI tree';
    }
  }
  // if we updated a web api by changing its name and there is an existing tree
  // we need to update that corresponding tree
  else if (!tree.isEmpty() && slug !== values.get('slug')) {
    const { error: updateTreeError } = await updateTree({
      sourceName,
      sourceGroup,
      name: slug,
      tree: { sourceGroup, sourceName, name: values.get('slug') },
    });
    if (updateTreeError) {
      throw (updateTreeError.statusCode === 400 && updateTreeError.message) ||
        'There was an error updating the WebAPI tree';
    }
  }
  return webApi;
};

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
