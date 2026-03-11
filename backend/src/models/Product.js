import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  images: [{ type: String }], // Array of image URLs
  ingredients: { type: String },
  benefits: { type: String },
  usageMode: { type: String },
  skinTypes: [{ type: String, index: true }], // e.g., ['Seca', 'Grasa', 'Mixta', 'Sensible', 'Todo tipo']
  isActive: { type: Boolean, default: true },
  stock: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.model('Product', productSchema);
