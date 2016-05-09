const express = require('express');
const log = require('../../../log/api.js')(module);
const router = express.Router();

const ArticleModel = require('../../../model/Item.js');

router.route('/articles/:id?')
.all((req, res, next) => {
  log.info('Time: ', Date.now());
  next();
})
.get((req, res, next) => {
  if (req.params.id) {
    ArticleModel.findOne({
      fetchId: +req.params.id + 1,
    }, (err, data) => err ? next(err) : res.send(data.title));
  } else {
    ArticleModel.findOne((err, data) => err ? next(err) : res.send(data));
  }
});

module.exports = router;
