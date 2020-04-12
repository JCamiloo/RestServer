const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const User = require('../models/user.model');
const Product = require('../models/product.model');

const app = express();

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', (req, res) => {
  const type = req.params.type;
  const id = req.params.id;
  const types = ['user', 'product'];

  if (types.indexOf(type) < 0) return res.status(500).json({ success: false, message: 'Type not allowed' });
  if (!req.files) return res.status(400).json({ success: false, message: 'No files were uploaded' });

  const file = req.files.file;
  fileNameArray = file.name.toLowerCase().split('.');
  fileFormat = fileNameArray[fileNameArray.length - 1];
  const formats = ['png', 'jpg', 'gif', 'jpeg'];

  if (formats.indexOf(fileFormat) < 0) return res.status(500).json({ success: false, message: 'Format not allowed' });

  const fileName = `${id}-${new Date().getMilliseconds()}.${fileFormat}`;

  file.mv(`uploads/${type}/${fileName}`, (error) => {
    if (error) return res.status(500).json({ success: false, message: error.message });
    if (type === 'user') {
      userImage(id, res, fileName);
    } else {
      productImage(id, res, fileName);
    }
  });
});

function userImage(id, res, fileName) {
  User.findById(id, (error, dbUser) => {
    if (error) { 
      deleteFile(fileName, 'user');
      return res.status(500).json({ success: false, message: error.message });
    }
    if (!dbUser) {
      deleteFile(fileName, 'user');
      return res.status(400).json({ success: false, message: `User doesn't exist` });
    }
    deleteFile(dbUser.image, 'user');
    dbUser.image = fileName;
    dbUser.save((err, userUpdated) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'User updated', data: userUpdated });
    });
  });
}

function productImage(id, res, fileName) {
  Product.findById(id, (error, dbProduct) => {
    if (error) { 
      deleteFile(fileName, 'product');
      return res.status(500).json({ success: false, message: error.message });
    }
    if (!dbProduct) {
      deleteFile(fileName, 'product');
      return res.status(400).json({ success: false, message: `Product doesn't exist` });
    }
    deleteFile(dbProduct.image, 'product');
    dbProduct.image = fileName;
    dbProduct.save((err, productUpdated) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Product updated', data: productUpdated });
    });
  });
}

function deleteFile(fileName, type) {
  const imagePath = path.resolve(__dirname, `../uploads/${type}/${fileName}`);
  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
}

module.exports = app;