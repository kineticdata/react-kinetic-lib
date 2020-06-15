import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import { FormList } from "./pages/FormList";
import { Form } from "./pages/Form";
import { Login } from "./pages/Login";
import { Tables } from './pages/Tables'

export const PublicFacing = ({ loginProps }) => {
  return (
    <>
      <header className="public">
        <h1>Public</h1>
        <Link to="/forms">Forms</Link>
        <Link to="/tables">Tables</Link>
        <Link to="/submissions">Submissions</Link>
        <Link to="/login">Login</Link>
        <Link to="/sign-up">Sign Up</Link>
      </header>
      <main>
        <Switch>
          <Route path="/" render={() => "Welcome!"} exact />
          <Route path="/forms" component={FormList} exact />
          <Route
            path="/forms/:slug"
            render={({ match }) => <Form slug={match.params.slug} />}
          />
          <Route path="/tables" render={() => <Tables />} />
          <Route
            path="/sign-up"
            render={() => (
              <Login key="sign-up" mode="sign-up" {...loginProps} redirect />
            )}
          />
          <Route
            path="/password-reset"
            render={() => (
              <Login
                key="reset"
                mode="password-reset"
                {...loginProps}
                redirect
              />
            )}
          />
          <Route
            path="/login"
            render={() => <Login key="login" {...loginProps} redirect />}
          />
          <Route render={() => <Login {...loginProps} />} />
        </Switch>
      </main>
    </>
  );
};
