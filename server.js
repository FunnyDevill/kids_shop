const express = require('express');
const path = require('path');
const app = express();

// Статические файлы из нескольких папок
app.use(express.static(path.join(__dirname, 'public')));
app.use('/partials', express.static(path.join(__dirname, 'partials'))); // Важно для ComponentLoader

// Fallback для SPA (должен быть последним!)
app.use((req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});

const PORT = 5500;
//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));