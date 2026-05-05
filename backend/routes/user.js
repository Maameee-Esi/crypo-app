const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/profile', protect, async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
