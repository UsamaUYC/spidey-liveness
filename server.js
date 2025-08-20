const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// In-memory session store
const sessions = {};

// Static route to serve uploaded selfies (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = path.join(__dirname, "uploads");
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.params.id}.jpg`);
  }
});
const upload = multer({ storage });

// 1️⃣ Create a new selfie session
app.post("/session", (req, res) => {
  const sessionId = uuidv4();
  sessions[sessionId] = { status: "pending", timestamp: Date.now() };
  res.json({ sessionId, link: `https://your-render-url.onrender.com/selfie/${sessionId}` });
});

// 2️⃣ Get session status
app.get("/session/:id/status", (req, res) => {
  const session = sessions[req.params.id];
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json({ status: session.status });
});

// 3️⃣ Upload selfie
app.post("/session/:id/upload", upload.single("selfie"), (req, res) => {
  const session = sessions[req.params.id];
  if (!session) return res.status(404).json({ error: "Session not found" });

  session.status = "received";
  session.file = `/uploads/${req.params.id}.jpg`;

  console.log(`[✅] Selfie received for session ${req.params.id}`);
  res.json({ success: true, file: session.file });
});

// 4️⃣ Get selfie (optional)
app.get("/session/:id/selfie", (req, res) => {
  const file = path.join(__dirname, "uploads", `${req.params.id}.jpg`);
  if (!fs.existsSync(file)) return res.status(404).send("Not found");
  res.sendFile(file);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Selfie Server running on port ${PORT}`);
});
