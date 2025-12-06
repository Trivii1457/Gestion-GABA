# Gestión GABA 🎩

Sistema de gestión para tienda de gorros y accesorios médicos.

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Primary | `#4E56C0` | Color principal |
| Secondary | `#9B5DE0` | Color secundario |
| Tertiary | `#D78FEE` | Acentos |
| Light | `#FDCFFA` | Fondos claros |

## 🏗️ Arquitectura

Este proyecto utiliza una **arquitectura por capas**:

```
├── backend/
│   └── src/
│       ├── controllers/    # Controladores (manejo de peticiones HTTP)
│       ├── services/       # Lógica de negocio
│       ├── repositories/   # Acceso a datos
│       ├── models/         # Modelos de Sequelize
│       ├── routes/         # Definición de rutas
│       ├── middleware/     # Middleware personalizado
│       └── config/         # Configuración
├── frontend/
│   └── src/
│       ├── components/     # Componentes reutilizables
│       ├── pages/          # Páginas de la aplicación
│       └── services/       # Servicios de API
└── docker-compose.yml
```

## 🛠️ Tecnologías

- **Backend**: Node.js + Express
- **Frontend**: React + Tailwind CSS
- **Base de datos**: PostgreSQL (Alpine)
- **Contenedores**: Docker

## 🚀 Instalación y Ejecución

### Con Docker (Recomendado)

```bash
# Construir y ejecutar todos los servicios
docker compose up --build

# En segundo plano
docker compose up -d --build
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Base de datos: localhost:5432

### Sin Docker (Desarrollo)

#### Backend
```bash
cd backend
npm install
# Configurar variables de entorno
cp .env.example .env
# Ejecutar en modo desarrollo
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 📋 Funcionalidades

### Clientes
- ✅ Crear clientes (nombre, identificación, dirección, teléfono, email)
- ✅ Listar clientes
- ✅ Editar clientes
- ✅ Eliminar clientes
- ✅ Buscar clientes por nombre o identificación

### Próximamente
- 🔜 Gestión de pedidos
- 🔜 Reportes y estadísticas

## 📖 API Endpoints

### Clientes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/clientes` | Listar todos los clientes |
| GET | `/api/clientes/:id` | Obtener un cliente |
| POST | `/api/clientes` | Crear un cliente |
| PUT | `/api/clientes/:id` | Actualizar un cliente |
| DELETE | `/api/clientes/:id` | Eliminar un cliente |

### Health Check
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Verificar estado del API |

## 📝 Licencia

MIT
