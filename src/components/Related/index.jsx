import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'node-fetch';

import BoxChoice from './../BoxChoice/index.jsx';
import './styles.scss';

const Related = (props) => {
  const { relatedArticles } = props;
  if (relatedArticles.length < 1) {
    return null;
  }

  return (
    <div
      className="related ms-Grid"
      dir="ltr"
    >
      <div className="ms-Grid-row ms-font-l ms-fontWeight-light">
        <BoxChoice
          icon="TaskGroup"
          title="Related Articles:"
          dimension={2.5}
          backgroundColor="#333333"
          iconColor="#f4f4f2"
        />
      </div>
      <div className="ms-Grid-row">
        {relatedArticles.map((article, index) => (
          <div className="related-article ms-Grid-col ms-sm12 ms-lg6" key={index}>
            <div className="related-article-container ms-Grid-row">
              <div
                className="related-article-img ms-Grid-col ms-sm4 ms-lg3"
                style={{
                  backgroundImage: `url(${article.urlToImage})`
                }}
              />
              <div className="related-article-content ms-Grid-col ms-sm8 ms-lg9">
                <a
                  href={article.url}
                  target="_blank"
                  className="related-article-title ms-fontSize-mPlus">
                  {article.title}
                </a>
                <div className="related-article-details ms-fontWeight-light">
                  {article.source ? article.source.name || '' : ''}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Related.defaultProps = {
  relatedArticles: null
}

export default Related;
