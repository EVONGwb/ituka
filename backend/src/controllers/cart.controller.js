import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

// POST /api/cart/add
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }
    
    await cart.save();
    // Populate before returning
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al añadir al carrito' });
  }
};

// PUT /api/cart/item/:id (id is product id)
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;
    
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex > -1) {
      if (quantity > 0) {
        cart.items[itemIndex].quantity = Number(quantity);
      } else {
        cart.items.splice(itemIndex, 1);
      }
      await cart.save();
      await cart.populate('items.product');
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar carrito' });
  }
};

// DELETE /api/cart/item/:id
export const removeCartItem = async (req, res) => {
  try {
    const productId = req.params.id;
    
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
};

// PUT /api/cart/note
export const updateNote = async (req, res) => {
    try {
        const { note } = req.body;
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        cart.note = note;
        await cart.save();
        await cart.populate('items.product');
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar nota' });
    }
}
