const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const app = express();

app.post('/login', (req, res) => {
  const body = req.body;

  User.findOne({email: body.email}, (error, dbUser) => {
    if (error) return res.status(500).json({ success: false, message: error.message });
    if (!dbUser) return res.status(400).json({ success: false, message: 'User/password invalid' });
    if (!bcrypt.compareSync(body.password, dbUser.password)) return res.status(400).json({ success: false, message: 'User/password invalid' });
    
    const token = jwt.sign({ user: dbUser }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_CADUCITY });    
    res.json({ succes: true, data: dbUser, token });
  });
});

module.exports = app;
