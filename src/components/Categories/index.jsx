import React from 'react';
import ReactDOM from 'react-dom';
const constants = require('./../../../constants.js');

import BoxChoice from './../BoxChoice/index.jsx';

import './styles.scss';


const Categories = (props) => {
  const { CATEGORIES: categories } = constants;
  const { selectedCountry } = props;

  return (
    <div className="categories">
      {Object.keys(categories).map((category, index) => {
        const isSelected = category === props.selected;
        const href = `/country/${selectedCountry}/category/${category}/`;
        if (isSelected) {
          return (
            <a href={href} className="category selected" key={index}>
              <BoxChoice
                icon={categories[category].icon}
                title={category}
                backgroundColor="#c00000"
                titleColor="#c00000"
              />
            </a>
          );
        }

        return (
          <a href={href} className="category" key={index}>
            <BoxChoice
              icon={categories[category].icon}
              title={category}
              backgroundColor="#999999"
            />
          </a>
        );
      })}
    </div>
  );
};

Categories.defaultProps = {
  selected: null,
  selectedCountry: null
}

export default Categories;
