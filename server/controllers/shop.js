const models = require('../models');

const { ShopItem } = models;

const shopPage = (req, res) => res.render('shop');

const makeShopItem = async (req, res) => {
  if (!req.body.name || !req.body.desc || !req.body.img || !req.body.price) {
    return res.status(400).json({ error: 'name, desc, img, and price are required' });
  }

  const itemData = {
    name: req.body.name,
    img: req.body.img,
    desc: req.body.desc,
    price: req.session.price,
  };

  try {
    const newItem = new ShopItem(itemData);
    await newItem.save();
    return res.status(201).json({
      name: newItem.name, img: newItem.img, desc: newItem.desc, price: newItem.price,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'item already exists' });
    }
    return res.status(400).json({ error: 'an error occurred' });
  }
};

const getShopItems = async (req, res) => {
  const items = await ShopItem.find();

  return res.json({ items });
};

module.exports = {
  shopPage,
  makeShopItem,
  getShopItems,
};
