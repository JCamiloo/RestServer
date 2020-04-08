const express = require('express');
const verifyToken = require('../middlewares/authentication');
const verifyRole = require('../middlewares/role');

const app = express();

app.get('/category', verifyToken, (req, res) => {

});

app.get('/category/:id', verifyToken, (req, res) => {
  
});

app.post('category', [verifyToken, verifyRole], (req, res) => {

});

app.put('category/:id', [verifyToken, verifyRole], (req, res) => {

});

app.delete('category/:id', [verifyToken, verifyRole], (req, res) => {

});

module.exports = app;