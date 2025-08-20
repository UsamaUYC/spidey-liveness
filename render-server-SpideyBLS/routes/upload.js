const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const SESSIONS_FILE = path.join(__dirname, '../data/sessions.json');

router.post('/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const { imageData } = req.body;

  if (!imageData) {
    return res.status(400).json({ error: 'Missing imageData' });
  }

  let sessions = {};
  try {
    sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE));
  } catch (e) {
    return res.status(500).json({ error: 'Failed to read session file' });
  }

  if (!sessions[sessionId]) {
    return res.status(404).json({ error: 'Invalid session ID' });
  }

  sessions[sessionId].status = 'received';
  sessions[sessionId].imageData = imageData;

  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));

  res.json({ success: true });
});

module.exports = router;
