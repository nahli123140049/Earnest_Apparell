const mongoose = require('mongoose');

const PageContentSchema = new mongoose.Schema({
    page: { type: String, required: true, unique: true }, // misal: 'home', 'about', 'contact'
    content: { type: Object, required: true } // Objek fleksibel untuk menyimpan teks
});

module.exports = mongoose.model('PageContent', PageContentSchema);
