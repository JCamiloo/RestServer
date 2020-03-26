const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user.model');
const app = express();

app.get('/user', (req, res) => {
  res.json('get user');
});

app.post('/user', (req, res) => {
  const body = req.body;
  const user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  user.save((error, userDB) => {
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    } 
    res.json({ success: true, message: userDB});
  });
});

app.put('/user/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['name', 'email', 'image', 'role', 'state']);
  const updateOptions = { new: true, runValidators: true, context: 'query' };

  User.findByIdAndUpdate(id, body, updateOptions, (error, userDB) => {
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.json({ success: true, message: userDB});
  });
});

app.delete('/user', (req, res) => {
  res.json('delete user');
});

module.exports = app;