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
      const storedToken = localStorage.getItem('ituka_token');
      const storedUser = localStorage.getItem('ituka_user');

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        // Opcional: Validar token con backend aquí
        try {
           const data = await apiFetch('/auth/me', { token: storedToken });
           setUser(data);
           localStorage.setItem('ituka_user', JSON.stringify(data));
        } catch (error) {
           console.error("Token inválido o expirado", error);
           localStorage.removeItem('ituka_token');
           localStorage.removeItem('ituka_user');
           setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password }
      });

      localStorage.setItem('ituka_token', data.token);
      localStorage.setItem('ituka_user', JSON.stringify(data.user));
      setUser(data.user);
      
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (authResult) => {
    try {
      // authResult puede ser el objeto de useGoogleLogin (tiene access_token)
      // o un objeto con credential (si usáramos el componente GoogleLogin)
      const payload = authResult.credential 
        ? { credential: authResult.credential }
        : { accessToken: authResult.access_token };

      const data = await apiFetch('/auth/google', {
        method: 'POST',
        body: payload
      });

      localStorage.setItem('ituka_token', data.token);
      localStorage.setItem('ituka_user', JSON.stringify(data.user));
      setUser(data.user);
      
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: userData
      });

      localStorage.setItem('ituka_token', data.token);
      localStorage.setItem('ituka_user', JSON.stringify(data.user));
      setUser(data.user);

      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('ituka_token');
      const data = await apiFetch('/auth/profile', {
        method: 'PUT',
        token,
        body: profileData
      });

      // Update local storage with new user data
      // Note: The backend returns { ...user, token: ... }
      if (data.token) {
        localStorage.setItem('ituka_token', data.token);
      }
      
      // Remove token from user object before saving to state/storage if backend includes it in user object
      const { token: newToken, ...userWithoutToken } = data;
      
      localStorage.setItem('ituka_user', JSON.stringify(userWithoutToken));
      setUser(userWithoutToken);

      return userWithoutToken;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('ituka_token');
    localStorage.removeItem('ituka_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    register,
    updateProfile,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
