var express = require('express');
var router = express.Router();
var parserService = require('../parserService');

/* GET names listing. */
var data = {
    title: 'Search'
};

router.get('/', function(req, res, next) {
    res.render('index', data);
});
router.get('/:name', function(req, res, next) {
    data.name = req.params.name;
    parserService.getNewNameSet(data.name, function (err, resdata) {
        if (err) {
            console.error(res);
        }
        data.result = resdata;

        res.json(data);
    });
});

module.exports = router;