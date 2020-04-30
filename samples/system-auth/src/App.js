import React from "react";
import "./App.css";
import { KineticLib } from "@kineticdata/react";
import { PrivateFacing } from "./PrivateFacing";
import { WallySpinner } from "./pages/Loading";
import { Login } from "./pages/Login";

export const App = () => (
  <KineticLib system>
    {({ initialized, loggedIn, loginProps, timedOut }) => (
      <>
        {!initialized ? (
          <WallySpinner />
        ) : loggedIn ? (
          <PrivateFacing />
        ) : (
          <Login {...loginProps} />
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
