const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const generateRoute = require('./routes/generate');
const uploadRoute = require('./routes/upload');
const statusRoute = require('./routes/status');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/generate', generateRoute);
app.use('/upload', uploadRoute);
app.use('/status', statusRoute);

// Start server
app.listen(PORT, () => {
  console.log(`[Render-Backend] Listening on port ${PORT}`);
});
