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
winston.add(winston.transports.File, { filename: 'logfile.log' });
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
  storeResponse(res, Model, id) {
    const { headers, request: { uri, method, headers: requestHeaders } } = res;
    const metadata = { headers, request: { uri, method, requestHeaders } };
    const $body = cheerio.load(res.body);
    const title = $body('title').text().trim().split('|')[0];
    const descriptionData = this.config.parseRootFn($body(this.config.rootEl));
    const {description} = descriptionData;
    const newItem = new Model({ metadata, fetchId: id, title, descriptionData, description });

    if (!this.config.dryRun) {
      newItem.save((err) => {
        if (err) {
          winston.info('Error when saving', err);
        } else {
          winston.info('Saved successfully', title);
        }
      });
    }else {
      winston.log('debug', 'dryRun is ON!', title)
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
      this.storeResponse(res, this.config.model, x);
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

          this.storeResponse(res, this.config.model, i);

          failureCount = 0; // Reset failure count, because of 200
        } else { // 404 & 500 & etc.
          winston.log('debug', 'Failure at ${i}, status code: ${res.statusCode}');
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
      winston.info(e.code, `${e.address} : ${e.port}`);
      onErrorCb();
    }

    function onSuccess(res) {
      winston.info(`Request success, got status: ${res.statusCode}`);
      if(res.statusCode === 200) {
        onSuccessCb(res);
      }
    }

    request.getAsync({url}).then(onSuccess).error(onError);
  }
}

module.exports = Parser;
