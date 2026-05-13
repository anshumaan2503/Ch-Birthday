const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static files from current directory
app.use(express.static(path.join(__dirname)));

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Fallback to index.html
app.get('*', (req, res) => {
  console.log(`Serving request: ${req.url}`);
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎂 Birthday site running on port ${PORT}`);
});
