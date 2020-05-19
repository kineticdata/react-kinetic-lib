import React  from "react";
import { logout, timedOut, refreshSystemToken } from "@kineticdata/react";

export const appLogout = () => logout();

export const PrivateFacing = () => {
  const testAction = async () => {
      const result = await refreshSystemToken()
    console.log('refreshed token', result)
    }

  return (
    <>
      <header className="private">
        <h1>Private</h1>
        <div className="buttons">
          <button type="button" onClick={appLogout}>Logout</button>
          <button onClick={timedOut}>Simulate invalid token?</button>
        </div>
      </header>
      <main>
        <button type="button" onClick={testAction}>Test</button>
      </main>
    </>
  );
};
