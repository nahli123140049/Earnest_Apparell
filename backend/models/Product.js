const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    details: {
        material: String,
        color: String,
        size: String
    },
    createdAt: { type: Date, default: Date.now }
});

// Ubah _id menjadi id agar sesuai dengan frontend
ProductSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model('Product', ProductSchema);
