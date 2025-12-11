const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const Product = require('./models/Product');
const PageContent = require('./models/PageContent');

const app = express();
const PORT = 5000;

const MONGO_URI = 'mongodb+srv://nahli123140049_db_user:admin123@cluster0.mwssamz.mongodb.net/?appName=Cluster0'; 

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// -------------------------------------------------------
// FIX PATH RESOLUTION (SOLUSI ERROR)
// -------------------------------------------------------
// Menggunakan __dirname dan naik satu level (..) adalah cara paling aman untuk Localhost
// Ini akan menghasilkan path: D:\SEM 5 CHUY\SI\frontend
const frontendPath = path.join(__dirname, '../frontend');

// Serve Static Files
app.use(express.static(frontendPath));
app.use('/assets', express.static(path.join(frontendPath, 'assets')));

// Cek Koneksi Database
mongoose.connect(MONGO_URI)
    .then(() => console.log('   ✅ MongoDB Connected Successfully'))
    .catch(err => console.error('   ❌ MongoDB Connection Error:', err));

// --- ROUTES API PRODUK ---

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

// UPDATE PRODUCT (PUT)
app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedProduct);
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

// --- ROUTES API KONTEN HALAMAN (CMS) ---

app.get('/api/content/:page', async (req, res) => {
    try {
        const data = await PageContent.findOne({ page: req.params.page });
        res.json(data ? data.content : {});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/content/:page', async (req, res) => {
    try {
        const updatedContent = await PageContent.findOneAndUpdate(
            { page: req.params.page },
            { content: req.body },
            { new: true, upsert: true }
        );
        res.json(updatedContent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- CATCH-ALL ROUTE ---
app.get('*', (req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            // Tampilkan pesan error yang lebih jelas jika file tidak ditemukan
            res.status(500).send(`
                <h1>Server Error: Gagal Memuat Frontend</h1>
                <p>Error: ${err.message}</p>
                <p>Path yang dicari: ${indexPath}</p>
                <p>Pastikan folder 'frontend' sejajar dengan folder 'backend'.</p>
            `);
        }
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
