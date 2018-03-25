'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var spendInfo = new Schema({
  userID: String,
  category: String,
  amount: String
});

module.exports = mongoose.model('spendInfo',spendInfo)