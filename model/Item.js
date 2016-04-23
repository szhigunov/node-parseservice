/**
 * Created by szh on 06.10.15.
 */

const mongoose = require('../db/mongoose.js');

const ItemSchema = new mongoose.Schema({
  metadata: mongoose.Schema.Types.Mixed,
  title: 'String',
  fetchId: 'Number',
  uri: 'String',
  descriptionData: 'Mixed',
  description: 'String',
  raw: 'Buffer',
});

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
