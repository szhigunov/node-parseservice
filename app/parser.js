/**
 * Created by szh on 06.10.15.
 */
 var $ = require('cheerio');
 var Promise = require('bluebird');
 var request = Promise.promisifyAll(require("request"));
 request.debug = true;
/**
{
    model: Item,
    pattern: /http://tabletki.ua/A/(\d+)/instructions//,
    rootEl: '#ctl00_MAIN_ContentPlaceHolder_ContentPanel' || 'body'
}
**/
 var Parser = function(config) {
     function doRequest(url, onSuccessCb, onErrorCb){
        request.getAsync(url).then(onSuccess).error(onError);

        function onError(e){
         console.log(e.code, e.address +':'+ e.port);
         onErrorCb();
        }
        function onSuccess(res){
         console.log('got status: %s', res.statusCode);
         onSuccessCb();
        }
     }
     function onRequestGet(error, response, body) {
             console.log('GET response: ' + response.statusCode); // use logger
             if (!error && response.statusCode == 200) {
                 callback.apply(this, arguments); // call callback
             } else if (response.statusCode == 404) {
                 console.log(counter + ' skipping ,got 404'); // handle error
                 counter++;
                 iterate();
             } else {
                 lastData = false;
                 console.log(url);
             }
     }

     return {
         test: function (start, end) {
             var i = start;
             for(i; i <= end; i++){
                (function(i){
                    console.log('fetching', config.pattern.replace('%i',i));
                    doRequest(config.pattern.replace('%i',i), function(res, data){ (new Item({raw:data})).save(); return true; }, function () { console.log(i + ' failed');});
                })(i);
             }
            // doRequest('http://i.ua'); // ok
            // doRequest('http://localhost:5000'); // fail
         },
         run: function(){

         }
     }
 }

 module.exports = Parser;
