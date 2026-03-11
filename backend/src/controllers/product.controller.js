import { Product } from '../models/Product.js';

// Helper para generar slugs simples
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Reemplazar espacios con -
    .replace(/[^\w\-]+/g, '') // Eliminar caracteres no permitidos
    .replace(/\-\-+/g, '-');  // Reemplazar múltiples - con uno solo
};

export const getProducts = async (req, res) => {
  try {
    const { category, skinType, search, page = 1, limit = 20 } = req.query;
    
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (skinType) {
      query.skinTypes = skinType;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, slug, ...body } = req.body;
    
    const productSlug = slug || generateSlug(name);
    
    // Verificar si el slug ya existe
    const existingProduct = await Product.findOne({ slug: productSlug });
    if (existingProduct) {
      return res.status(400).json({ message: 'El slug ya existe, por favor elige otro nombre o slug.' });
    }

    const product = new Product({
      name,
      slug: productSlug,
      ...body
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { slug, ...body } = req.body;
    
    // Si se intenta actualizar el slug, verificar duplicados
    if (slug) {
      const existingProduct = await Product.findOne({ slug, _id: { $ne: req.params.id } });
      if (existingProduct) {
        return res.status(400).json({ message: 'El slug ya existe en otro producto.' });
      }
      body.slug = slug;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
