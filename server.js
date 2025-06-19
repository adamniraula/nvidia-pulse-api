// server.js
const express = require('express');
const cors = require('cors');
const Joi = require('joi');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let contactMessage = [];

// Joi validation schema
const messageSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  message: Joi.string().min(1).required()
});

// POST route to receive and validate contact form data
app.post('/api/contact', (req, res) => {
  const { error, value } = messageSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message
    });
  }

  // ✅ Add the validated data to the array
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

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
