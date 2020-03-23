require('./config/config');

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
  console.log(body);
  if (body.name === undefined) {
    res.status(400).json({ success: false, message: 'User name is mandatory'});
  } else {
    res.json(body);
  }
});

app.put('/user/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id });
});

app.delete('/user', (req, res) => {
  res.json('delete user');
});

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));