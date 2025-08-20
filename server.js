const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const sessions = {};

app.post("/create-session", (req, res) => {
  const sessionId = uuidv4();
  sessions[sessionId] = { status: "pending", photo: null };
  res.json({ sessionId });
});

app.post("/update-status/:id", (req, res) => {
  const { id } = req.params;
  const { status, photo } = req.body;
  if (!sessions[id]) return res.status(404).json({ error: "Session not found" });

  sessions[id].status = status;
  if (photo) sessions[id].photo = photo;
  res.json({ success: true });
});

app.get("/status/:id", (req, res) => {
  const { id } = req.params;
  if (!sessions[id]) return res.status(404).json({ error: "Session not found" });
  res.json(sessions[id]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

