const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyTokenFromURL } = require('../middlewares/authentication');

const app = express();

app.get('/image/:type/:image', verifyTokenFromURL, (req, res) => {
  const type = req.params.type;
  const image = req.params.image;
  const imagePath = path.resolve(__dirname, `../uploads/${type}/${image}`);
  const noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.sendFile(noImagePath);
  }

});

module.exports = app;