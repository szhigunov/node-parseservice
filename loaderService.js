// # MAIN_ContentPlaceHolder_DATA_ContentPlaceHolder_DATA_ContentPlaceHolder_SmartInstruction_FullPanel
var $ = require('cheerio');
var request = require('request');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var Item = require('./model/Item');

var lastData = true;
var obj = {
		makeRequest: function(url, callback) {
			console.log('new request')
			request.get(url, function(error, response, body) {
					console.log('GET response: ' + response.statusCode);
					if (!error && response.statusCode == 200) {
						callback.apply(this, arguments);
					} else if (response.statusCode == 404) {
						console.log(counter + ' skipping ,got 404');
						counter++;
						iterate();
					} else {
						lastData = false;
						console.log(url);
					}
			})
	},
	storeData: function(data, type) {
		var newItem = new Item(data);
		newItem.save(function(err) {
			if (err) {
				console.log(data, err)
			} else {
				console.log('saved: ' + data.name)
				lastData = data;
				counter++;
				iterate();
			}
			// console.log('saved')
		})
	},
	processData: function(error, response, body) {
		var $body = $.load(body);

		$instruction = $body('#ctl00_MAIN_ContentPlaceHolder_ContentPanel');

		var data = {
			name: $body('title').text(),
			description: $instruction.text()
		}

		obj.storeData(data);

	}
};
var counter = 1;

function iterate() {
	// console.log(counter, !!lastData); return;
	obj.makeRequest('http://tabletki.ua/A/' + counter + '/instructions/', obj.processData)

}
console.log('start');
iterate();