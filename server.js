import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Получаем __dirname для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// Middleware для обработки JSON
app.use(express.json());

// Маршруты API
app.get('/api/products', async (req, res) => {
  try {
    const products = await getProductsFromDB(); // Ваша функция получения товаров
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обработка 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});