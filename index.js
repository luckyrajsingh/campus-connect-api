// index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // 👈 Import cors
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware Setup
app.use(cors()); // 👈 Use cors middleware FIRST
app.use(express.json()); // Then, middleware to parse JSON

// Default route
app.get('/', (req, res) => {
  res.send('CampusConnect API is running...');
});

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
