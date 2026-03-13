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

## Deploy (Vercel + Render)

### Frontend (Vercel) con GitHub Actions

Este repo incluye un workflow en `.github/workflows/vercel-frontend.yml` que:
- crea deploy de **preview** en cada PR
- crea deploy de **producción** en cada push a `main`/`master` (solo si hay cambios en `frontend/`)

Configura estos *Secrets* en GitHub (Settings → Secrets and variables → Actions):
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Los IDs actuales del proyecto (según `.vercel/project.json`) son:
- `VERCEL_ORG_ID=team_c3HqdYuIn1L12BF2Dy29vAaX`
- `VERCEL_PROJECT_ID=prj_8bPud6T7fYgY8V2OmzrMMGaRWOcc`
