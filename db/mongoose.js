const mongoose = require('mongoose');
const config = require('../config');
const log = require('../log/db.js');

const { uri } = config.get('mongoose');
const db = mongoose.connection;

db.on('error', (err) => {
  const { message } = err;
  log.error(`connection error: ${message}`);
});

db.once(`open`, () => {
  log.info(`connected to database!`);
});

log.info(`connecting to ${uri}`);
mongoose.connect(uri);

module.exports = mongoose;
