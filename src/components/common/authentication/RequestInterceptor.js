const tokenEndpointPattern = /\/app\/(discussions|loghub)\/api\/v\d/;

const isThirdPartyUrl = config =>
  !config.url.startsWith('/') &&
  !config.url.startsWith(process.env.REACT_APP_API_HOST);

export default class RequestInterceptor {
  constructor(store) {
    this.store = store;
    this.initPromise = new Promise(resolve => {
      const unsub = store.subscribe(() => {
        if (store.getState().getIn(['session', 'initialized'])) {
          unsub();
          resolve();
        }
      });
    });
    this.handleFulfilled = this.handleFulfilled.bind(this);
  }

  handleFulfilled(config) {
    return isThirdPartyUrl(config)
      ? { __bypassAuthInterceptor: true, ...config }
      : config.__bypassInitInterceptor
      ? { withCredentials: true, ...config }
      : this.initPromise.then(() => {
          const { csrfToken, loggedIn, token } = this.store
            .getState()
            .get('session')
            .toObject();
          config.withCredentials = true;
          if (!loggedIn) {
            config.__bypassAuthInterceptor = true;
          }
          if (token && config.url.match(tokenEndpointPattern)) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          if (csrfToken) {
            // we need to set xsrfCookieName otherwise axios will override the
            // xsrf header that we set manually
            config.xsrfCookieName = 'DONT_USE_COOKIES_FOR_XSRF_TOKEN';
            config.headers['X-XSRF-TOKEN'] = csrfToken;
          }
          return config;
        });
  }
}
