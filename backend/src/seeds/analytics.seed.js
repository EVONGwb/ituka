import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import mongoose from 'mongoose';

const seedAnalytics = async () => {
  try {
    await connectDB(env.MONGODB_URI);
    console.log('📦 Conectado a MongoDB para seeding de analítica...');

    // 1. Crear Productos
    const products = [
      { name: 'Serum de Vitamina C', slug: 'serum-vitamina-c', price: 25000, description: 'Iluminador y antioxidante', category: 'Facial', stock: 50, images: ['https://via.placeholder.com/150'] },
      { name: 'Crema Hidratante Intensiva', slug: 'crema-hidratante-intensiva', price: 18000, description: 'Para piel seca', category: 'Facial', stock: 30, images: ['https://via.placeholder.com/150'] },
      { name: 'Tónico de Rosas', slug: 'tonico-de-rosas', price: 12000, description: 'Refrescante y calmante', category: 'Facial', stock: 40, images: ['https://via.placeholder.com/150'] },
      { name: 'Exfoliante de Café', slug: 'exfoliante-de-cafe', price: 15000, description: 'Renovación celular', category: 'Corporal', stock: 25, images: ['https://via.placeholder.com/150'] },
      { name: 'Aceite de Argán Puro', slug: 'aceite-de-argan-puro', price: 30000, description: 'Nutrición profunda', category: 'Cabello', stock: 15, images: ['https://via.placeholder.com/150'] }
    ];

    // Upsert products (actualizar si existen, crear si no)
    const createdProducts = [];
    for (const p of products) {
      let product = await Product.findOne({ name: p.name });
      if (!product) {
        product = await Product.create(p);
        console.log(`✅ Producto creado: ${p.name}`);
      } else {
        console.log(`ℹ️ Producto ya existe: ${p.name}`);
        product.slug = p.slug; // Asegurar slug
        await product.save();
      }
      createdProducts.push(product);
    }

    // 2. Crear Clientes (si no hay suficientes)
    const clientsData = [
      { name: 'Ana García', email: 'ana@example.com', password: 'password123', role: 'customer' },
      { name: 'Carlos López', email: 'carlos@example.com', password: 'password123', role: 'customer' },
      { name: 'Lucía Méndez', email: 'lucia@example.com', password: 'password123', role: 'customer' }
    ];

    const createdClients = [];
    for (const c of clientsData) {
      let client = await User.findOne({ email: c.email });
      if (!client) {
        client = await User.create(c); // Middleware hashea password
        console.log(`✅ Cliente creado: ${c.name}`);
      } else {
         console.log(`ℹ️ Cliente ya existe: ${c.name}`);
      }
      createdClients.push(client);
    }

    // 3. Crear Pedidos (Solicitudes) distribuidos en los últimos 7 días
    // Borrar pedidos anteriores de prueba para limpiar gráfica si se desea (opcional, aquí no lo haremos para acumular)
    
    const today = new Date();
    const ordersToCreate = 25; // Número de pedidos a generar

    console.log(`Generando ${ordersToCreate} pedidos distribuidos en la última semana...`);

    for (let i = 0; i < ordersToCreate; i++) {
      // Fecha aleatoria en los últimos 7 días
      const daysAgo = Math.floor(Math.random() * 8); // 0 a 7 días atrás
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      
      // Hora aleatoria
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      // Cliente aleatorio
      const client = createdClients[Math.floor(Math.random() * createdClients.length)];

      // Productos aleatorios (1 a 3 items)
      const itemsCount = Math.floor(Math.random() * 3) + 1;
      const items = [];
      let total = 0;

      for (let j = 0; j < itemsCount; j++) {
        const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;
        items.push({
          product: product._id,
          quantity: quantity,
          price: product.price
        });
        total += product.price * quantity;
      }

      // Estado aleatorio (mayoritariamente 'solicitud_recibida' para simular nuevas)
      const statuses = ['solicitud_recibida', 'solicitud_recibida', 'solicitud_recibida', 'en_conversacion', 'confirmado'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      await Order.create({
        user: client._id,
        items,
        total,
        status,
        createdAt: date,
        updatedAt: date
      });
    }

    console.log('✅ Seeding de analítica completado.');
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error en el seed de analítica:', error);
    process.exit(1);
  }
};

seedAnalytics();
