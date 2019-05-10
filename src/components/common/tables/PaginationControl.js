import React from 'react';
import { I18n } from '../i18n/I18nProvider';

export const PaginationControl = ({ nextPage, prevPage }) => (
  <div>
    <button onClick={prevPage} disabled={!prevPage}>
      Previous
    </button>
    <button onClick={nextPage} disabled={!nextPage}>
      Next
    </button>
  </div>
  // <nav aria-label="Page navigation">
  //   <ul className="pagination">
  //     <li
  //       className={`page-item ${!hasPreviousPage ? 'disabled' : ''}`}
  //       onClick={handlePreviousPageClick}
  //     >
  //       <a className="page-link" aria-label="Previous">
  //         <span className="icon">
  //           <span className="fa fa-fw fa-caret-left" aria-hidden="true" />
  //         </span>
  //         <span className="sr-only">
  //           <I18n>Previous</I18n>
  //         </span>
  //       </a>
  //     </li>
  //     <li
  //       className={`page-item ${!hasNextPage ? 'disabled' : ''}`}
  //       onClick={handleNextPageClick}
  //     >
  //       <a className="page-link" aria-label="next">
  //         <span className="icon">
  //           <span className="fa fa-fw fa-caret-right" aria-hidden="true" />
  //         </span>
  //         <span className="sr-only">
  //           <I18n>Next</I18n>
  //         </span>
  //       </a>
  //     </li>
  //   </ul>
  // </nav>
);
