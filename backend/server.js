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
// Error "bad auth" sebelumnya terjadi karena Password salah.
// Silakan ganti 'PASSWORD_BARU_ANDA' dengan password yang baru saja Anda reset di Atlas.
// Saya juga menambahkan '/earnest_apparel' agar data masuk ke database yang benar.

const MONGO_URI = 'mongodb+srv://nahli123140049_db_user:admin123@cluster0.mwssamz.mongodb.net/?appName=Cluster0'; 

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// -------------------------------------------------------
// UPDATE KONFIGURASI STATIC FILES (AGAR CSS MUNCUL)
// -------------------------------------------------------
// 1. Serve folder frontend sebagai root (untuk index.html dll)
app.use(express.static(path.join(__dirname, '../frontend')));

// 2. Serve folder assets secara spesifik (Prioritas 1: di dalam frontend)
// Ini memastikan request ke /assets/css/style.css diarahkan ke folder yang benar
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// 3. Serve folder assets fallback (Prioritas 2: di root project, jika lupa dipindah)
app.use('/assets', express.static(path.join(__dirname, '../assets')));


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

// Start Server
app.listen(PORT, () => {
    console.log('\n==================================================');
    console.log(`🚀 SERVER SUDAH JALAN!`);
    console.log(`🔗 Link API: http://localhost:${PORT}`);
    console.log('==================================================\n');
});
