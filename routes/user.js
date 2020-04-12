const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user.model');
const { verifyToken } = require('../middlewares/authentication');
const { verifyRole } = require('../middlewares/role');
const app = express();

const updateOptions = { new: true, runValidators: true, context: 'query' };

app.get('/user', verifyToken, (req, res) => {
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

app.post('/user', [verifyToken, verifyRole], (req, res) => {
  const body = req.body;
  const user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  user.save((error, dbUser) => {
    if (error) return res.status(500).json({ success: false, message: error.message });
    if (!dbUser) return res.status(400).json({ success: false, message: error.message });
    res.status(201).json({ success: true, message: 'User created', data: dbUser });
  });
});

app.put('/user/:id', [verifyToken, verifyRole], (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['name', 'email', 'image', 'role', 'state']);

  User.findByIdAndUpdate(id, body, updateOptions, (error, dbUser) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    if (!dbUser) return res.status(400).json({ success: false, message: `User with id ${id} doesn't exist` });
    res.json({ success: true, message: 'User updated', data: dbUser });
  });
});

app.delete('/user/:id', [verifyToken, verifyRole], (req, res) => {
  const id = req.params.id;
  const updateField = { state: false };

  User.findByIdAndUpdate(id, updateField, updateOptions, (error, userDeleted) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    if (!userDeleted.state) return res.status(400).json({ success: false, message: `User with id ${id} doesn't exist` });
    res.json({ success: true, message: 'User deleted'});
  });
});

module.exports = app;