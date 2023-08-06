module.exports = {
  environmentName: process.env.NODE_ENV,
  cors: {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
  },
  appPort: process.env.APP_PORT,
  protocol: 'http://',
  domain: 'localhost',
  logs: {
    logFolder: './logs/', //`/logs/${os.hostname()}`
  },
  swaggerDefinition: {
    info: {
      title: 'Retraced assignment',
      version: '1.0.0',
      description: 'Retraced assignment Endpoint',
    },
    host: process.env.SWAGGER_HOST,
    basePath: '/',
    schemes: ['http'],
  },
  mysqlConfig: {
    timeout: 60 * 60 * 1000,
    connectionLimit: 50,
    connectTimeout: 60 * 60 * 1000,
    aquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    multipleStatements: true,
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    port: process.env.MYSQL_DB_PORT,
  },
};
