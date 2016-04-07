/**
* Created by szh on 06.10.15.
*/
// const $ = require('cheerio');
const Promise = require('bluebird');
const winston = require('winston');
const request = Promise.promisifyAll(require('request'));
const cheerio = require('cheerio');
const async = require('async');
// request.debug = true;
winston.add(winston.transports.File, { filename: 'logfile.log' })
.remove(winston.transports.Console);
winston.level = 'debug';
/**
{
    model: Item,
    pattern: /http://tabletki.ua/A/(\d+)/instructions//,
    rootEl: '#ctl00_MAIN_ContentPlaceHolder_ContentPanel' || 'body'
}
**/

class Parser {

  constructor(config) {
    this.config = config;
  }
  getUrl(x) {
    return this.config.pattern.replace('%i', x);
  }
  storeResponse(res, Model) {
    const { headers, request: { uri, method, headers: requestHeaders } } = res;
    const metadata = { headers, request: { uri, method, requestHeaders } };
    const title = cheerio.load(res.body)('title').text().trim();
    const newItem = new Model({ raw: res.body, metadata, title });

    if (!this.config.dryRun) {
      newItem.save((err) => {
        if (err) {
          winston.log('debug', 'Error when saving', err);
        } else {
          winston.log('debug', 'Saved successfully', title);
        }
      });
    }
  }
  run(x) {
    winston.log('fetching', this.config.pattern.replace('%i', x));
    const url = this.getUrl(x);
    const onError = (err) => {
      winston.log(err.toString());
      winston.log(`${x} failed`);
    };

    this.doRequest(url, (res) => {
      this.storeResponse(res, this.config.model);
    }, onError);
  }
  runUntil(start) {
    let i = start;
    let failureCount = 0;
    async.doWhilst((callback) => {
      const url = this.getUrl(i);

      request.getAsync(url).then((res) => {
        i++;
        if (res.statusCode === 200) {
          const title = cheerio.load(res.body)('title').text().trim();
          winston.log('debug', `${i} : got 200: ${title}`);
          this.storeResponse(res, this.config.model);
          failureCount = 0; // Reset failure count, because of 200
        } else { // 404 & 500 & etc.
          winston.log('debug', 'Failure at ${i}');
          failureCount++; // Iterate failure, when 10 repating failures. exit
        }
        callback(null, i);
      });
    }, () => failureCount < 10, (err, n) => winston.log('debug', 'total:', n));
  }
  runRange(start, end) {
    let i = start;

    for (i; i <= end; i++) {
      (this.run)(i);
    }
  }

  doRequest(url, onSuccessCb, onErrorCb) {
    function onError(e) {
      console.log(e.code, `${e.address} : ${e.port}`);
      onErrorCb();
    }

    function onSuccess(res) {
      console.log('${x} | got status: %s', res.statusCode);
      onSuccessCb(res);
    }

    request.getAsync(url).then(onSuccess).error(onError);
  }
}

module.exports = Parser;
