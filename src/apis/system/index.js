import axios from 'axios';
import { handleErrors, headerBuilder, paramBuilder } from '../http';

export const fetchTenants = (options = {}) => {
  // Build URL and fetch the space.
  return axios
    .get('/app/system-coordinator/api/v1/tenants', {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({
      tenants: response.data.tenants,
      nextPageToken: response.data.nextPageToken,
    }))
    .catch(handleErrors);
};

export const fetchTenant = (options = {}) => {
  const { slug } = options;
  if (!slug) {
    throw new Error('fetchTenant failed! The option "slug" is required.');
  }
  // Build URL and fetch the space.
  return axios
    .get(`/app/system-coordinator/api/v1/tenants/${slug}`, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ tenant: response.data.tenant }))
    .catch(handleErrors);
};

export const updateTenant = (options = {}) => {
  const { slug, tenant } = options;
  if (!tenant) {
    throw new Error('updateTenant failed! The option "tenant" is required.');
  }
  if (!slug) {
    throw new Error('updateTenant failed! The option "slug" is required.');
  }

  return axios
    .put(`/app/system-coordinator/api/v1/tenants/${slug}`, tenant, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ tenant: response.data.tenant }))
    .catch(handleErrors);
};

export const createTenant = (options = {}) => {
  const { tenant } = options;
  if (!tenant) {
    throw new Error('createTenant failed! The option "tenant" is required.');
  }

  return axios
    .post('/app/system-coordinator/api/v1/tenants', tenant, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ tenant: response.data.tenant }))
    .catch(handleErrors);
};

export const deleteTenant = (options = {}) => {
  const { slug } = options;
  if (!slug) {
    throw new Error('createTenant failed! The option "slug" is required.');
  }

  return axios
    .delete(`/app/system-coordinator/api/v1/tenants/${slug}`, {
      __bypassInitInterceptor: true,
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ tenant: response.data.tenant }))
    .catch(handleErrors);
};

export const fetchSystem = (options = {}) => {
  // Build URL and fetch the system config.
  return axios
    .get('/app/system-coordinator/components/core/app/api/v1/config', {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ system: response.data }))
    .catch(handleErrors);
};

export const updateSystem = (options = {}) => {
  const { system } = options;
  if (!system) {
    throw new Error('updateSystem failed! The option "system" is required.');
  }
  // Build URL and fetch the system config.
  return axios
    .put('/app/system-coordinator/components/core/app/api/v1/config', system, {
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ system: response.data }))
    .catch(handleErrors);
};

export const fetchSystemUser = (options = {}) => {
  // Build URL and fetch the space.
  return axios
    .get('/app/system-coordinator/api/v1/platform/system-user', {
      __bypassInitInterceptor: true,
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ user: response.data }))
    .catch(handleErrors);
};

export const updateSystemUser = (options = {}) => {
  const { user } = options;
  if (!user) {
    throw new Error('updateSystemUser failed! The option "user" is required.');
  }

  return axios
    .put('/app/system-coordinator/api/v1/platform/system-user', user, {
      __bypassInitInterceptor: true,
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ user: response.data }))
    .catch(handleErrors);
};

export const fetchTaskDbAdapters = (options = {}) => {
  // Build URL and fetch the space.
  return (
    axios
      .get(`/app/system-coordinator/api/v1/meta/task-db-adapters`, {
        __bypassInitInterceptor: true,
        params: paramBuilder(options),
        headers: headerBuilder(options),
      })
      .then(response => response.data)
      // .then(response => ({ space: response.data.space }))
      .catch(handleErrors)
  );
};

export const fetchTaskDbAdapter = (options = {}) => {
  // Build URL and fetch the space.
  return axios
    .get(
      `/app/system-coordinator/api/v1/meta/task-db-adapters/${options.type}`,
      {
        __bypassInitInterceptor: true,
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ adapter: response.data.adapter }))
    .catch(handleErrors);
};

export const fetchSystemDefaultTaskDbAdapter = (options = {}) => {
  // Build URL and fetch the space.
  return axios
    .get(`/app/system-coordinator/api/v1/platform/default-task-db-adapter`, {
      __bypassInitInterceptor: true,
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ adapter: response.data.adapter }))
    .catch(handleErrors);
};

export const updateSystemDefaultTaskDbAdapter = (options = {}) => {
  const { adapter } = options;
  if (!adapter) {
    throw new Error(
      'updateSystemDefaultTaskDbAdapter failed! The option "adapter" is required.',
    );
  }

  return axios
    .put(
      `/app/system-coordinator/api/v1/platform/default-task-db-adapter`,
      adapter,
      {
        __bypassInitInterceptor: true,
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ adapter: response.data.adapter }))
    .catch(handleErrors);
};

export const fetchSystemDefaultSmtpAdapter = (options = {}) => {
  // Build URL and fetch the space.
  return axios
    .get('/app/system-coordinator/api/v1/platform/default-smtp-adapter', {
      __bypassInitInterceptor: true,
      params: paramBuilder(options),
      headers: headerBuilder(options),
    })
    .then(response => ({ adapter: response.data.adapter }))
    .catch(handleErrors);
};

export const updateSystemDefaultSmtpAdapter = (options = {}) => {
  const { adapter } = options;
  if (!adapter) {
    throw new Error(
      'updateSystemDefaultSmtpAdapter failed! The option "adapter" is required.',
    );
  }

  return axios
    .put(
      '/app/system-coordinator/api/v1/platform/default-smtp-adapter',
      adapter,
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => ({ adapter: response.data.adapter }))
    .catch(handleErrors);
};

export const systemLogin = (options = {}) => {
  const { username, password } = options;

  return axios
    .post('/app/system-coordinator/login', { username, password }, {})
    .then(response => response.data)
    .catch(handleErrors);
};

export const refreshSystemToken = (options = {}) => {
  return axios
    .post(
      '/app/system-coordinator/refresh',
      {},
      {
        params: paramBuilder(options),
        headers: headerBuilder(options),
      },
    )
    .then(response => response.data)
    .catch(handleErrors);
};
