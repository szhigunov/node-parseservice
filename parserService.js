var get = require('http').get;
var $ = require('cheerio');
module.exports.getData = getData = function(data){
    var $data = $.load(data);
    var $tr = $data('tr[code]')
    var resultDataSet = {};

    resultDataSet.total = $tr.length;
    resultDataSet.items = [];

    $tr.each(function(i,el){
        $el = $(this)
        $children = $(this).children().last();
        resultDataSet.items[i] = {
            code: $(this).attr('code'),
            name: $children.text().match(/[^\r\n]+/)[0].trim(),
            producer: $children.children().text().trim()
        }
    });
    return resultDataSet

}

module.exports.getNewNameSet = getNewNameSet = function (name, callback) {
    var url = 'http://tabletki.ua/SampleResponse/GetListGoodsForProducer.aspx';
    var time = new Date();
    get(url + '?type=cabinet&q=' + encodeName(name), function (res) {
        var str = '';
        console.log("Got response: " + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            str += chunk;
        });
        res.on('end', function () {
            console.log(new Date() - time )
            callback(null, getData(str));

        })
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });
}
module.exports.encodeName = encodeName = function (name) {
    var length = name.length, newname = '';
    for (var i = 0; i < length; i++) {
        newname += escape(name[i])
    }
    return newname;
};
module.exports.decodeName = decodeName = function (name) {
    return unescape(name)
};

//console.log(encodeName('Лаз'),decodeName('%u041B%u0430%u0437'));
//getNewNameSet('Лазолван', function(){console.log(arguments)});
//TODO write test