import { generateForm } from '../../form/Form';
import { get, getIn, List, Map } from 'immutable';
import {
  fetchWebApi,
  createWebApi,
  updateWebApi,
  fetchSecurityPolicyDefinitions,
} from '../../../apis';

export const WEB_API_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

const dataSources = ({ slug, kappSlug }) => ({
  webApi: {
    fn: fetchWebApi,
    params: slug && kappSlug ? [{ slug, kappSlug }] : [{ slug }],
    transform: result => result.webApi,
  },
  securityPolicyDefinitions: {
    fn: fetchSecurityPolicyDefinitions,
    params: [],
    // params: kappName && [{ kappName }],
    transform: result => result.securityPolicyDefinitions,
  },
});

const handleSubmit = ({ slug, kappSlug }) => values =>
  (slug ? updateWebApi : createWebApi)({
    kappSlug,
    slug,
    webApi: values.toJS(),
  }).then(({ webApi, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the WebAPI';
    }
    return webApi;
  });

const fields = ({ slug }) => ({ webApi }) =>
  (!slug || webApi) && [
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
    {
      name: 'securityPolicies',
      label: 'Endpoint: Execution',
      type: 'select',
      required: true,
      options: ({ securityPolicyDefinitions }) => {
        // console.log(securityPolicyDefinitions);
        return securityPolicyDefinitions
          ? securityPolicyDefinitions.map(policy =>
              Map({
                value: policy.get('name'),
                label: policy.get('name'),
              }),
            )
          : List();
      },
      initialValue: getIn(webApi, ['securityPolicies', 0, 'name'], 'Admins'),
      serialize: ({ values }) => [
        { endpoint: 'Execution', name: values.get('securityPolicies') },
      ],
    },
  ];

export const WebApiForm = generateForm({
  formOptions: ['slug'],
  dataSources,
  fields,
  handleSubmit,
});

WebApiForm.displayName = 'WebApiForm';
