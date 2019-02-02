import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'node-fetch';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

import Related from './../Related/index.jsx';
import BoxChoice from './../BoxChoice/index.jsx';

import './styles.scss';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const ONE_DAY_IN_MS = 86400000;
const TWO_DAY_IN_MS = ONE_DAY_IN_MS * 2;

const Article = (props) => {
  const { article, today, isExpanded } = props;
  const { description = '', content = '' } = article;
  const showContent = isExpanded &&
    (description && content && content.indexOf(description) < 0);
  const {
    author = '',
    source = {
      name: 'Google News'
    }
  } = article;
  const showAuthor = author && !author.startsWith('http') &&
    !author.startsWith('www') && author.indexOf('http') === -1;
  const authorStr = showAuthor ? author : source.name;
  const publishedAt = new Date(article.publishedAt);
  let publishedAtStr;

  if (publishedAt && publishedAt instanceof Date) {
    const publishedAtTime = publishedAt.getTime();
    if (today - publishedAtTime < ONE_DAY_IN_MS) {
      publishedAtStr = 'Today';
    } else if (today - publishedAtTime < TWO_DAY_IN_MS) {
      publishedAtStr = 'Yesterday';
    } else {
      let toHour = publishedAt.getHours();
      toHour = (toHour > 9) ? toHour : `0${toHour}`;
      let toMinutes = publishedAt.getMinutes();
      toMinutes = (toMinutes > 9) ? toMinutes : `0${toMinutes}`;

      publishedAtStr = `${toHour}:${toMinutes},
        ${MONTHS[publishedAt.getMonth()].substring(0, 3)}
        ${publishedAt.getDate()}
        ${publishedAt.getFullYear()}`;
    }
  }

  return (
    <div
      className={`article ms-Grid ${isExpanded ? 'expanded' : ''}`}
      dir="ltr"
    >
      <div className="article-container ms-Grid-row">
        {article.urlToImage && <div
          className="article-img ms-Grid-col ms-sm4 ms-lg3"
          style={{
            backgroundImage: `url(${article.urlToImage})`
          }}
        />}
        {!article.urlToImage && <Icon
          iconName="News"
          className="article-img empty ms-Grid-col ms-sm4 ms-lg3"
        />}
        <div className="article-content ms-Grid-col ms-sm8 ms-lg9">
          <a
            href={article.url}
            target="_blank"
            className="article-title ms-fontWeight-semilight">
            {article.title}
          </a>
          <div className="article-details ms-fontWeight-light">
            {authorStr} | {publishedAtStr}
          </div>
          <div className="article-desc ms-font-l ms-hiddenMdDown">
            {description}
            {showContent && <div className="article-desc-content">
              {content}
            </div>}
          </div>
        </div>
      </div>
      <div className="article-desc ms-font-m-plus ms-hiddenLgUp">
        {article.description}
        {isExpanded && <div className="article-desc-content">
          {article.content}
        </div>}
      </div>
      {!isExpanded && <div className="article-action article-more" onClick={props.handleExpand}>
        <BoxChoice
          icon="CirclePlus"
          title="More"
          dimension={2}
          backgroundColor="#fafafa"
          iconColor="#333333"
        />
      </div>}
      {(isExpanded && props.showRelated && article.related) &&
        <Related relatedArticles={article.related} />
      }
      {isExpanded && <div className="article-action article-collapse" onClick={props.handleCollapse}>
        <BoxChoice
          icon="CirclePlus"
          title="Collapse"
          dimension={2}
          backgroundColor="#fafafa"
          iconColor="#333333"
        />
      </div>}
      <hr />
    </div>
  );
};

Article.defaultProps = {
  className: '',
  article: {},
  today: null,
  isExpanded: false,
  showRelated: true
}

export default Article;
