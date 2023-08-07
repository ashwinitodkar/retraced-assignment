const logger = require('./logger');

module.exports.execStoredProcedure = function (spName, params) {
  try {
    let paramPlaceHolder = '';
    if (params && params.length) {
      for (let i = 0; i < params.length; i++) {
        paramPlaceHolder += '?,';
      }
    }
    if (paramPlaceHolder.length) {
      paramPlaceHolder = paramPlaceHolder.slice(0, -1);
    }
    logger.info(`Stored Procedure CALL ${spName}(${params})`);
    return pool.query(`CALL ${spName}(${paramPlaceHolder})`, params);
  } catch (error) {
    logger.error(`Error in calling Stored Procedure CALL ${spName}(${params})`);
    return Promise.reject(error);
  }
};
