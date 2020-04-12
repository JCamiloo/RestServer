const express = require('express');
const fileUpload = require('express-fileupload');
const User = require('../models/user.model');

const app = express();
const updateOptions = { new: true, runValidators: true, context: 'query' };

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
    userImage(id, res, fileName);
  });
});

function userImage(id, res, fileName) {
  const body = { image: fileName };
  User.findByIdAndUpdate(id, body, updateOptions, (error, dbUser) => {
    if (error) res.status(500).json({ success: false, message: error.message });
    if (!dbUser) res.status(400).json({ success: false, message: `User doesn't exist` });
    res.json({ success: true, message: 'Image uploaded' });
  });
}

module.exports = app;