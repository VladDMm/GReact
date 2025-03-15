const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware-uri
app.use(helmet()); // Adaugă securitate HTTP headers
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' })); // Permite acces doar de la origini sigure
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

// const db = mysql.createPool({
//   host: process.env.DB_HOST || 'sql.freedb.tech',
//   user: process.env.DB_USER || 'freedb_administratorRoot',
//   password: process.env.DB_PASSWORD || 'TePDzZFgPsKq*8x',
//   database: process.env.DB_NAME || 'freedb_glasstrack_db',
//   waitForConnections: true,
//   connectionLimit: 10, // Maxim 10 conexiuni simultane
//   queueLimit: 0,
//   charset: 'cp1251' // 🔥 Asigură codificarea corectă
// });

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'glasstrack_db',
  waitForConnections: true,
  connectionLimit: 10, // Maxim 10 conexiuni simultane
  queueLimit: 0,
  charset: 'cp1251' // 🔥 Asigură codificarea corectă
});

// const db = mysql.createPool({
//   host: process.env.DB_HOST || '172.16.4.99',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'Halley2025!',
//   database: process.env.DB_NAME || 'glasstrack_db',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   charset: 'cp1251'
// });

// 🔹 GET - Obține timestamp-ul ultimei actualizări
app.get('/api/products/last-update', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT MAX(updated_at) as last_update FROM product_auto_table');
    const lastUpdate = results[0]?.last_update || new Date().toISOString();
    res.json({ timestamp: new Date(lastUpdate).getTime() });
  } catch (err) {
    console.error('Eroare SQL:', err);
    res.status(500).json({ error: 'Eroare internă' });
  }
});


// 🔹 GET - Obține toate produsele sau caută după termen
app.get('/api/products', async (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : '%';

  const sql = `
    SELECT pp.pa_id, a.a_marca_model, ct.cod, c.nume_celula, pp.p_count, pp.p_price, pp.is_updated
    FROM product_auto_table pp
    JOIN vehicle_table a ON a.a_id = pp.a_id
    JOIN celula_table c ON c.id_celula = pp.celula_id
    JOIN code_table ct ON ct.id_cod = pp.id_cod
    WHERE a.a_marca_model LIKE ? OR ct.cod LIKE ? OR pp.p_price LIKE ? 
  `;

  try {
    const [results] = await db.execute(sql, [search, search, search]);
    res.setHeader('Content-Type', 'application/json; charset=cp1251');
    res.json(results);
  } catch (err) {
    console.error('Eroare SQL:', err);
    res.status(500).json({ error: 'Eroare internă' });
  }
});

// 🔹 GET - Obține un produs după ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM product_auto_table WHERE pa_id = ?', [req.params.id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Produsul nu a fost găsit' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('Eroare SQL:', err);
    res.status(500).json({ error: 'Eroare internă' });
  }
});

// Pornirea serverului
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ API-ul rulează pe http://localhost:${port}`);
});
