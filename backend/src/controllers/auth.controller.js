import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

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
    const token = generateToken(user._id, user.role);

    // Enviar respuesta sin el password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      skinType: user.skinType,
      skinNeeds: user.skinNeeds,
      favorites: user.favorites
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

// Register
export const register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password,
      phone,
      address,
      skinType,
      skinNeeds
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const newUser = await User.create({ 
      name, 
      email, 
      password,
      phone,
      address,
      skinType,
      skinNeeds
    });
    
    // Generar token para auto-login
    const token = generateToken(newUser._id, newUser.role);

    const userData = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      address: newUser.address,
      skinType: newUser.skinType,
      skinNeeds: newUser.skinNeeds,
      favorites: newUser.favorites
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

// Get current user profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.skinType = req.body.skinType || user.skinType;
    user.skinNeeds = req.body.skinNeeds || user.skinNeeds;
    
    if (req.body.address) {
      user.address = { ...user.address, ...req.body.address };
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      skinType: updatedUser.skinType,
      skinNeeds: updatedUser.skinNeeds,
      favorites: updatedUser.favorites,
      token: generateToken(updatedUser._id, updatedUser.role)
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

// Google Login
export const googleLogin = async (req, res) => {
  const { credential, accessToken } = req.body;
  
  try {
    let name, email, googleId, picture;

    if (credential) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      name = payload.name;
      email = payload.email;
      googleId = payload.sub;
      picture = payload.picture;
    } else if (accessToken) {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (!response.ok) {
        throw new Error('Error al validar token de acceso');
      }
      
      const data = await response.json();
      name = data.name;
      email = data.email;
      googleId = data.sub;
      picture = data.picture;
    } else {
      return res.status(400).json({ message: 'Token de Google requerido' });
    }

    let user = await User.findOne({ email });

    if (user) {
      // Si el usuario existe pero no tiene googleId, lo vinculamos
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Crear nuevo usuario
      user = await User.create({
        name,
        email,
        googleId,
        // Password es opcional gracias a la modificación en el modelo
      });
    }

    const token = generateToken(user._id, user.role);

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      skinType: user.skinType,
      skinNeeds: user.skinNeeds,
      favorites: user.favorites,
      picture: picture // Opcional si queremos guardar la foto
    };

    res.json({
      message: 'Login con Google exitoso',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Token de Google inválido' });
  }
};
