const util = require('util'),
  mysql = require('mysql'),
  logger = require('./logger'),
  pool = mysql.createPool(global.config.mysqlConfig);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      logger.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      logger.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      logger.error('Database connection was refused.', err);
    }
  }

  if (connection) {
    connection.release();
  }

  return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;
