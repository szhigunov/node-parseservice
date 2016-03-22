/**
 * Created by szh on 06.10.15.
 */

var mongoose = require('mongoose');

var Item = mongoose.model('Item', {
    name: String,
    description: String,
    raw: String
});
module.exports = Item;
