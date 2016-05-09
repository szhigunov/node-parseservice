const path = require('path');
const app = require('./server.js');
// const init = require('./init.js');
const log = require(path.join(process.cwd(), 'log/api.js'))(module);
const util = require(path.join(process.cwd(), 'util'));
const config = require(path.join(process.cwd(), 'config'));

const oauth2 = require('../auth/oauth2.js');

const api = require('./routes/api.js');
const articles = require('./routes/articles.js');
const users = require('./routes/users.js');

const APIPORT = config.get('apiport');
const APIHOST = config.get('apiuri');
const OAUTH = config.get('oauthuri')

app.use('/', api);
app.use(APIHOST, [api, users, articles]);
app.use(OAUTH, oauth2.token);

// Start server
app.listen(APIPORT, () => {
  log.info('Express server listening on port %d', APIPORT);
});

// // 404 | Not found handling
app.use((req, res, next) => {
  res.status(404).send({ message: 'Not Found' });
  log.debug('Not found URL: %s', req.url);
  next();
});

// // 505 | Internal errors handling
app.use((err, req, res, next) => {
  const jsonError = util.getJSONError(err);
  const status = res.statusCode || 500;
  res.status(status).send(jsonError);
  log.error('Internal error(%d): %s', status, err.stack);
  return;
});

