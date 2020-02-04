import { generateForm } from '../../form/Form';
import {
  fetchSecurityPolicyDefinition,
  // createSecurityPolicyDefinition,
  // updateSecurityPolicyDefinition,
} from '../../../apis';
// import { buildBindings } from '../../../helpers';

export const WEB_API_TYPES = ['Foo', 'Bar', 'Baz'];

const dataSources = ({ webApiName }) => ({
  securityPolicy: {
    fn: fetchSecurityPolicyDefinition,
    params: webApiName && [{ securityPolicyName: webApiName }],
    transform: result => result.securityPolicyDefinition,
  },
});

// const handleSubmit = ({ webApiName }) => values =>
//   (webApiName
//     ? updateSecurityPolicyDefinition
//     : createSecurityPolicyDefinition)({
//     webApiName,
//     securityPolicyDefinition: values.toJS(),
//   }).then(({ securityPolicyDefinition, error }) => {
//     if (error) {
//       throw (error.statusCode === 400 && error.message) ||
//         'There was an error saving the WebAPI';
//     }
//     return securityPolicyDefinition;
//   });

const fields = ({ webApiName }) => ({ securityPolicy }) =>
  (!webApiName || securityPolicy) && [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      initialValue: securityPolicy ? securityPolicy.get('name') : '',
      helpText: 'Will be displayed in security policy dropdowns.',
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: WEB_API_TYPES.map(el => ({
        value: el,
        label: el,
      })),
      initialValue: 'Foo'
    },
  ];

export const WebApiForm = generateForm({
  formOptions: ['webApiName'],
  dataSources,
  fields,
  // handleSubmit,
});

WebApiForm.displayName = 'WebApiForm';
