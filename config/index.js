const nconf = require('nconf');
const file = './config/config.json';

nconf.argv().env().file({ file });

module.exports = nconf;
