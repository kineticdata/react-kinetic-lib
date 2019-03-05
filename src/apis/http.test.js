import {
  deserializeAttributes,
  headerBuilder,
  serializeAttributes,
  setDefaultAuthAssumed,
  corePath,
  handleErrors,
} from './http';

jest.mock('../helpers/coreHelpers', () => ({
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

        const errorObject = handleErrors(errorResponse);
        expect(errorObject.serverError.error).toBeDefined();
        expect(errorObject.serverError.error).toBe(
          errorResponse.response.data.error,
        );
      });
    });
    // What scenarios do we handle?
    describe('when there is a 500 without an error object', () => {
      test('returns an object without "error"', () => {
        const errorResponse = {
          response: {
            status: 500,
            statusText: 'Internal server error',
            data: {},
          },
        };

        const errorObject = handleErrors(errorResponse);
        expect(errorObject.serverError.error).toBeUndefined();
      });
    });
  });

  describe('#serializeAttributes', () => {
    describe('when translatable contains an attribute object', () => {
      const xlatable = { attributes: { First: [1], Second: [2] } };
      const result = serializeAttributes(xlatable, 'attributes');

      test('returns an array', () => {
        expect(result.attributes).toBeInstanceOf(Array);
        expect(result.attributes).toHaveLength(2);
      });

      test('returned array contains objects', () => {
        expect(result.attributes[0]).toBeDefined();
        expect(result.attributes[0]).toHaveProperty('name', 'First');
        expect(result.attributes[0]).toHaveProperty('values', [1]);
      });

      test('mutates the object passed', () => {
        expect(xlatable.attributes).toBeDefined();
        expect(xlatable.attributes).toBeInstanceOf(Array);
      });
    });

    describe('when translatable contains an attribute array', () => {
      const xlatable = {
        attributes: [
          { name: 'First', values: [1] },
          { name: 'Second', values: [2] },
        ],
      };
      const result = serializeAttributes(xlatable, 'attributes');

      test('returns an array', () => {
        expect(result.attributes).toBeInstanceOf(Array);
        expect(result.attributes).toHaveLength(2);
      });

      test('returned array contains objects', () => {
        expect(result.attributes[0]).toBeDefined();
        expect(result.attributes[0]).toHaveProperty('name', 'First');
        expect(result.attributes[0]).toHaveProperty('values', [1]);
      });
    });

    test('when attribute key does not exist', () => {
      const src = { thing: {} };

      const dest = serializeAttributes(src, 'attributes');
      expect(src).toEqual(src);
    });
  });

  describe('#deserializeAttributes', () => {
    //  - when the envelop is an array.
    // when the attribute key is not present
    test('when there is no envelop', () => {
      const src = {
        attributes: [{ name: 'A', values: ['B'] }],
      };
      const dest = deserializeAttributes('attributes')(src);

      expect(dest).toBeDefined();
      expect(dest.attributes).toBeInstanceOf(Object);
    });

    test('when there is an envelop', () => {
      const src = {
        thing: {
          attributes: [{ name: 'A', values: ['B'] }],
        },
      };
      const dest = deserializeAttributes('attributes', 'thing')(src);

      expect(dest).toBeDefined();
      expect(dest.thing.attributes).toBeInstanceOf(Object);
    });

    test('when the envelop contains an array', () => {
      const src = {
        thing: [
          {
            name: 'Thing',
            slug: 'thing',
            attributes: [{ name: 'A', values: ['B'] }],
          },
        ],
      };

      const dest = deserializeAttributes('attributes', 'thing')(src);

      expect(dest).toBeDefined();
      expect(dest.thing[0].attributes).toBeInstanceOf(Object);
    });

    test('when attribute key does not exist', () => {
      const src = { thing: {} };

      const dest = deserializeAttributes('attributes', 'thing')(src);
      expect(src).toEqual(src);
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
});
