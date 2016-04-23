const winston = require('winston');

const dblogger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'log/database.log' }),
  ],
});

module.exports = dblogger;
