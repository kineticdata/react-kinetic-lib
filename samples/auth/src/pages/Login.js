import React, { useCallback, useState } from 'react';
import { history } from '../index';
import { appLogout } from '../App';

export const Login = ({
  error,
  mode: initialMode = '',
  onChangePassword,
  onChangeUsername,
  onLogin,
  onSso,
  password,
  pending,
  redirect,
  username,
}) => {
  const redirectCallback = redirect ? () => history.push('/') : null;
  const [mode, setMode] = useState(initialMode);
  const onSubmit = useCallback(event => onLogin(event, redirectCallback), [
    onLogin,
    redirectCallback,
  ]);
  const openSso = useCallback(
    event => onSso(redirectCallback, [onSso, redirectCallback]),
    [],
  );
  return (
    <>
      {mode === 'sign-up' ? (
        <div>sign up</div>
      ) : mode === 'password-reset' ? (
        <div>password reset</div>
      ) : (
        <form>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={onChangeUsername}
            value={username}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={onChangePassword}
            value={password}
          />
          <button disabled={pending} type="submit" onClick={onSubmit}>
            Login
          </button>
        </form>
      )}
      {onSso && (
        <button disabled={pending} type="button" onClick={openSso}>
          SSO
        </button>
      )}
      {mode && (
        <button disabled={pending} onClick={() => setMode('')}>
          Login
        </button>
      )}
      {mode !== 'sign-up' && (
        <button disabled={pending} onClick={() => setMode('sign-up')}>
          Sign Up
        </button>
      )}
      {mode !== 'password-reset' && (
        <button disabled={pending} onClick={() => setMode('password-reset')}>
          Forgot Password
        </button>
      )}
      <button disabled={pending} onClick={appLogout}>
        Cancel
      </button>
    </>
  );
};
