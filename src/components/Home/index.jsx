import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import fetch from 'node-fetch';

import Header from './../Header/index.jsx';
import SideBar from './../SideBar/index.jsx';
import Article from './../Article/index.jsx';
import Popular from './../Popular/index.jsx';
import LoadingShimmer from './../LoadingShimmer/index.jsx';
import BoxChoice from './../BoxChoice/index.jsx';

import './styles.scss';

const constants = require('./../../../constants.js');

function Home() {
  const [data, setData] = useState({
    articles: [],
    country: null,
    category: null
  });
  const [expandedArticle, setExpandedArticle] = useState(-1);
  const [showRelated, setShowRelated] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const today = new Date();

  useEffect(() => {
    fetch(`/get/articles${window.location.pathname}`).then(res => {
      if (res.status === 200) {
        return res.json();
      }
      return {
        ...data,
        articles: null
      }
    }).then(res => {
      setData(res);
      setExpandedArticle(0);
      if (res.q) {
        setShowRelated(false);
        setSearchQ(res.q.replace(/-/g, ' '));
      } else {
        setSearchQ('');
      }
    });
  }, []);

  const updatePage = (url) => {
    setArticles([]);
    setArticlesUrl(url);
    window.history.pushState({}, 'Top Stories', url);
  }

  return (
    <div className="top-stories ms-Fabric">
      {/* <Header /> */}
      <SideBar
        selectedCountry={data.country}
        selectedCategory={data.category}
        searchQ={searchQ} />
      <div className="top-stories-content ms-Grid">
        {(data.articles && data.articles.length > 0) &&
            <div className="ms-Grid-row">
              <div className="articles ms-Grid-col ms-md12 ms-xl9">
                {data.articles.map((article, index) => (
                  <Article
                    article={article}
                    today={today.getTime()}
                    key={index}
                    isExpanded={expandedArticle === index}
                    showRelated={showRelated}
                    handleExpand={() => setExpandedArticle(index)}
                    handleCollapse={() => setExpandedArticle(-1)}
                  />
                ))}
              </div>
              <Popular className="ms-Grid-col ms-md12 ms-xl3" searchQ={searchQ} />
            </div>
        }
        {(data.articles && data.articles.length <= 0) &&
          <div className="articles empty">
            <LoadingShimmer />
            <hr />
            <LoadingShimmer />
            <hr />
            <LoadingShimmer />
            <hr />
            <LoadingShimmer />
          </div>
        }
        {!data.articles &&
          <div className="articles error">
            <BoxChoice
              icon="Error"
              title="Data Not Received"
              dimension={3}
              backgroundColor="#fafafa"
              iconColor="#c00000"
              titleColor="#c00000"
            />
            <p>
              There was an error receiving data. <br/>
              This is a personal project that relies on a free-tier API service. <br />
              The error is most likely caused because the number of requests have
              exceeded the allowed limit. <br />
              If you continue seeing this issue, please try back tomorrow. <br />
              Sorry for the inconvinience.
            </p>
          </div>
        }
        {(data.articles && data.articles.length > 0) &&
          <a href= "https://kedar.dev" target="_blank" className="made-by">
            <BoxChoice
            icon="Code"
            title="Made by Kedar."
            backgroundColor="#c00000"
          />
        </a>}
      </div>
    </div>
  );
}

export default Home;
