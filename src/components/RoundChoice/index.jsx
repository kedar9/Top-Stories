import React from 'react';
import ReactDOM from 'react-dom';

import './styles.scss';

const RoundChoice = (props) => {
  const { dimension, isSelected } = props;
  const classNames = `${props.className} ${isSelected ? 'selected' : ''}`;

  const imgStyle = {
    width: `${dimension}rem`,
    height: `${dimension}rem`,
    backgroundImage: `url(${props.imageUrl})`
  };

  return (
    <div className={`round-choice ${classNames}`}>
      <div className="round-choice-img" style={imgStyle} />
      {props.title && <div className="round-choice-title">
        {props.title}
      </div>}
    </div>
  );
};

RoundChoice.defaultProps = {
  className: '',
  dimension: 3,
  isSelected: false
}

export default RoundChoice;
