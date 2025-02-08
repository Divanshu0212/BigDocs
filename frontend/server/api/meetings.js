const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');

const ZOOM_API_KEY = 'YOUR_ZOOM_API_KEY';
const ZOOM_API_SECRET = 'YOUR_ZOOM_API_SECRET';
const ZOOM_ACCOUNT_ID = 'YOUR_ZOOM_ACCOUNT_ID';

// Generate Zoom JWT token
const generateZoomToken = () => {
  const payload = {
    iss: ZOOM_API_KEY,
    exp: ((new Date()).getTime() + 5000)
  };
  return jwt.sign(payload, ZOOM_API_SECRET);
};

// Create a meeting
router.post('/create-meeting', async (req, res) => {
  try {
    const token = generateZoomToken();
    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: 'Medical Consultation',
        type: 1, // Instant meeting
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: false,
          waiting_room: true,
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meeting' });
  }
});

// Get meeting details
router.get('/meetings/:meetingId', async (req, res) => {
  try {
    const token = generateZoomToken();
    const response = await axios.get(
      `https://api.zoom.us/v2/meetings/${req.params.meetingId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meeting details' });
  }
});

module.exports = router; 