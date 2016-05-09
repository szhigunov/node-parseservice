const express = require('express');
const log = require('../../../log/api.js')(module);
const router = express.Router();

router.use((req, res, next) => {
  log.info('requestTime: ', Date.now());
  next();
});

router.route('/error').all((req, res, next) => {
  next(new Error('Random error!'));
});

router.route('/debug').all((req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.write('you posted:\n');
  res.end(JSON.stringify(req.headers, null, 2));
});

router.route('/').all((req, res) => {
  res.send('API is running, for api use /api/:resourcename');
})

module.exports = router;
