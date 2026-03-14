import { User } from '../models/User.js';
import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import mongoose from 'mongoose';

const seedAdmin = async () => {
  try {
    await connectDB(env.MONGODB_URI);
    console.log('📦 Conectado a MongoDB para seeding...');

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error('Falta ADMIN_PASSWORD en variables de entorno');
    }

    const adminData = {
      name: 'ituka',
      email: 'directora@ituka.com',
      password: adminPassword,
      role: 'admin'
    };

    // Verificar si ya existe
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      existingAdmin.password = adminPassword;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Usuario Admin actualizado exitosamente:');
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Role: admin`);
    } else {
      // Al crear el usuario, el middleware pre-save del modelo se encargará de hashear el password
      await User.create(adminData);
      console.log('✅ Usuario Admin creado exitosamente:');
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Role: ${adminData.role}`);
    }

    await mongoose.connection.close();
    console.log('👋 Conexión cerrada.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
};

seedAdmin();
