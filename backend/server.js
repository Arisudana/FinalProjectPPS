// backend/server.js
const express = require('express');
const cors = require('cors');
const articleRoutes = require('./routes/articles');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Mengizinkan permintaan dari React
app.use(express.json()); // Mem-parsing body permintaan JSON

// Routes
app.use('/api/articles', articleRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});