const models = require('../models');

const { ShopItem } = models;

// render shop page
const shopPage = (req, res) => res.render('shop');

// create a new shop item
const makeShopItem = async (req, res) => {
  if (!req.body.name || (!req.body.desc && req.body.desc !== '') || !req.body.img || !req.body.type
    || (!req.body.price && req.body.price !== 0) || !req.body.password) {
    return res.status(400).json({ error: 'name, desc, img, price, type, and password are required' });
  }

  if (req.body.password !== process.env.SHOP_PASSWORD) {
    return res.status(400).json({ error: 'wrong password' });
  }

  const itemData = {
    name: req.body.name,
    img: req.body.img,
    desc: req.body.desc,
    price: req.body.price,
    type: req.body.type,
  };

  try {
    const newItem = new ShopItem(itemData);
    await newItem.save();
    return res.status(201).json({
      name: newItem.name,
      img: newItem.img,
      desc: newItem.desc,
      price: newItem.price,
      type: newItem.type,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'item already exists' });
    }
    return res.status(400).json({ error: 'an error occurred' });
  }
};

// get all shop items
const getShopItems = async (req, res) => {
  const items = await ShopItem.find();
  const skins = [];
  const chromas = [];
  items.forEach((item) => {
    if (item.type === 'skin') {
      skins.push(item);
    } else if (item.type === 'chroma') {
      chromas.push(item);
    }
  });

  return res.json({ skins, chromas });
};

module.exports = {
  shopPage,
  makeShopItem,
  getShopItems,
};
