import React from 'react';
import Col from './col';

const Row = ({element = {}, index = 0}) => {
  let allCountries = ''
  if (element && element.countries) {
    if (element.countries.length > 1 ) {
        allCountries = element.countries.map(e => e.name).join(",");
    }
    allCountries = element.countries[0] && element.countries[0].name
  }

  if (element) {
        return (
          <tr>
            <td className="number-row">{index + 1}</td>
            <td>{element.title}</td>
            <td>{allCountries || 'Sin País'}</td>
            <td>{element.company.name}</td>
            <td>{element.postedAt}</td>
          </tr>
        )
  }
}

export default Row;
