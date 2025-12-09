const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const Product = require('./models/Product');

const app = express();
const PORT = 5000;

// ---------------------------------------------------------------------------
// PENTING: GANTI STRING DI BAWAH INI DENGAN YANG ASLI DARI DASHBOARD ATLAS
// ---------------------------------------------------------------------------
const MONGO_URI = 'mongodb+srv://nahli123140049_db_user:admin123@cluster0.mwssamz.mongodb.net/?appName=Cluster0'; 

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// -------------------------------------------------------
// 1. SERVE FRONTEND (WAJIB DI PALING ATAS)
// -------------------------------------------------------
// Melayani file statis (CSS, JS, Gambar) dari folder frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Melayani folder assets secara spesifik (jaga-jaga)
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Cek Koneksi Database
mongoose.connect(MONGO_URI)
    .then(() => console.log('   ✅ MongoDB Connected Successfully'))
    .catch(err => console.error('   ❌ MongoDB Connection Error:', err));

// -------------------------------------------------------
// 2. API ROUTES
// -------------------------------------------------------

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// -------------------------------------------------------
// 3. CATCH-ALL ROUTE (PENYELAMAT)
// -------------------------------------------------------
// Jika route API tidak kena, dan file statis tidak ada,
// kirimkan index.html (Halaman Utama)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server (Localhost Only)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
