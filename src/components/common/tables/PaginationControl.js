import React from 'react';
import { I18n } from '../../core/i18n/I18n';

export const PaginationControl = ({ nextPage, prevPage }) => (
  <div>
    <button onClick={prevPage} disabled={!prevPage}>
      <I18n>Previous</I18n>
    </button>
    <button onClick={nextPage} disabled={!nextPage}>
      <I18n>Next</I18n>
    </button>
  </div>
);
