const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/user', (req, res) => {
  res.json('get user');
});

app.post('/user', (req, res) => {
  const body = req.body;
  res.json({ user: body });
});

app.put('/user/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id });
});

app.delete('/user', (req, res) => {
  res.json('delete user');
});

app.listen(3000, () => console.log('listening on port 3000'));