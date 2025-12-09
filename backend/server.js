const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const Product = require('./models/Product');

const app = express();
const PORT = 5000;

const MONGO_URI = 'mongodb+srv://nahli123140049_db_user:admin123@cluster0.mwssamz.mongodb.net/?appName=Cluster0'; 

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// -------------------------------------------------------
// PATH RESOLUTION (DEBUGGING MODE)
// -------------------------------------------------------
// Kita gunakan process.cwd() untuk mencari folder frontend di root project
// Ini lebih aman di Vercel daripada __dirname
const frontendPath = path.join(process.cwd(), 'frontend');

// Serve Static Files
app.use(express.static(frontendPath));
app.use('/assets', express.static(path.join(frontendPath, 'assets')));

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
// 3. CATCH-ALL ROUTE (DENGAN ERROR HANDLING)
// -------------------------------------------------------
// Jika route API tidak kena, kita coba kirim index.html
app.get('*', (req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    
    res.sendFile(indexPath, (err) => {
        if (err) {
            // Jika error, tampilkan pesan debug di browser agar kita tau salahnya dimana
            res.status(500).send(`
                <div style="font-family: monospace; padding: 20px;">
                    <h1>Server Error: Gagal Memuat Frontend</h1>
                    <p><strong>Error Message:</strong> ${err.message}</p>
                    <hr>
                    <h3>Debug Info:</h3>
                    <p><strong>Mencari file di:</strong> ${indexPath}</p>
                    <p><strong>Folder Frontend terdeteksi di:</strong> ${frontendPath}</p>
                    <p><strong>Current Directory (CWD):</strong> ${process.cwd()}</p>
                    <p><strong>Dirname:</strong> ${__dirname}</p>
                </div>
            `);
        }
    });
});

// Start Server (Localhost Only)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
