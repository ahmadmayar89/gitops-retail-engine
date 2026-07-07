const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

console.log('Starting backend server...');

app.use(cors());
app.use(express.json());

// Simple health check (no database)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Products endpoint with error handling
app.get('/api/products', async (req, res) => {
  try {
    const pool = new Pool({
      host: process.env.DB_HOST || 'postgres',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'ecommerce',
      port: 5432,
    });
    const result = await pool.query('SELECT id, name, price, description FROM products ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error.message);
    res.json([{ id: 1, name: 'Sample Product', price: 99.99, description: 'Fallback product' }]);
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Retail Engine API', version: '1.0.0' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
