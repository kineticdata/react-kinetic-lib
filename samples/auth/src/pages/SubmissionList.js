import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchSubmissions, SubmissionSearch } from "@kineticdata/react";
import { WallySpinner } from "./Loading";

export const SubmissionList = () => {
  const [submissions, setSubmissions] = useState(null);
  useEffect(() => {
    async function fetchSubmissionsWrapper() {
      const { submissions } = await searchSubmissions({
        kapp: "test",
        search: new SubmissionSearch().build(),
        include: "form"
      });
      setSubmissions(submissions);
    }
    fetchSubmissionsWrapper();
  }, []);
  return submissions ? (
    <Fragment>
      <h1>Submissions</h1>
      <ul>
        {submissions.map(submission => (
          <li key={submission.id}>
            <Link to={`/submissions/${submission.id}`}>
              #{submission.handle} - {submission.form.name}
            </Link>
          </li>
        ))}
      </ul>
    </Fragment>
  ) : (
    <WallySpinner />
  );
};
