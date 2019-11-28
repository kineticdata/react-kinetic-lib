import { get } from 'immutable';
import { generateForm } from '../../form/Form';
import { fetchTaskComponent, updateTaskComponent } from '../../../apis';

const dataSources = () => ({
  task: {
    fn: fetchTaskComponent,
    params: [],
    transform: result => result.task,
  },
});

const handleSubmit = () => values =>
  updateTaskComponent({
    task: values.toJS(),
  }).then(({ task, error }) => {
    if (error) {
      throw (error.statusCode === 400 && error.message) ||
        'There was an error saving the Agent';
    }
    return task;
  });

const fields = () => ({ task }) =>
  task && [
    {
      name: 'secret',
      label: 'Task Secret',
      type: 'password',
      transient: ({ values }) => values.get('changeSecret'),
      visible: ({ values }) => values.get('changeSecret'),
      required: ({ values }) => values.get('changeSecret'),
    },
    {
      name: 'changeSecret',
      label: 'Change Task Secret',
      type: 'checkbox',
      transient: true,
      // in "new" mode we do not show this toggle field and default it to true
      visible: !!task,
      initialValue: !task,
      onChange: ({ values }, { setValue }) => {
        if (values.get('secret') !== '') {
          setValue('secret', '');
        }
      },
    },
    {
      name: 'url',
      label: 'Task Url',
      type: 'text',
      required: true,
      initialValue: get(task, 'url') || '',
      helpText: 'URL to the Task Component',
    },
  ];

export const TaskComponentForm = generateForm({
  formOptions: [],
  dataSources,
  fields,
  handleSubmit,
});

TaskComponentForm.displayName = 'TaskComponentForm';
