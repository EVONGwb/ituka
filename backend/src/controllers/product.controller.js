import { Product } from '../models/Product.js';

export const getProducts = async (req, res) => {
  // Simulación de productos
  const products = [
    { id: 1, name: 'Crema Hidratante', price: 25.00, category: 'Cuidado Facial' },
    { id: 2, name: 'Aceite de Argán', price: 15.50, category: 'Aceites' }
  ];
  res.json(products);
};

export const createProduct = async (req, res) => {
  res.json({ message: 'Producto creado', product: req.body });
};
