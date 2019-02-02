// Node packages
const express = require('express'),
  expressip = require('express-ip'),
  sslRedirect = require('heroku-ssl-redirect');

const app = express(),
  path = require('path'),
  port = process.env.PORT || 3000,
  nodeEnv = app.get('env'),
  DIST_DIR = path.join(__dirname, '..', 'dist'),
  STATIC = path.join(DIST_DIR, 'static'),
  HTML_FILE = path.join(DIST_DIR, 'index.html');

const utils = require('./utils.js'),
  constants = require('./../constants.js');

const pageRoutes = [
  '/country/:country/category/:category',
  '/country/:country',
  '/category/:category',
  '/search/:q',
  '/'
];

const getArticlesRoutes = [
  '/get/articles/country/:country/category/:category',
  '/get/articles/country/:country',
  '/get/articles/category/:category',
  '/get/articles',
];


// Expose static content from /dist/ on path /static/
// Refer `output` to webpack.config.js
app.use('/static', express.static(STATIC));
app.use(express.json());
app.use(sslRedirect());

app.use('/favicon.ico', express.static(`${DIST_DIR}/favicon.ico`));
app.use('/get/articles', expressip().getIpInfoMiddleware);

// Handle 404 and 500
app.use((err, req, res, next) => {
  res.status(404).send('404: Page not Found');
  res.status(500).send('500: Internal Server Error');
});

app.get('/get/articles/search/:q', (req, res) => {
  const { q } = req.params;
  if (q) {
    return utils.search(req.params.q).then(response => {
      res.send(response);
    });
  }
  res.status(404).send('404: Page not Found');
});

app.get(getArticlesRoutes, (req, res) => {
  let { country } = req.params;
  const { category = constants.GENERAL_CATEGORY } = req.params;

  if (category && !constants.CATEGORIES[category]) {
    return new Promise(function(resolve, reject) {
       reject('404: Resource not Found');
    });
  }
  if (country && !constants.COUNTRIES[country]) {
    return new Promise(function(resolve, reject) {
       reject('404: Resource not Found');
    });
  }

  // If no country specified in the req
  if (!country) {
    if (app.get('env') === 'development') {
      country = constants.DEFAULT_COUNTRY;
    } else if (req.ipInfo && req.ipInfo.error) {
      return new Promise(function(resolve, reject) {
         reject('404: Resource not Found');
      });
    } else {
      let { country: ipCountry } = req.ipInfo;
      country = ipCountry.toLowerCase();
      console.log('ipCountry: ', ipCountry);
      // If no country was returned from a valid ipInfo response OR
      // a country was returned from ipInfo, but it is not one of
      // the supported countries, set country to default.
      if (!ipCountry || !constants.COUNTRIES[country]) {
        country = constants.DEFAULT_COUNTRY;
      }
      console.log('req.ipInfo country from ipInfo: ', req.ipInfo);
    }
  }

  return utils.initNews(country, category).then(response => {
    res.send(response);
  });
});

app.get(pageRoutes, (req, res) => {
  let { country, category } = req.params;
  if (country && !constants.COUNTRIES[country]) {
    console.log('country error 0');
    res.status(404).send('404: Page not Found');
  }
  if (category && !constants.CATEGORIES[category]) {
    console.log('category error 0');
    res.status(404).send('404: Page not Found');
  }
  res.sendFile(HTML_FILE);
});

app.listen(port, function () {
  console.log('App listening on port: ' + port);
});
