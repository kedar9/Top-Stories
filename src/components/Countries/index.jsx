import React from 'react';
import ReactDOM from 'react-dom';
import RoundChoice from './../RoundChoice/index.jsx';

import './styles.scss';

const constants = require('./../../../constants.js');
const flags = require('./flags/index.js');

const Countries = (props) => {
  const { COUNTRIES: countries } = constants;
  const { selectedCategory } = props;

  return (
    <div className="countries">
      {Object.keys(countries).map((countryCode, index) => {
        const country = countries[countryCode];
        const isSelected = country === props.selected;
        let href = isSelected ? '#' : `/country/${countryCode}/`;
        if (selectedCategory) href = `${href}category/${selectedCategory}`;

        return (
          <a href={href} className="country" key={index}>
            <RoundChoice
              title={country}
              imageUrl={flags[countryCode]}
              className="country-choice"
            />
          </a>
        );
      })}
    </div>
  );
};

Countries.defaultProps = {
  selected: null,
  selectedCategory: null
}

export default Countries;
