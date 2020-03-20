import React from 'react';
import Row from './row';

const TableComponent = ({ elements = [] }) => {
  console.log(elements)
  return (
    <table class="table table-dark scroll">
      <thead>
        <tr>
          <th className="number-row" scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">País</th>
          <th scope="col">Compañía</th>
          <th scope="col">Fecha de publicación</th>
        </tr>
      </thead>
      <tbody>
        {
           elements.map((element, index) => {
            return <Row element={element} index={index} />
           })
        }
      </tbody>
    </table>
  )
}

export default TableComponent;
