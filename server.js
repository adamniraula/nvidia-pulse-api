const express = require('express');
const cors    = require('cors');
const path    = require('path');
const products = require('./data/products.json');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET /api/products → all GPUs
app.get('/api/products', (req, res) => {
  res.json(products);
});

// (Optional) POST /api/products to add new GPU
// app.post('/api/products', (req, res) => { /* validate & push */ });

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on ${port}`));