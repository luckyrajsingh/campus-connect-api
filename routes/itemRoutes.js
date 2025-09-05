const express = require('express');
const router = express.Router();
const { createItem, getItems } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Chaining routes for the same URL
router.route('/')
  .post(protect, createItem) // POST is a protected route
  .get(getItems);            // GET is a public route

module.exports = router;