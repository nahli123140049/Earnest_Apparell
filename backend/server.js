const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');

const app = express();
const PORT = 5000;

// ---------------------------------------------------------------------------
// PENTING: GANTI STRING DI BAWAH INI DENGAN YANG ASLI DARI DASHBOARD ATLAS
// ---------------------------------------------------------------------------
const MONGO_URI = 'mongodb+srv://nahli123140049_db_user:admin123@cluster0.mwssamz.mongodb.net/?appName=Cluster0'; 

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Cek Koneksi Database
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('   ✅ MongoDB Connected Successfully');
    })
    .catch(err => {
        console.error('   ❌ MongoDB Connection Error:', err);
    });

// Routes API
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

// Route Default untuk cek status API
app.get('/', (req, res) => {
    res.send('Backend API is Running');
});

// Start Server (Hanya jalankan listen jika di Localhost, bukan di Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log('\n==================================================');
        console.log(`🚀 SERVER SUDAH JALAN!`);
        console.log(`🔗 Link API: http://localhost:${PORT}`);
        console.log('==================================================\n');
    });
}

// Export app untuk Vercel
module.exports = app;
