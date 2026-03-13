import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/email.js';

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

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'No existe usuario con ese email' });
    }

    // Obtener token de reseteo
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // En producción usar el primer origin permitido (URL del frontend), fallback a localhost
    const frontendUrl = env.CORS_ORIGINS.length ? env.CORS_ORIGINS[0] : 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `Has solicitado resetear tu contraseña. Por favor ve a este link para crear una nueva contraseña: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'ITUKA - Recuperación de contraseña',
        text: message,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f6f3ec; padding: 40px; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 24px;">
               <h1 style="color: #3b2e24; margin: 0; font-family: serif;">ITUKA</h1>
               <p style="color: #6a6058; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px;">Skin Care</p>
            </div>
            <div style="background-color: white; padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <h2 style="color: #3b2e24; margin-top: 0;">Recuperar contraseña</h2>
              <p style="color: #4b5563; line-height: 1.6;">Hola ${user.name},</p>
              <p style="color: #4b5563; line-height: 1.6;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en ITUKA. Si no has sido tú, puedes ignorar este mensaje.</p>
              <p style="color: #4b5563; line-height: 1.6;">Para continuar, haz clic en el siguiente botón:</p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="display: inline-block; background-image: linear-gradient(to bottom, #f1d99a, #e0bd6a); color: #2f241b; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">Restablecer contraseña</a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">Este enlace expirará en 10 minutos por seguridad.</p>
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <p style="color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} ITUKA Skin Care. Todos los derechos reservados.</p>
            </div>
          </div>
        `
      });

      res.status(200).json({ success: true, message: 'Email enviado correctamente' });
    } catch (error) {
      console.error(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: 'El email no pudo ser enviado' });
    }
  } catch (error) {
    console.error('ForgotPassword error:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    // Hashear el token enviado para compararlo con el guardado
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    // Setear nueva password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error('ResetPassword error:', error);
    res.status(500).json({ message: 'Error al resetear contraseña' });
  }
};
