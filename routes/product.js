const express = require('express');
const { verifyToken } = require('../middlewares/authentication');
const _ = require('underscore');
const Product = require('../models/product.model');
const Category = require('../models/category.model');

const updateOptions = { new: true, runValidators: true, context: 'query' };
const app = express();

app.get('/product', verifyToken, (req, res) => {
  const from = Number(req.query.from || 0);
  const limit = Number(req.query.limit || 5);

  Product.find({ available: true }).sort('name')
  .populate('user', 'name email').populate('category', 'description')
  .skip(from).limit(limit).exec((error, products) => {
    if (error) return res.status(500).json({ success: false, message: error.message });

    Product.countDocuments({ available: true }, (err, total) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, data: { total, products } });
    })
  });
});

app.get('/product/:id', verifyToken, (req, res) => {
  const id = req.params.id;

  Product.findById(id).populate('user', 'name email').populate('category', 'description')
  .exec((error, dbProduct) => {
    if (error) return res.status(500).json({ success: false, message: error.message });
    if (!dbProduct) return res.status(400).json({ success: false, message: `Product doesn't exist` });
    res.json({ success: true, data: dbProduct})
  })
});

app.post('/product', verifyToken, (req, res) => {
  const body = req.body;
  const product = new Product({
    name: body.name,
    retailPrice: body.retailPrice,
    description: body.description,
    available: body.available,
    category: body.category,
    user: req.user._id
  });

  product.save((error, dbProduct) => {
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.status(201).json({ success: true, message: 'Product created', data: dbProduct });
  });
});

app.put('/product/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['name', 'retailPrice', 'description', 'available', 'category']);

  if (!body.category) return res.status(500).json({ success: false, message: 'Missing category id'});

  Category.findById(body.category, (error, dbCategory) => {
    if (error) return res.status(500).json({ success: false, message: error.message });
    if (!dbCategory) return res.status(400).json({ success: false, message: `Category doesn't exist` });
    
    Product.findByIdAndUpdate(id, body, updateOptions, (error, dbProduct) => {
      if (error) return res.status(500).json({ success: false, message: error.message });
      if (!dbProduct) return res.status(400).json({ success: false, message: `Product doesn't exist` });
      res.json({ success: true, message: 'Product updated', data: dbProduct });
    });
  });
});

app.delete('/product/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const body = { available: false };

  Product.findByIdAndUpdate(id, body, updateOptions, (error, dbProduct) => {
    if (error) return res.status(500).json({ success: false, message: error.message });
    if (!dbProduct) return res.status(400).json({ success: false, message: `Product doesn't exist` });
    res.json({ success: true, message: 'Product updated' });
  });
});

module.exports = app;