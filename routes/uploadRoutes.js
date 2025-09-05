// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const cloudinary = require('../config/cloudinary');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload endpoint
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "campus-connect" }, // Optional folder in Cloudinary
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Send back the secure URL
    res.status(200).json({ imageUrl: result.secure_url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during upload', error });
  }
});

module.exports = router;
