const express = require('express');
const { verifyToken } = require('../middlewares/authentication');
const { verifyRole } = require('../middlewares/role');
const Category = require('../models/category.model');

const app = express();

app.get('/category', verifyToken, (req, res) => {
  const from = Number(req.query.from || 0);
  const limit = Number(req.query.limit || 5);

  Category.find().skip(from).limit(limit).exec((error, categories) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    Category.countDocuments({}, (err, total) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      res.json({ success: true, data: { total, categories } });
    })
  });
});

app.get('/category/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(500).json({ success: false, message: 'Missing category id'});
  Category.findById(id, (error, dbCategory) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    if (!dbCategory) return res.status(400).json({ success: false, message: `Category doesn't exist`})
    res.json({ success: true, data: dbCategory });
  });
});

app.post('/category', [verifyToken, verifyRole], (req, res) => {
  const body = req.body;
  const category = new Category({
    description: body.description,
    user: req.user._id
  });
  
  category.save((error, dbCategory) => {
    if (error) return res.status(500).json({ success: false, message: error.message });
    if (!dbCategory) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: 'Category created', data: dbCategory });
  });
});

app.put('/category/:id', [verifyToken, verifyRole], (req, res) => {

});

app.delete('/category/:id', [verifyToken, verifyRole], (req, res) => {

});

module.exports = app;