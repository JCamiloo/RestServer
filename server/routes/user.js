const express = require('express');
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
    password: body.password,
    role: body.role
  });

  user.save((error, userDB) => {
    if (error) {
      return res.status(400).json({ success: false, message: error});
    } else {
      res.json({ success: true, message: userDB});
    }
  });
});

app.put('/user/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id });
});

app.delete('/user', (req, res) => {
  res.json('delete user');
});

module.exports = app;