// const config = require('./config');

// const util = require('./app/util');
const Parser = require('./parser');
const Item = require('./../../../../model/Item');

const config = {
  model: Item,
  dryRun: false, // do not save to db
  pattern: 'http://tabletki.ua/A/%i/',
  rootEl: '#ctl00_MAIN_ContentPlaceHolder_InstructionPanel' || 'body',
  parseRootFn: function (data) {
    // will return data object to store in db
    // we expect to have data as $data cheerio object
    const $data = data;
    const $table = $data.find('.table');
    const $td = $table.find('td');

    if($td.length === 0) return false;

    return {
      imagesrc: $data.find('img[itemprop="image"]').attr('src'),
      description: $data.find('div[itemprop="description"]').text().trim(),
      format: $td.eq(1).text().trim(),
      manufacturer: $td.eq(3).text().trim(),
      inn: $td.eq(5).text().trim(),
      pharmGroup: $td.eq(7).text().trim(),
      registration: $td.eq(9).text().trim(),
      atx: $td.eq(11).html(),
    }
  }
};
const parser = new Parser(config);
// TODO  make use microservices : LogService -> RequestService -> ParserService -> StorageService 
/*
* @param ParsingStrategy definition how we should fetch, process, and store data.
*/
// const ParsingStrategy = require('abstract-parser');
// parser.use(new ParsingStrategy(opts, success, failure));

/* @method parser.run just fetch an data using @param config provided to  @param parser
*/
// parser.run(100);
// parser.runRange(1000, 1050);
// parser.runUntil(21000);
parser.runUntil(1);

/*
* @method parser.runRange run parser.run for each data in provided range;
*/
// parser.runRange(1, 5);
