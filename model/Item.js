/**
 * Created by szh on 06.10.15.
 */

const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  metadata: mongoose.Schema.Types.Mixed,
  title: 'String',
  uri: 'String',
  // description: 'String',
  raw: 'Buffer',
});

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
