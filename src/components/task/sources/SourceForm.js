import { get, List, Map } from 'immutable';
import {
  createSource,
  fetchPolicyRules,
  fetchSource,
  fetchSourceAdapters,
  updateSource,
} from '../../../apis/task';
import { generateForm } from '../../form/Form';

const dataSources = ({ sourceName }) => ({
  source: {
    fn: fetchSource,
    params: sourceName && [
      { sourceName, include: 'details,policyRules,properties' },
    ],
    transform: result => result.source,
  },
  policyRules: {
    fn: fetchPolicyRules,
    params: [{ type: 'API Access', include: 'details' }],
    transform: result => result.policyRules,
  },
  sourceAdapters: {
    fn: fetchSourceAdapters,
    params: [{ include: 'details' }],
    transform: result => result.sourceAdapters,
  },
});

const handleSubmit = ({ sourceName }) => values =>
  (sourceName ? updateSource : createSource)({
    sourceName,
    source: values.toJS(),
  }).then(({ source, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the source';
    }
    return source;
  });

const fields = ({ sourceName, sourceType }) => ({ source, sourceAdapters }) => {
  let properties = [];
  const initialSourceAdapter = get(source, 'type', sourceType);

  if (sourceAdapters) {
    const sourceAdapter = sourceAdapters.find(
      a => a.get('name') === initialSourceAdapter,
    );
    const adapterProperties = sourceAdapter
      ? List(sourceAdapter.get('properties'))
      : List([]);

    properties = adapterProperties
      .map(property => ({
        name: `property_${property.get('name')}`,
        label: property.get('name'),
        type: property.get('sensitive') ? 'password' : 'text',
        required: property.get('required'),
        transient: true,
        initialValue: source
          ? source.getIn(['properties', property.get('name')], '')
          : '',
      }))
      .toArray();

    return (
      (!sourceName || source) && [
        {
          name: 'type',
          label: 'Type',
          required: true,
          enabled: false,
          initialValue: sourceType ? sourceType : get(source, 'type', ''),
        },
        {
          name: 'name',
          label: 'Name',
          required: true,
          initialValue: get(source, 'name', ''),
        },
        {
          name: 'policyRules',
          label: 'Policy Rules',
          type: 'select-multi',
          required: false,
          options: ({ policyRules }) =>
            policyRules
              ? policyRules.map(policyRule =>
                  Map({
                    label: policyRule.get('name'),
                    value: policyRule.get('name'),
                  }),
                )
              : [],
          initialValue: source
            ? source
                .get('policyRules')
                .map(policyRule => policyRule.get('name'))
            : [],
          serialize: ({ values }) =>
            values
              .get('policyRules')
              .map(name => ({ type: 'API Access', name: name })),
        },
        {
          name: 'properties',
          visible: false,
          initialValue: get(source, 'properties', []),
          serialize: ({ values }) =>
            get(sourceAdapter, 'properties', List([]))
              .filter(p =>
                p.get('sensitive')
                  ? values.get(`property_${p.get('name')}`)
                  : true,
              )
              .reduce(
                (properties, p) => ({
                  ...properties,
                  [p.get('name')]: values.get(`property_${p.get('name')}`),
                }),
                {},
              ),
        },
        ...properties,
      ]
    );
  }
  return false;
};

export const SourceForm = generateForm({
  formOptions: ['sourceName', 'sourceType'],
  dataSources,
  fields,
  handleSubmit,
});

SourceForm.displayName = 'SourceForm';
