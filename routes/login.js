const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user.model');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const app = express();

app.post('/login', (req, res) => {
  const body = req.body;

  User.findOne({email: body.email}, (error, dbUser) => {
    if (error) return res.status(500).json({ success: false, message: error.message });
    if (!dbUser) return res.status(400).json({ success: false, message: 'User/password invalid' });
    if (!bcrypt.compareSync(body.password, dbUser.password)) return res.status(400).json({ success: false, message: 'User/password invalid' });
    
    const token = jwt.sign({ user: dbUser }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_CADUCITY });    
    res.json({ success: true, data: dbUser, token });
  });
});


app.post('/google', async (req, res) => {
  const token = req.body.idtoken;
  const googleuser = await verify(token).catch(error => {
    return res.status(403).json({ success: false, message: error });
  });

  User.findOne({ email: googleuser.email }, (error, dbUser) => {
    if (error) return res.status(500).json({ success: false, message: error.message });
    if (dbUser) {
      if (!dbUser.google) {
        return res.status(400).json({ success: false, message: 'User must use normal authentication' });
      } else {
        const token = jwt.sign({ user: dbUser }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_CADUCITY });
        return res.json({ success: true, user: dbUser, token });
      }
    } else {
      const user = new User();
      user.name = googleuser.name;
      user.email = googleuser.email;
      user.image = googleuser.image;
      user.google = true;
      user.password = ':)';

      user.save((error, userCreated) => {
        if (error) return res.status(500).json({ success: false, message: error.message });
        const token = jwt.sign({ user: dbUser }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_CADUCITY });
        return res.json({ success: true, user: userCreated, token });
      });
    }
  });
});

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  }).catch(error => console.log(error));
  const payload = ticket.getPayload();
  return {
    name: payload.name,
    email: payload.email,
    image: payload.picture,
    google: true
  }
}

module.exports = app;
