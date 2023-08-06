const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.splat()
  ),
  transports: [new winston.transports.Console()],
});

//check for environment and write log in files

module.exports = logger;
