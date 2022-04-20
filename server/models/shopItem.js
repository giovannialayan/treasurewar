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
  name: doc.name,
  img: doc.img,
  desc: doc.desc,
  price: doc.price,
});

ShopItemSchema.statics.findByName = (name, callback) => {
  const search = {
    name: mongoose.Types.ObjectId(name),
  };

  return ShopItemSchema.find(search).select('name img desc price').lean().exec(callback);
};

ShopItemModel = mongoose.model('ShopItem', ShopItemSchema);
module.exports = ShopItemModel;
