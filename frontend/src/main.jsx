import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// Componente Home temporal
function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-20 bg-green-50 rounded-3xl">
        <h1 className="text-5xl font-bold text-stone-900 mb-6">Descubre la esencia de <span className="text-green-700">ITUKA</span></h1>
        <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-8">
          Cosmética natural, artesanal y consciente. Cuida tu piel mientras cuidas el planeta.
        </p>
        <button className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition">
          Ver Productos
        </button>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-stone-900 mb-8">Destacados</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition">
              <div className="aspect-square bg-stone-100 rounded-lg mb-4"></div>
              <h3 className="font-bold text-lg mb-2">Aceite Esencial Puro</h3>
              <p className="text-stone-500 mb-4">100% Orgánico • 30ml</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-green-800">24.00€</span>
                <button className="text-green-700 font-medium hover:underline">Añadir</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Dashboard />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
