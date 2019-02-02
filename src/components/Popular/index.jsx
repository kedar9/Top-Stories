import React from 'react';
import ReactDOM from 'react-dom';

import BoxChoice from './../BoxChoice/index.jsx';
import RoundChoice from './../RoundChoice/index.jsx';
import PopularTopics from './constants.js';

import './styles.scss';

const Popular = (props) => {
  return (
    <div className={`popular ${props.className}`}>
      <BoxChoice
        icon="Trending12"
        title="Popular Topics"
        backgroundColor="#c00000"
        className="popular-heading"
      />
      <div className="popular-topics">
        {PopularTopics.map((topic, index) => {
          const { title, image } = topic;
          const titleLower = title.toLowerCase();
          const isSelected = titleLower === props.searchQ;
          const href = isSelected ? '#' : `/search/${titleLower.replace(/ /g, '-')}/`;

          return (
            <a href={href} className="topic" key={index}>
              <RoundChoice
                title={title}
                imageUrl={image}
                dimension="3.5"
                className="topic-choice"
                isSelected={isSelected}
              />
            </a>
          );
        })}
      </div>
      <hr className="ms-hiddenXlUp" />
    </div>
  );
};

Popular.defaultProps = {
  searchQ: '',
  className: '',
}

export default Popular;
