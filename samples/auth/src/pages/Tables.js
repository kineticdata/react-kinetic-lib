import React from 'react';
import { DemoTable } from '../DemoTable'


export const Tables = () => (
  <div>
    <DemoTable tableKey="demo-table" uncontrolled>
      {({ table, filter }) => <div className="row">
        <div className="col-8">
          <h1>Demo Table</h1>
          {table}
        </div>
      <div className="col-4">
        <h1>Filters</h1>
        {filter}
      </div>
      </div>}
    </DemoTable>
  </div>
)

