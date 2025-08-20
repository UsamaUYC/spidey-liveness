const express = require("express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public")); // Serves files from 'public' folder

const sessions = {};

app.post("/session/create", (req, res) => {
  const sessionId = uuidv4();
  sessions[sessionId] = { status: "pending" };
  res.json({
    sessionId,
    link: `https://spidey-liveness.onrender.com/selfie/${sessionId}`
  });
});

app.get("/status/:id", (req, res) => {
  const session = sessions[req.params.id];
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json({ status: session.status });
});

app.post("/submit/:id", (req, res) => {
  const session = sessions[req.params.id];
  if (!session) return res.status(404).json({ error: "Session not found" });
  session.status = "received";
  res.json({ message: "Selfie received" });
});

// 🧠 Serve selfie.html for /selfie/:id
app.get("/selfie/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "selfie.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

