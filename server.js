const express = require('express');
const cors = require('cors');
const path = require('path');
const products = require('./data/products.json');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
