import React from "react";
import "./App.css";
import { KineticLib, logout } from "@kineticdata/react";
import { history } from "./index";
import { PrivateFacing } from "./PrivateFacing";
import { PublicFacing } from "./PublicFacing";
import { WallySpinner } from "./pages/Loading";
import { Login } from "./pages/Login";

export const appLogout = () => logout(() => history.push("/"));

export const TextFilter = props =>
  (typeof props.visible !== 'undefined' && props.visible) || typeof props.visible === 'undefined' ? (
    <div className="field">
      <label htmlFor={props.id || props.name}><em>{props.label || props.title}</em></label>
      <input
        type="text"
        id={props.id || props.name}
        name={props.name}
        value={props.value || ''}
        onBlur={props.onBlur}
        onChange={props.onChange}
        onFocus={props.onFocus}
      />
    </div>
  ) : null;

export const App = () => (
  <KineticLib locale="en" components={{
    TextFilter
  }}>
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
