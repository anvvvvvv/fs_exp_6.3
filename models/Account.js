// models/Account.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  ownerName: { type: String, required: true },
  balance: { type: Number, required: true, min: 0 },
});

module.exports = mongoose.model('Account', accountSchema);
