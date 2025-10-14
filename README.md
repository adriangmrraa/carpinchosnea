# CARPINCHOS DECIDEN - Participación Vecinal NEA

MVP web para participación ciudadana en el NEA (Noreste Argentino), Argentina. Permite a vecinos visualizar proyectos/ideas de ley, votar a favor/en contra, publicar proyectos propios y ver perfil con actividad. **Sin autenticación real**: usa UID local persistente por navegador.

## 🚀 Despliegue en Render

### Preparación
1. Sube todo el contenido de `app/` al root de tu repo GitHub: `https://github.com/adriangmrraa/carpinchosnea.git`
2. Crea un archivo `.env` en el root del repo con:
   ```
   VITE_API_BASE=https://tu-app-en-render.onrender.com/api
   ```

### Despliegue
1. Ve a [Render.com](https://render.com) y conecta tu repo GitHub.
2. Crea un nuevo **Web Service**:
   - **Runtime**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Production
3. Configura variables de entorno en Render:
   - `NODE_ENV=production`
   - `RENDER=true` (para usar /tmp en DB)
4. Deploy! La app estará disponible en `https://tu-app-en-render.onrender.com`

## 🛠 Desarrollo Local

### Instalación
```bash
cd app
npm install
```

### Ejecutar
```bash
# Desarrollar
npm run dev

# Seeds iniciales
npm run seed

# Reset DB
npm run reset:db
```

### URLs
- Cliente: `http://localhost:5174`
- Servidor: `http://localhost:3000`

## 📋 Características
- ✅ Feed paginado con búsqueda y orden
- ✅ Votación optimista con rollback
- ✅ Creación de proyectos con validación
- ✅ Perfil filtrado por UID local
- ✅ Animaciones fluidas con Framer Motion
- ✅ Responsive mobile-first
- ✅ Accesibilidad completa (ARIA, foco)
- ✅ Persistencia JSON local

## 🏗 Stack
- **Frontend**: React 19 + Vite + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + lowdb
- **Persistencia**: JSON local (efímera en Render)