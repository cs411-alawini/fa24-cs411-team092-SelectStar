import React, { useState } from "react";
import "./DataTable.css";
import {MaterialReactTable} from "material-react-table";

const DataTable = ({ data, onAdd, onUpdate, onDelete }) => {
  const [newRow, setNewRow] = useState({});

  return (
    <div className="data-table">
      <MaterialReactTable
        title="Data Table"
        columns={Object.keys(data[0] || {}).map((key) => ({ accessorKey: key, header: key, field: key, id:key }))}
        data={data}
        options={{ search: true, paging: true }}
        editable={{
          onRowAdd: (newRow) =>
            new Promise((resolve, reject) => {
              onAdd(newRow);
              resolve();
            }),
          onRowUpdate: (newRow, oldRow) =>
            new Promise((resolve, reject) => {
              onUpdate(oldRow.id, newRow);
              resolve();
            }),
          onRowDelete: (oldRow) =>
            new Promise((resolve, reject) => {
              onDelete(oldRow.id);
              resolve();
            }),
        }}
      />
    </div>
  );
};

export default DataTable;
