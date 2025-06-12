// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Mengizinkan permintaan dari React
app.use(express.json()); // Mem-parsing body permintaan JSON

// Routes
const articleRoutes = require('./routes/articles');
app.use('/api/articles', articleRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});