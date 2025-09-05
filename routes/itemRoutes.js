const express = require('express');
const router = express.Router();
const { createItem, getItems, updateItem, deleteItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Route for getting all items and creating a new one
router.route('/')
  .post(protect, createItem)
  .get(getItems);

// Routes for updating and deleting a specific item by its ID
router.route('/:id')
  .put(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
