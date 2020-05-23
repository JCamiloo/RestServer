const express = require('express');
const app = express();
const axios = require('axios');
const URL = 'http://34.71.9.156';


app.get('/commerces/layer', async (req, res) => {
  const instance = axios.create({ baseURL: `${URL}/commerces/layer` });
  const response = await instance.get();
  res.json(response.data);
});

module.exports = app;
