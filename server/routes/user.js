const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user.model');
const app = express();

app.get('/user', (req, res) => {
  const from = Number(req.query.from || 0);
  const limit = Number(req.query.limit || 5);

  User.find({}).skip(from).limit(limit).exec((error, users) => {
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    User.count({}, (err, total) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

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
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    } 
    res.json({ success: true, message: 'User created', data: userDB });
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
    res.json({ success: true, message: 'User updated', data: userDB });
  });
});

app.delete('/user', (req, res) => {
  res.json('delete user');
});

module.exports = app;