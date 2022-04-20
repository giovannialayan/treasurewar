const mongoose = require('mongoose');

let ShopItemModel = {};

const ShopItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  img: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

ShopItemSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
});

ShopItemModel = mongoose.model('ShopItem', ShopItemSchema);
module.exports = ShopItemModel;