const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const SESSIONS_FILE = path.join(__dirname, '../data/sessions.json');

router.get('/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  let sessions = {};
  try {
    sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE));
  } catch (e) {
    return res.status(500).json({ error: 'Failed to read session file' });
  }

  const session = sessions[sessionId];

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({ status: session.status, imageData: session.imageData });
});

module.exports = router;
