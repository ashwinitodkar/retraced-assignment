/* jshint node: true */
/* jshint esnext: true */
'use strict';
const logger = require('./src/lib/logger'),
  bodyParser = require('body-parser'),
  swaggerJSDoc = require('swagger-jsdoc'),
  swaggerUi = require('swagger-ui-express'),
  httpProtocol = require('http'),
  app = require('express')();

/**
 * Globally define the application config variables
 **/
global.config = require('./src/config/');

//globally set the express-joi variable
global.expressJoi = require('./src/helpers/joiValidation');

/** Create the directory for writing the logs

let logFolder = global.config.logs.logFolder;

if (!fs.existsSync(logFolder)) {
  try {
    fs.mkdirSync(logFolder);
  } catch (e) {
    throw new Error(
      `Error creating log folder ${logFolder} - ${JSON.stringify(e)}`
    );
  }
}
 **/

//make connection to mysql
global.pool = require('./src/lib/mysql');

pool.getConnection((err, connection) => {
  if (err) logger.error('mysql db connection error', err);
  else logger.info('mysql connection established');
});

/**
 * Initialize post data parsing.
 **/
app.use(bodyParser.json());

/**
 * Initialize the router.
 **/
app.use('/api', require('./lib/controllers/'));

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: global.config.swaggerDefinition,
  // path to the API docs
  apis: ['./src/controllers/category/*.js'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

//swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Default handler for invalid API endpoint.
 **/
app.all('*', (req, res) => {
  res.status(global.config.default_error_http_code).json({
    responseCode: global.config.default_error_http_code,
    responseDesc: global.config.default_error_message,
  });
});

/**
 * Default handler for uncaught exception error.
 **/
app.use((err, req, res, next) => {
  logger.error(
    `UncaughtException is encountered 
      Error= ${err},
      Stacktrace= ${err.stack}`
  );
  let response = {
    responseCode: err.errorCode || global.config.default_error_http_code,
    responseDesc: err.errorMsg || global.config.service_down_message,
  };
  res
    .status(err.errorCode || global.config.default_error_http_code)
    .json(response);
});

/**
 * To start express server.
 **/
let httpServer = httpProtocol.createServer(app);

/**
 * Server start port.
 **/
httpServer.listen(global.config.appPort, () => {
  logger.debug(
    `Server started on ${
      global.config.environmentName.charAt(0).toUpperCase() +
      global.config.environmentName.slice(1)
    } server started at port ${global.config.appPort}`
  );
});

module.exports = httpServer;
