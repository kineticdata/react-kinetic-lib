import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchForms } from "@kineticdata/react";
import { WallySpinner } from "./Loading";

export const FormList = props => {
  const [{ forms, error }, setForms] = useState({});

  useEffect(() => {
    fetchForms({
      kappSlug: "test",
      public: !props.private
    }).then(setForms);
  }, [props.private]);

  return forms ? (
    <Fragment>
      <h1>Forms</h1>
      <ul>
        {forms
          .filter(form => props.private || !form.private)
          .map(form => (
            <li key={form.slug}>
              <Link to={`/forms/${form.slug}`}>{form.name}</Link>
            </li>
          ))}
      </ul>
    </Fragment>
  ) : error ? (
    <pre>{JSON.stringify(error)}</pre>
  ) : (
    <WallySpinner />
  );
};
