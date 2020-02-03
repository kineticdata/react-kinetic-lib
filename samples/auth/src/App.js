import React from "react";
import "./App.css";
import { KineticLib, logout } from "@kineticdata/react";
import { history } from "./index";
import { PrivateFacing } from "./PrivateFacing";
import { PublicFacing } from "./PublicFacing";
import { WallySpinner } from "./pages/Loading";
import { Login } from "./pages/Login";

export const appLogout = () => logout(() => history.push("/"));

export const App = () => (
  <KineticLib>
    {({ initialized, loggedIn, loginProps, timedOut }) => (
      <>
        {!initialized ? (
          <WallySpinner />
        ) : loggedIn ? (
          <PrivateFacing />
        ) : (
          <PublicFacing loginProps={loginProps} />
        )}
        {timedOut && (
          <dialog open>
            <Login {...loginProps} />
          </dialog>
        )}
      </>
    )}
  </KineticLib>
);
