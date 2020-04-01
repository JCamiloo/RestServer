const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user.model');
const app = express();
const updateOptions = { new: true, runValidators: true, context: 'query' };

app.get('/user', (req, res) => {
  const from = Number(req.query.from || 0);
  const limit = Number(req.query.limit || 5);

  User.find({ state: true }).skip(from).limit(limit).exec((error, users) => {
    if (error) return res.status(400).json({ success: false, message: error.message });

    User.countDocuments({ state: true }, (err, total) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      res.json({ success: true, data: { total, users } });
    });
  });
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
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: 'User created', data: userDB });
  });
});

app.put('/user/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['name', 'email', 'image', 'role', 'state']);

  User.findByIdAndUpdate(id, body, updateOptions, (error, userDB) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    if (!userDB) return res.status(400).json({ success: false, message: `User with id ${id} doesn't exist` });
    res.json({ success: true, message: 'User updated', data: userDB });
  });
});

app.delete('/user/:id', (req, res) => {
  const id = req.params.id;
  const updateField = { state: false };

  User.findByIdAndUpdate(id, updateField, updateOptions, (error, userDeleted) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    if (!userDeleted.state) return res.status(400).json({ success: false, message: `User with id ${id} doesn't exist` });
    res.json({ success: true, message: 'User deleted', data: userDeleted });
  });
});

module.exports = app;