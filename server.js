require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  slug: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const productJoi = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  price: Joi.number().positive().required(),
  slug: Joi.string().min(1).required(),
});
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
  {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  res.json(product);
});
app.get('/test', (req, res) => res.json({ ok: true }));
app.post('/api/products', upload.single('image'), async (req, res) => {
  const { name, description, price, slug } = req.body;
  const validation = productJoi.validate({ name, description, price, slug });
  if (validation.error) {
    if (req.file)
    {
      require('fs').unlinkSync(req.file.path);
    }
    return res.status(400).json({ success: false, message: validation.error.details[0].message });
  }

  let image = '';
  if (req.file)
  {
    image = '/images/' + req.file.filename;
  }
  else
  {
    image = '';
  }
  const product = new Product({ name, description, price, slug, image });

  await product.save();
  res.status(201).json({ success: true, message: 'Product added', product });
});

app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  const { name, description, price, slug } = req.body;
  const validation = productJoi.validate({ name, description, price, slug });
  if (validation.error) {
    if (req.file) 
    {
      require('fs').unlinkSync(req.file.path);
    }
    return res.status(400).json({ success: false, message: validation.error.details[0].message });
  }

  let update = { name, description, price, slug };
  if (req.file) 
  {
    update.image = '/images/' + req.file.filename;
  }

  const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!product) 
  {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  res.json({ success: true, message: 'Product updated', product });
});

app.delete('/api/products/:id', async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) 
  {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  res.json({ success: true, message: 'Product deleted' });
});
let contactMessage = [];
const messageSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  message: Joi.string().min(1).required()
});

app.post('/api/contact', (req, res) => {
  const { error, value } = messageSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message
    });
  }
  contactMessage.push(value);

  res.status(201).json({
    success: true,
    message: 'Message added successfully',
    newMessage: value
  });
});

app.get('/api/messages', (req, res) => {
  res.json(contactMessage);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
