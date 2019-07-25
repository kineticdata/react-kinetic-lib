import React, { Component } from 'react';
import isPlainObject from 'lodash.isplainobject';
import isString from 'lodash.isstring';
import deepEqual from 'deepequal';
import { K } from '../../../helpers';
import { corePath } from '../../../apis/http';

export const queryString = ({ review, values }) => {
  const parameters = [];
  if (review === true) {
    parameters.push('review');
  } else if (isString(review)) {
    parameters.push(`review=${encodeURIComponent(review)}`);
  }
  if (isPlainObject(values)) {
    Object.keys(values).forEach(field => {
      parameters.push(
        `${encodeURIComponent(`values[${field}]`)}=${encodeURIComponent(
          values[field],
        )}`,
      );
    });
  }
  return parameters.join('&');
};

export const applyGuard = (func, context, args) =>
  typeof func === 'function' && func.apply(context, args);

export class CoreForm extends Component {
  constructor(props) {
    super(props);
    this.state = { pending: true, error: false, errorType: null };
  }

  componentDidMount() {
    this.loadForm(this.props);
  }

  componentDidUpdate(prevProps) {
    if (!deepEqual(this.props, prevProps)) {
      this.closeForm();
      this.loadForm(this.props);
    }
  }

  componentWillUnmount() {
    this.closeForm();
  }

  getGlobalsPromise() {
    if (!this.globalsPromise) {
      if (typeof this.props.globals === 'function') {
        this.globalsPromise = this.props.globals();
      } else if (this.props.globals instanceof Promise) {
        this.globalsPromise = this.props.globals;
      } else {
        this.globalsPromise = Promise.resolve();
      }
    }
    return this.globalsPromise;
  }

  closeForm() {
    this.form.then(form => form.close());
  }

  loadForm(props) {
    this.setState({ pending: true, error: false, errorType: null });
    this.form = new Promise(resolve => {
      this.getGlobalsPromise().then(() => {
        K.load({
          path: `${corePath(props)}?${queryString(props)}`,
          container: this.container,
          loaded: form => {
            resolve(form);
            this.setState({ pending: false, error: false, errorType: null });
            applyGuard(props.onLoaded || props.loaded, undefined, [form]);
          },
          unauthorized: (...args) => {
            this.setState({ errorType: 'unauthorized' });
            applyGuard(
              props.onUnauthorized || props.unauthorized,
              undefined,
              args,
            );
          },
          forbidden: (...args) => {
            this.setState({ errorType: 'forbidden' });
            applyGuard(props.onForbidden || props.forbidden, undefined, args);
          },
          notFound: (...args) => {
            this.setState({ errorType: 'notFound' });
            applyGuard(props.onNotFound || props.notFound, undefined, args);
          },
          error: (...args) => {
            this.setState({ pending: false, error: true });
            applyGuard(props.onError || props.error, undefined, args);
          },
          created: props.onCreated || props.created,
          updated: props.onUpdated || props.updated,
          completed: props.onCompleted || props.completed,
          originId: props.originId,
          parentId: props.parentId,
        });
      });
    });
  }

  render() {
    return (
      <div className="embedded-core-form">
        <div
          ref={element => {
            this.container = element;
          }}
          style={
            this.state.pending || this.state.error ? { display: 'none' } : {}
          }
        />
        {this.state.pending && this.props.pendingComponent && (
          <this.props.pendingComponent />
        )}
        {this.state.errorType === 'unauthorized' &&
          this.props.unauthorizedComponent && (
            <this.props.unauthorizedComponent />
          )}
        {this.state.errorType === 'forbidden' &&
          this.props.forbiddenComponent && <this.props.forbiddenComponent />}
        {this.state.errorType === 'notFound' &&
          this.props.notFoundComponent && <this.props.notFoundComponent />}
        {this.state.error &&
          !this.state.errorType &&
          this.props.unexpectedErrorComponent && (
            <this.props.unexpectedErrorComponent />
          )}
      </div>
    );
  }
}
