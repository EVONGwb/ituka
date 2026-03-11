import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return !this.googleId; } },
  googleId: { type: String, unique: true, sparse: true },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  skinType: { type: String },
  skinNeeds: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Hashear password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
