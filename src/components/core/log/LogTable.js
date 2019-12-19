import { generateTable } from '../../table/Table';
import { fetchLogs } from '../../../apis';
import { List } from 'immutable';
import moment from 'moment';

export const generateLogQuery = appliedFilters => {
  const filters = JSON.stringify(
    appliedFilters
      .filter((_v, k) => k !== 'timestamp')
      .map(filter => filter.get('value'))
      .filter(filter => filter !== '')
      .toJSON(),
  );

  const q = filters === '{}' ? undefined : filters;
  const [startDate, endDate] = appliedFilters.getIn(
    ['timestamp', 'value'],
    List(['', '']),
  );

  console.log(`'${startDate}'`, `'${endDate}'`);
  const start =
    startDate === '' && endDate === ''
      ? moment()
          .subtract(60, 'minutes')
          .toISOString()
      : startDate === '' && endDate !== ''
      ? moment(endDate)
          .subtract(60, 'minutes')
          .toISOString()
      : moment(startDate).toISOString();
  const end =
    endDate === '' ? moment().toISOString() : moment(endDate).toISOString();

  return {
    q,
    start,
    end,
  };
};

const dataSource = () => ({
  fn: fetchLogs,
  params: paramData => {
    const { q, start, end } = generateLogQuery(paramData.filters);
    const fetchParams = [
      {
        q,
        limit: paramData.pageSize,
        nextPageToken: paramData.nextPageToken,
        start,
        end,
      },
    ];
    return fetchParams;
  },
  transform: result => ({
    data: result.logs.filter(entry => entry.hasOwnProperty('app.component')),
    nextPageToken: result.nextPageToken,
  }),
});

const APP_COMPONENT_OPTIONS = ['agent', 'core', 'loghub', 'task'].map(
  component => ({
    label: component,
    value: component,
  }),
);

const LEVEL_OPTIONS = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'].map(
  level => ({
    label: level,
    value: level,
  }),
);

const columns = [
  {
    value: 'app.component',
    title: 'Component',
    filter: 'equals',
    type: 'text',
    sortable: false,
    options: () => APP_COMPONENT_OPTIONS,
  },
  {
    value: 'app.correlationId',
    title: 'Correlation ID',
    filter: 'equals',
    type: 'text',
    sortable: false,
  },
  {
    value: 'app.instanceId',
    title: 'Instance ID',
    sortable: false,
  },
  {
    value: 'app.requestId',
    title: 'Request ID',
    sortable: false,
  },
  {
    value: 'app.sessionId',
    title: 'Session ID',
    sortable: false,
  },
  {
    value: 'app.user',
    title: 'User',
    filter: 'equals',
    type: 'text',
    sortable: false,
  },

  {
    value: 'app.requestAddressChain',
    title: 'Request Address Chain',
    sortable: false,
  },

  {
    value: 'app.requestMethod',
    title: 'Request Method',
    sortable: false,
  },

  {
    value: 'app.requestOriginAddress',
    title: 'Request Origin Address',
    sortable: false,
  },

  {
    value: 'app.requestPath',
    title: 'Request Path',
    sortable: false,
  },

  {
    value: 'app.requestProtocol',
    title: 'Request Protocol',
    sortable: false,
  },

  {
    value: 'app.requestQuery',
    title: 'Request Query',
    sortable: false,
  },

  {
    value: 'app.responseStatus',
    title: 'Responsed Status',
    filter: 'equals',
    type: 'text',
    sortable: false,
  },

  {
    value: 'app.responseTime',
    title: 'Response Time',
    sortable: false,
  },

  {
    value: 'app.authEvent',
    title: 'Auth Event',
    sortable: false,
  },

  {
    value: 'app.authMessage',
    title: 'Auth Message',
    sortable: false,
  },

  {
    value: 'app.authPrincipal',
    title: 'Auth Principal',
    sortable: false,
  },

  {
    value: 'app.authStrategy',
    title: 'Auth Strategy',
    sortable: false,
  },

  {
    value: 'k8s.container',
    title: 'Container',
    sortable: false,
  },
  {
    value: 'k8s.namespace',
    title: 'Namespace',
    sortable: false,
  },
  {
    value: 'k8s.nodeAddress',
    title: 'Node Address',
    sortable: false,
  },
  {
    value: 'k8s.nodeName',
    title: 'Node Name',
    sortable: false,
  },
  {
    value: 'k8s.pod',
    title: 'Pod',
    sortable: false,
  },

  {
    value: 'level',
    title: 'Level',
    sortable: false,
    type: 'text',
    filter: 'equals',
    options: () => LEVEL_OPTIONS,
  },
  {
    value: 'message',
    title: 'Message',
    filter: 'equals',
    type: 'text',
    sortable: false,
  },
  {
    value: 'timestamp',
    title: 'Timestamp',
    filter: 'between',
    type: 'text',
    sortable: false,
  },
];

export const LogTable = generateTable({ columns, dataSource });

LogTable.displayName = 'LogTable';
LogTable.columns = columns.map(c => c.value);
