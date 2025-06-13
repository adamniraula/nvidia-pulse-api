const express = require('express');
const cors = require('cors');
const products = require('./data/products.json');

const app = express();
app.use(cors());
app.use(express.static('public'));

app.get('/api/products', (req, res) => {
  res.json(products);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on port ${port}`));