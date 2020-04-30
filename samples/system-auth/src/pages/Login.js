import React from 'react';

export const Login = ({
  error,
  onChangePassword,
  onChangeUsername,
  onLogin,
  password,
  pending,
  username,
}) => {
  return (
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
      <button disabled={pending} type="submit" onClick={onLogin}>
        Login
      </button>
    </form>

  );
};
