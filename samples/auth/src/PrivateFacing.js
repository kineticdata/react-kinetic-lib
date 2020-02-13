import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import { logoutDirect } from "@kineticdata/react";
import { Form } from "./pages/Form";
import { FormList } from "./pages/FormList";
import { Submission } from "./pages/Submission";
import { SubmissionList } from "./pages/SubmissionList";
import { NotFound } from "./pages/NotFound";
import { appLogout } from "./App";

export const PrivateFacing = () => (
  <>
    <header className="private">
      <h1>Private</h1>
      <Link to="/forms">Forms</Link>
      <Link to="/submissions">Submissions</Link>
      <div className="buttons">
        <button onClick={logoutDirect}>Timeout</button>
        <button onClick={appLogout}>Logout</button>
      </div>
    </header>
    <main>
      <Switch>
        <Route path="/" render={() => "Welcome to the secret stuff"} exact />
        <Route path="/forms" render={() => <FormList private />} exact />
        <Route
          path="/forms/:slug"
          render={({ match }) => <Form private slug={match.params.slug} />}
        />
        <Route path="/submissions" component={SubmissionList} exact />
        <Route path="/submissions/:id" component={Submission} />
        <Route component={NotFound} />
      </Switch>
    </main>
  </>
);
