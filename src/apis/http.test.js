import {
  headerBuilder,
  setDefaultAuthAssumed,
  corePath,
  handleErrors,
  paramBuilder,
} from './http';

jest.mock('../helpers', () => ({
  bundle: {
    spaceLocation: () => '/kinetic/acme',
    kappSlug: () => 'catalog',
  },
}));

describe('http module', () => {
  describe('#handleErrors', () => {
    // What scenarios do we handle?
    describe('when there is a 500 with an error object', () => {
      test('returns an object with "error"', () => {
        const errorResponse = {
          response: {
            status: 500,
            statusText: 'Internal server error',
            data: {
              error: 'There were no attributes, QQ',
            },
          },
        };

        const { error } = handleErrors(errorResponse);
        expect(error).toEqual({
          key: null,
          message: 'There were no attributes, QQ',
          statusCode: 500,
        });
      });
    });
    // What scenarios do we handle?
    describe('when there is a 500 with empty data object', () => {
      test('returns an object without "error"', () => {
        const errorResponse = {
          response: {
            status: 500,
            statusText: 'Internal server error',
            data: {},
          },
        };

        const { error } = handleErrors(errorResponse);
        expect(error).toEqual({
          statusCode: 500,
          key: null,
          message: 'Internal server error',
        });
      });
    });
  });

  describe('corePath', () => {
    describe('kapp forms and submissions', () => {
      test('builds url with default kapp', () => {
        expect(corePath({ form: 'ipad-request' })).toBe(
          '/kinetic/acme/catalog/ipad-request',
        );
      });

      test('builds url with specified kapp', () => {
        expect(corePath({ form: 'ipad-request', kapp: 'services' })).toBe(
          '/kinetic/acme/services/ipad-request',
        );
      });

      test('builds url with the submission id', () => {
        expect(corePath({ submission: 'abc123' })).toBe(
          '/kinetic/acme/submissions/abc123',
        );
      });
    });

    describe('datastore forms and submissions', () => {
      test('builds url to form', () => {
        expect(corePath({ form: 'cars', datastore: true })).toBe(
          '/kinetic/acme/app/datastore/forms/cars',
        );
      });

      test('builds url with the submission id', () => {
        expect(corePath({ submission: 'abc123', datastore: true })).toBe(
          '/kinetic/acme/app/datastore/submissions/abc123',
        );
      });
    });
  });

  describe('headerBuilder', () => {
    // Make sure the default is reset for each test case
    beforeEach(() => setDefaultAuthAssumed(false));

    test('returns empty object when given no relevant options', () => {
      expect(headerBuilder({})).toEqual({});
    });
    test('sets X-Kinetic-AuthAssumed when given no options but default is true', () => {
      setDefaultAuthAssumed(true);
      expect(headerBuilder({})).toEqual({ 'X-Kinetic-AuthAssumed': 'true' });
    });
    test('sets X-Kinetic-AuthAssumed when given truthy value in options', () => {
      expect(headerBuilder({ authAssumed: true })).toEqual({
        'X-Kinetic-AuthAssumed': 'true',
      });
    });
    test('omits X-Kinetic-AuthAssumed when given falsey value in options (and default is true)', () => {
      setDefaultAuthAssumed(true);
      expect(headerBuilder({ authAssumed: false })).toEqual({});
    });
  });

  // The `paramBuilder` only strips out unnecessary options.
  describe('#paramBuilder', () => {
    test('returns parameter values', () => {
      const params = [
        'include',
        'limit',
        'pageToken',
        'q',
        'direction',
        'orderBy',
        'manage',
        'export',
      ];

      params.forEach(param =>
        expect(paramBuilder({ [param]: param })).toMatchObject({
          [param]: param,
        }),
      );
    });
    test('does not return non-parameter values', () => {
      expect(
        paramBuilder({ limit: 'limit', foobar: 'foobar' }),
      ).not.toMatchObject({ foobar: 'foobar' });
    });
    test('does not return parameters not passed', () => {
      expect(
        paramBuilder({ limit: 'limit', foobar: 'foobar' }),
      ).not.toMatchObject({ include: undefined });
    });
  });
});
