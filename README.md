# ITUKA - Skin Care App 🌿

Plataforma de cosmética natural.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- `frontend/`: Aplicación React + Vite + TailwindCSS
- `backend/`: API REST Node.js + Express + MongoDB

## Requisitos Previos

- Node.js (v18+)
- MongoDB (Local o Atlas)

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <URL_DEL_REPO>
   cd ituka
   ```

2. **Instalar dependencias del Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configurar Backend**
   - Copia `.env.example` a `.env`
   - Configura tu `MONGODB_URI` y credenciales de Cloudinary.

4. **Instalar dependencias del Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configurar Frontend**
   - Crea un archivo `.env` en `frontend/` con:
     ```
     VITE_API_URL=http://localhost:5050
     ```

## Ejecución

### Desarrollo
Para correr ambos servidores en paralelo (recomendado abrir dos terminales):

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## Stack Tecnológico

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Axios
- Socket.io Client

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- Socket.io
- Cloudinary (Imágenes)
- JWT (Autenticación)
