import axios from 'axios';

import { fetchProfile, updateProfile } from './profile';
import { UserBuilder } from '../../../tests/utils/user_builder';
import {
  rejectPromiseWith,
  resolvePromiseWith,
} from '../../../tests/utils/promises';

// Mock out the bundle object from a dependency.
jest.mock('../../helpers/coreHelpers', () => ({
  bundle: {
    apiLocation: () => 'user/app/api/v1',
    kappSlug: () => 'mock-kapp',
  },
}));

describe('profile api', () => {
  describe('#fetchProfile', () => {
    describe('when successful', () => {
      let response;
      let testUser;
      let username;

      beforeEach(() => {
        response = {
          status: 200,
          data: {},
        };
        testUser = new UserBuilder()
          .stub()
          .withAttribute('Attribute', 'value')
          .build();
        username = testUser.username;
        response.data = testUser;
        axios.get = resolvePromiseWith(response);
      });

      test('does not return errors', () => {
        expect.assertions(1);
        return fetchProfile().then(({ errors }) => {
          expect(errors).toBeUndefined();
        });
      });

      test('returns a profile', () => {
        expect.assertions(1);
        return fetchProfile().then(({ profile }) => {
          expect(profile).toMatchObject({
            username: testUser.username,
            displayName: testUser.displayName,
          });
        });
      });

      test('translates attributes', () => {
        expect.assertions(2);
        return fetchProfile().then(({ profile }) => {
          expect(profile.attributes).toBeDefined();
          expect(profile.attributes).not.toBeInstanceOf(Array);
        });
      });
    });
  });

  describe('#updateProfile', () => {
    describe('when successful', () => {
      let response;
      let testUser;

      beforeEach(() => {
        response = {
          status: 200,
          data: {
            user: {},
          },
        };
        testUser = new UserBuilder()
          .stub()
          .withAttribute('Attribute', 'value')
          .build();
        response.data.user = testUser;
        axios.put = resolvePromiseWith(response);
      });

      test('does not return errors', () => {
        expect.assertions(1);
        return updateProfile({ profile: testUser }).then(({ errors }) => {
          expect(errors).toBeUndefined();
        });
      });

      test('returns a profile', () => {
        expect.assertions(1);
        return updateProfile({ profile: testUser }).then(({ profile }) => {
          expect(profile).toMatchObject({
            username: testUser.username,
            displayName: testUser.displayName,
          });
        });
      });

      test('translates attributes', () => {
        expect.assertions(2);
        return updateProfile({ profile: testUser }).then(({ profile }) => {
          expect(profile.attributes).toBeDefined();
          expect(profile.attributes).not.toBeInstanceOf(Array);
        });
      });
    });

    describe('when unsuccessful', () => {
      let response;

      beforeEach(() => {
        response = {
          status: 500,
        };
        axios.put = rejectPromiseWith({ response });
      });

      test('throws an exception when no profile object is provided', () => {
        expect(() => {
          updateProfile();
        }).toThrow();
      });

      test('does return errors', () => {
        expect.assertions(1);
        return updateProfile({ profile: {} }).then(({ serverError }) => {
          expect(serverError).toBeDefined();
        });
      });
    });
  });
});
