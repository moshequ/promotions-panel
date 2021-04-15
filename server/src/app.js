'use strict';

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

/**
 * Load environment variables from .env files
 */
require('dotenv-flow').config({
  path: './environments',
  default_node_env: 'development'
});

/**
 * Create Express server.
 */
const app = express();

/**
 * Enable Compression
 */
app.use(compression());

/**
 * Enable CORS
 */
app.use(cors());

/**
 * Express configuration.
 */
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 5000);
app.set('appName', 'Promotions Panel');

/**
 * Controllers (route handlers).
 */
const promotionsController = require('./controllers/promotions.controller');

/**
 * Routes
 */
app.get('/', (req, res) => res.send('App alive!'));
app.get('/promotions', promotionsController.list);
app.post('/promotions', promotionsController.create);
app.get('/promotions/reset', promotionsController.reset);
app.delete('/promotions', promotionsController.delete);
app.put('/promotions/:id', promotionsController.update);

/**
 * Default error handler.
 */
app.use(function (err, req, res, next) {
  console.error(err)
  res.status(500).send('Something broke!')
})

/**
 * Start Express server.
 */
const options = { useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true }

mongoose.connect(process.env.MONGODB_URI, options)
  .then(() => app.listen(app.get('port'), () => {
      console.log(`✓ App is running on port: ${app.get('port')} in ${process.env.NODE_ENV} mode`)
    })
  )
  .catch(error => console.error('App failed', error))
