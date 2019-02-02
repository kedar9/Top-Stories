import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

import './styles.scss';

const BoxChoice = (props) => {
  const { dimension, title } = props;
  const iconStyle = {
    width: `${dimension}rem`,
    height: `${dimension}rem`,
    fontSize: `${dimension * 0.75}rem`,
    padding: `${(dimension * 0.25) / 2}rem`,
    backgroundColor: props.backgroundColor,
    color: props.iconColor
  };
  const titleStyle = {
    color: props.titleColor,
    marginLeft: `${dimension * 1.5}rem`,
  };

  return (
    <div className={`box-choice ${props.className}`}>
      <div className="box-choice-icon" style={iconStyle}>
        <Icon iconName={props.icon} />
      </div>
      {title && <div className="box-choice-title" style={titleStyle}>
        {title}
      </div>}
    </div>
  );
};

BoxChoice.defaultProps = {
  className: '',
  dimension: 2.5,
  backgroundColor: '#787878',
  iconColor: '#f4f4f2',
  title: null,
  titleColor: '#333333'
}

export default BoxChoice;
