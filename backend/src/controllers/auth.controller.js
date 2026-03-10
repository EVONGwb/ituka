import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Enviar respuesta sin el password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({
      message: 'Login exitoso',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Register (Implementación básica)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const newUser = await User.create({ name, email, password });
    
    // Generar token para auto-login
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const userData = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};
