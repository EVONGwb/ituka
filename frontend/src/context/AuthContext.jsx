import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Intentar leer de localStorage primero, luego sessionStorage
      const storedToken = localStorage.getItem('ituka_token') || sessionStorage.getItem('ituka_token');
      const storedUser = localStorage.getItem('ituka_user') || sessionStorage.getItem('ituka_user');

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        // Opcional: Validar token con backend aquí
        try {
           const data = await apiFetch('/auth/me', { token: storedToken });
           setUser(data);
           // Actualizar en el storage correspondiente
           if (localStorage.getItem('ituka_token')) {
             localStorage.setItem('ituka_user', JSON.stringify(data));
           } else {
             sessionStorage.setItem('ituka_user', JSON.stringify(data));
           }
        } catch (error) {
           console.error("Token inválido o expirado", error);
           localStorage.removeItem('ituka_token');
           localStorage.removeItem('ituka_user');
           sessionStorage.removeItem('ituka_token');
           sessionStorage.removeItem('ituka_user');
           setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, remember = false) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    const storage = remember ? localStorage : sessionStorage;

    if (remember) {
      sessionStorage.removeItem('ituka_token');
      sessionStorage.removeItem('ituka_user');
    } else {
      localStorage.removeItem('ituka_token');
      localStorage.removeItem('ituka_user');
    }

    storage.setItem('ituka_token', data.token);
    storage.setItem('ituka_user', JSON.stringify(data.user));
    setUser(data.user);
    
    return data.user;
  };

  const register = async (userData) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: userData
    });

    localStorage.setItem('ituka_token', data.token);
    localStorage.setItem('ituka_user', JSON.stringify(data.user));
    setUser(data.user);

    return data.user;
  };

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('ituka_token');
    const data = await apiFetch('/auth/profile', {
      method: 'PUT',
      token,
      body: profileData
    });

    if (data.token) {
      localStorage.setItem('ituka_token', data.token);
    }

    const { token: _token, ...userWithoutToken } = data;
    localStorage.setItem('ituka_user', JSON.stringify(userWithoutToken));
    setUser(userWithoutToken);

    return userWithoutToken;
  };

  const forgotPassword = async (email) => {
    await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: { email }
    });
  };

  const resetPassword = async (token, password) => {
    const data = await apiFetch(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: { password }
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ituka_token');
    localStorage.removeItem('ituka_user');
    sessionStorage.removeItem('ituka_token');
    sessionStorage.removeItem('ituka_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    updateProfile,
    logout,
    loading,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
