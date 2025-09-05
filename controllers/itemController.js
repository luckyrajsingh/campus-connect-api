const Item = require('../models/Item');

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { status, itemName, description, category, location } = req.body;

    if (!status || !itemName || !description || !category || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const item = await Item.create({
      status,
      itemName,
      description,
      category,
      location,
      user: req.user.id // This comes from our authMiddleware
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    // We can add filtering later, e.g., /api/items?status=found
    const filter = req.query.status ? { status: req.query.status } : {};

    const items = await Item.find(filter)
      .populate('user', 'name collegeId') // Get user's name and ID
      .sort({ createdAt: -1 }); // Show newest first

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createItem,
  getItems
};