// const config = require('./config');

const util = require('./app/util');
const Parser = require('./app/parser');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var Item = require('./model/Item');

var config = {
    model: Item,
    pattern: 'http://tabletki.ua/A/%i/instructions/',
    rootEl: '#ctl00_MAIN_ContentPlaceHolder_ContentPanel' || 'body'
};
var parser = new Parser(config);

parser.run(1, 100);
parser.test(1,5);
