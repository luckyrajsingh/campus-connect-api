const Item = require('../models/Item');

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { status, itemName, description, category, location, imageUrl } = req.body;

    if (!status || !itemName || !description || !category || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const item = await Item.create({
      status,
      itemName,
      description,
      category,
      location,
      imageUrl,
      user: req.user.id
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all items (with optional search and status filters)
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    // 👇 This is the new search logic
    const keyword = req.query.search
      ? {
          // Search in both itemName and description
          $or: [
            { itemName: { $regex: req.query.search, $options: 'i' } }, // 'i' for case-insensitive
            { description: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    const statusFilter = req.query.status ? { status: req.query.status } : {};

    const items = await Item.find({ ...keyword, ...statusFilter }) // Combine all filters
      .populate('user', 'name collegeId')
      .sort({ createdAt: -1 });
      
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// @desc    Update an item (e.g., mark as resolved)
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Update the isResolved status from the request body
    if (req.body.isResolved !== undefined) {
      item.isResolved = req.body.isResolved;
    }
    
    const updatedItem = await item.save();
    res.json(updatedItem);

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// This should be the ONLY module.exports block in the file
module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};

