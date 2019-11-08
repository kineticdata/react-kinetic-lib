import axios from 'axios';
import { handleErrors, validateOptions } from '../http';

const generateNextPageToken = data =>
  data.offset + data.limit > data.count ? null : data.limit + data.offset;

export const fetchTrees = (options = {}) =>
  axios
    .get('/app/components/task/app/api/v2/trees', {
      params: {
        type: options.type,
        limit: options.limit,
        include: options.include,
        offset: options.offset,
        source: options.source || undefined,
        group: options.group || undefined,
        name: options.name || undefined,
        ownerEmail: options.ownerEmail || undefined,
        status: options.status || undefined,
        orderBy: options.orderBy,
        direction: options.direction,
      },
    })
    .then(response => ({
      trees: response.data.trees,
      nextPageToken: generateNextPageToken(response.data),
    }));

export const fetchTree = (options = {}) => {
  validateOptions('fetchTree', ['itemId'], options);
  return axios
    .get(`/app/components/task/app/api/v2/trees/${options.itemId}`, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      tree: response.data,
    }));
};

export const fetchTree2 = (options = {}) => {
  validateOptions('fetchTree', ['name'], options);
  const id =
    options.sourceName && options.sourceGroup
      ? `${options.sourceName} :: ${options.sourceGroup} :: ${options.name}`
      : options.name;
  return axios
    .get(`/app/components/task/app/api/v2/trees/${id}`, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      tree: response.data,
    }));
};

export const updateTree = (options = {}) => {
  validateOptions('updateTree', ['itemId', 'tree'], options);
  return axios
    .put(
      `/app/components/task/app/api/v2/trees/${options.itemId}`,
      options.tree,
      {
        params: {
          include: options.include,
        },
      },
    )
    .then(response => ({
      tree: response.data,
    }));
};

export const updateTree2 = (options = {}) => {
  validateOptions('updateTree2', ['name', 'tree'], options);
  const id =
    options.sourceName && options.sourceGroup
      ? `${options.sourceName} :: ${options.sourceGroup} :: ${options.name}`
      : options.name;
  return axios
    .put(`/app/components/task/app/api/v2/trees/${id}`, options.tree, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      tree: response.data.tree,
    }))
    .catch(handleErrors);
};

export const createTree = (options = {}) => {
  validateOptions('createTree', ['tree'], options);
  return axios
    .post('/app/components/task/app/api/v2/trees', options.tree, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      tree: response.data,
    }))
    .catch(handleErrors);
};

export const fetchSources = (options = {}) =>
  axios
    .get('/app/components/task/app/api/v2/sources', {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      sources: response.data.sourceRoots,
    }));

export const fetchTaskCategories = (options = {}) =>
  axios
    .get('/app/components/task/app/api/v2/categories', {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      categories: response.data.categories,
    }));

export const cloneTree = (options = {}) => {
  validateOptions(
    'cloneTree',
    ['name', 'tree', 'sourceGroup', 'sourceName'],
    options,
  );
  return axios
    .post(
      `/app/components/task/app/api/v2/trees`,
      {
        ...options.tree,
        title: `${options.sourceName} :: ${options.sourceGroup} :: ${options.name}`,
      },
      {
        params: {
          include: options.include,
        },
      },
    )
    .then(response => ({
      tree: response.data.tree,
    }))
    .catch(handleErrors);
};

export const createTaskCategory = (options = {}) => {
  validateOptions('createTaskCategory', ['category'], options);
  return axios
    .post('/app/components/task/app/api/v2/categories', options.category, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      category: response.data.category,
    }));
};

export const fetchTaskCategory = (options = {}) => {
  validateOptions('fetchTaskCategory', ['categoryName'], options);
  return axios
    .get(`/app/components/task/app/api/v2/categories/${options.categoryName}`, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      category: response.data,
    }));
};

export const deleteTaskCategory = (options = {}) => {
  validateOptions('deleteTaskCategory', ['categoryName'], options);
  return axios
    .delete(
      `/app/components/task/app/api/v2/categories/${options.categoryName}`,
      {
        params: {
          include: options.include,
        },
      },
    )
    .then(response => ({
      category: response.data.category,
    }));
};

export const updateTaskCategory = (options = {}) => {
  validateOptions('updateTaskCategory', ['categoryName', 'category'], options);
  return axios
    .put(
      `/app/components/task/app/api/v2/categories/${options.categoryName}`,
      options.category,
      {
        params: {
          include: options.include,
        },
      },
    )
    .then(response => ({
      category: response.data.category,
    }));
};

export const fetchPolicyRules = (options = {}) => {
  validateOptions('fetchPolicyRules', ['type'], options);
  return axios
    .get(`/app/components/task/app/api/v2/policyRules/${options.type}`, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      policyRules: response.data.policyRules,
    }));
};

export const createPolicyRule = (options = {}) => {
  validateOptions('createPolicyRule', ['policy', 'policyType'], options);
  return axios
    .post(
      `/app/components/task/app/api/v2/policyRules/${options.policyType}`,
      options.policy,
      {
        params: {
          include: options.include,
        },
      },
    )
    .then(response => ({
      policyRule: response.data.policyRule,
    }));
};

export const fetchPolicyRule = (options = {}) => {
  validateOptions('fetchPolicyRule', ['policyName', 'policyType'], options);
  return axios
    .get(
      `/app/components/task/app/api/v2/policyRules/${options.policyType}/${options.policyName}`,
      {
        params: {
          include: options.include,
        },
      },
    )
    .then(response => ({
      policyRule: response.data,
    }));
};

export const deletePolicyRule = (options = {}) => {
  validateOptions('deletePolicyRule', ['policyName', 'policyType'], options);
  return axios
    .delete(
      `/app/components/task/app/api/v2/policyRules/${options.policyType}/${options.policyName}`,
      {
        params: {
          include: options.include,
        },
      },
    )
    .then(response => ({
      policyRule: response.data.policyRule,
    }));
};

export const updatePolicyRule = (options = {}) => {
  validateOptions(
    'updatePolicyRule',
    ['policyName', 'policy', 'policyType'],
    options,
  );
  return axios
    .put(
      `/app/components/task/app/api/v2/policyRules/${options.policyType}/${options.policyName}`,
      options.policy,
      {
        params: {
          include: options.include,
        },
      },
    )
    .then(response => ({
      policyRule: response.data.policyRule,
    }));
};

export const fetchHandlers = (options = {}) =>
  axios
    .get('/app/components/task/app/api/v2/handlers', {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      handlers: response.data.handlers,
    }));

export const fetchHandler = (options = {}) => {
  validateOptions('fetchHandler', ['definitionId'], options);
  return axios
    .get(`/app/components/task/app/api/v2/handlers/${options.definitionId}`, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      handler: response.data,
    }));
};

export const createHandler = (options = {}) => {
  const { packageUrl, packageFile } = options;

  let data = {};
  let headers = {};

  if (packageUrl) {
    data = { packageUrl };
  } else {
    data = new FormData();
    data.set('package', packageFile);
    headers = { 'Content-Type': 'multipart/form-data' };
    console.log(packageFile);
  }

  return axios
    .post('/app/components/task/app/api/v2/handlers', data, {
      headers,
    })
    .then(response => response.data)
    .catch(() => ({
      error:
        'There was a problem uploading the handler. Please make sure it is a valid handler and is not already uploaded.',
    }));
};

export const fetchUsage = (options = {}) => {
  validateOptions('fetchUsage', ['definitionId', 'usageType'], options);
  const path =
    options.usageType === 'handler'
      ? `/app/components/task/app/api/v2/handlers/${options.definitionId}/usage`
      : `/app/components/task/app/api/v2/trees/${options.definitionId}/usage`;
  return axios
    .get(path, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      usages:
        options.usageType === 'handler'
          ? response.data.handlerUsage
          : options.usageType === 'routine'
          ? response.data.routineUsage
          : [],
      totalTrees: response.data.totalTrees,
      totalRoutines: response.data.totalRoutines,
      totalNodes: response.data.totalNodes,
    }));
};

export const stopEngine = (options = {}) =>
  axios
    .post('/app/components/task/app/api/v2/engine', {
      action: 'stop',
      asynchronous: options.asynchronous || 'false',
    })
    .then(response => response.data);

export const startEngine = (options = {}) =>
  axios
    .post('/app/components/task/app/api/v2/engine', {
      action: 'start',
      asynchronous: options.asynchronous || 'false',
    })
    .then(response => response.data);

export const fetchEngineStatus = () =>
  axios
    .get('/app/components/task/app/api/v2/engine')
    .then(response => response.data);

export const fetchEngineLicense = () =>
  axios
    .get('/app/components/task/app/api/v2/config/license')
    .then(response => response.data);

export const fetchEngineSettings = () =>
  axios.get('/app/components/task/app/api/v2/config/engine').then(response => ({
    settings: response.data.properties,
  }));

export const updateEngineSettings = (options = {}) =>
  axios
    .put('/app/components/task/app/api/v2/config/engine', options.settings)
    .then(response => ({
      message: response.data.message,
    }));

export const fetchTaskRuns = (options = {}) =>
  axios
    .get('/app/components/task/app/api/v2/runs', {
      params: {
        type: options.type,
        limit: options.limit,
        include: options.include,
        offset: options.offset,
        source: options.source || undefined,
        group: options.group || undefined,
        treeType: options.treeType || undefined,
        sourceId: options.sourceId || undefined,
        name: options.name || undefined,
        ownerEmail: options.ownerEmail || undefined,
        status: options.status || undefined,
        orderBy: options.orderBy,
        direction: options.direction,
      },
    })
    .then(response => ({
      runs: response.data.runs,
      nextPageToken: generateNextPageToken(response.data),
    }));

export const fetchTaskRun = (options = {}) => {
  validateOptions('fetchTaskRun', ['runId'], options);

  return axios
    .get(`/app/components/task/app/api/v2/runs/${options.runId}`, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      run: response.data,
    }));
};

export const updateTaskRun = (options = {}) => {
  validateOptions('updateTaskRun', ['runId', 'run'], options);

  return axios.put(
    `/app/components/task/app/api/v2/runs/${options.runId}`,
    options.run,
    {
      include: options.include,
    },
  );
};

export const fetchTaskTriggers = (options = {}) =>
  axios
    .get('/app/components/task/app/api/v2/triggers', {
      params: {
        limit: options.limit,
        include: options.include,
        offset: options.offset,
        source: options.source || undefined,
        group: options.group || undefined,
        sourceId: options.sourceId || undefined,
        tree: options.treeName || undefined,
        treeId: options.treeId || undefined,
        treeType: options.treeType || undefined,
        action: options.action || undefined,
        branchId: options.branchId || undefined,
        runId: options.runId || undefined,
        managementAction: options.managementAction || undefined,
        selectionCriterion: options.selectionCriterion || undefined,
        status: options.status || undefined,
        token: options.token || undefined,
        timeline: options.orderBy,
        direction: options.direction,
        start: options.start,
        end: options.end,
      },
    })
    .then(response => ({
      triggers: response.data.triggers,
      nextPageToken: generateNextPageToken(response.data),
    }));

export const fetchTaskRunErrors = (options = {}) =>
  axios
    .get('/app/components/task/app/api/v2/errors', {
      params: {
        limit: options.limit,
        include: options.include,
        offset: options.offset,
        timeline: options.orderBy,
        direction: options.direction,
        start: options.start,
        end: options.end,
        status: options.status || undefined,
        source: options.source || undefined,
        sourceId: options.sourceId || undefined,
        group: options.group || undefined,
        tree: options.tree || undefined,
        nodeId: options.nodeId || undefined,
        handlerId: options.handlerId || undefined,
        runId: options.runId || undefined,
        type: options.type || undefined,
        relatedItem1Id: options.relatedItem1Id || undefined,
        relatedItem1Type: options.relatedItem1Type || undefined,
        relatedItem2Id: options.relatedItem1Id || undefined,
        relatedItem2Type: options.relatedItem1Type || undefined,
      },
    })
    .then(response => ({
      runErrors: response.data.errors,
      nextPageToken: generateNextPageToken(response.data),
    }));

export const fetchTaskRunError = (options = {}) => {
  validateOptions('fetchTaskRunError', ['errorId'], options);

  return axios
    .get(`/app/components/task/app/api/v2/errors/${options.errorId}`, {
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      runError: response.data,
    }));
};

export const updateRunTaskResults = (options = {}) => {
  validateOptions(
    'updateRunTaskResults',
    ['runId', 'taskId', 'results'],
    options,
  );

  return axios
    .put(
      `/app/components/task/app/api/v2/runs/${options.runId}/tasks/${options.taskId}`,
      { results: options.results },
      {
        params: {
          include: options.include,
        },
      },
    )
    .then(response => ({
      message: response.data,
    }));
};

export const resolveTaskErrors = (options = {}) => {
  validateOptions(
    'resolveTaskErrors',
    ['ids', 'action', 'resolution'],
    options,
  );

  return axios
    .post('/app/components/task/app/api/v2/errors/resolve', {
      ids: options.ids,
      action: options.action,
      resolution: options.resolution,
      params: {
        include: options.include,
      },
    })
    .then(response => ({
      message: response.data,
    }));
};
