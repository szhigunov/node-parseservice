// const config = require('./config');

// const util = require('./app/util');
const Parser = require('./app/parser');

const mongoose = require('mongoose');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`we're connected!`);
});

mongoose.connect('mongodb://localhost/testdebug');

const Item = require('./model/Item');

const config = {
  model: Item,
  dryRun: false, // do not save to db
  pattern: 'http://tabletki.ua/A/%i/instructions/',
  rootEl: '#ctl00_MAIN_ContentPlaceHolder_ContentPanel' || 'body'
};
const parser = new Parser(config);

/*
* @param ParsingStrategy definition how we should fetch, process, and store data.
*/
// const ParsingStrategy = require('abstract-parser');
// parser.use(new ParsingStrategy(opts, success, failure));

/* @method parser.run just fetch an data using @param config provided to  @param parser
*/
// parser.run(100);
// parser.runRange(1000, 1050);
parser.runUntil(1);

/*
* @method parser.runRange run parser.run for each data in provided range;
*/
// parser.runRange(1, 5);
