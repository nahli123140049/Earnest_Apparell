const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');

// Middleware
app.use(cors());
// Limit ditingkatkan ke 10mb agar bisa upload gambar base64
app.use(bodyParser.json({ limit: '10mb' })); 
app.use(express.static(__dirname)); // Melayani file HTML/CSS/JS di folder ini

// --- API ROUTES ---

// 1. Get All Products
app.get('/api/products', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            // Jika file belum ada, return array kosong
            return res.json([]);
        }
        try {
            res.json(JSON.parse(data));
        } catch (e) {
            res.json([]);
        }
    });
});

// 2. Add Product
app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    
    // Validasi sederhana
    if (!newProduct.title) return res.status(400).json({ error: 'Title required' });

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let products = [];
        if (!err && data) {
            try { products = JSON.parse(data); } catch (e) {}
        }

        // Tambahkan ID dan Timestamp
        newProduct.id = Date.now();
        newProduct.createdAt = new Date().toISOString();
        
        products.push(newProduct);

        fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Failed to save' });
            res.json({ message: 'Success', product: newProduct });
        });
    });
});

// 3. Delete Product
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Read error' });
        
        let products = JSON.parse(data);
        const initialLength = products.length;
        products = products.filter(p => p.id !== id);

        if (products.length === initialLength) {
            return res.status(404).json({ error: 'Product not found' });
        }

        fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Write error' });
            res.json({ message: 'Deleted successfully' });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Buka browser dan akses alamat di atas.`);
});
