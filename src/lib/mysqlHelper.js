const logger = require('./logger');

module.exports.execStoredProcedure = function (spName, params) {
  try {
    var paramPlaceHolder = '';
    if (params && params.length) {
      for (var i = 0; i < params.length; i++) {
        paramPlaceHolder += '?,';
      }
    }
    if (paramPlaceHolder.length) {
      paramPlaceHolder = paramPlaceHolder.slice(0, -1);
    }
    logger.info('final SP call', `CALL ${spName}(${params})`);
    return pool.query(`CALL ${spName}(${paramPlaceHolder})`, params);
  } catch (ex) {
    logger.error('Error in executing stored procedure', ex);
    throw ex;
  }
};