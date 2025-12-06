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

#### Variables de entorno para producción

Para producción, configura las siguientes variables de entorno antes de ejecutar:

```bash
export DB_USER=tu_usuario
export DB_PASSWORD=tu_contraseña_segura
export DB_NAME=gaba_db
export NODE_ENV=production
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

### Productos y Stock
- ✅ Crear productos con información básica (nombre, descripción, precio, SKU)
- ✅ Registrar y actualizar stock disponible
- ✅ Categorizar productos por tipo de accesorio médico
- ✅ Gestión de categorías

### Pedidos
- ✅ Crear pedidos asociados a clientes
- ✅ Visualizar todos los pedidos
- ✅ Filtrar pedidos por estado (pendiente, en proceso, completado, cancelado)
- ✅ Cálculo automático del monto total según productos y cantidades

### Sistema de Abonos/Pagos
- ✅ Registrar pagos parciales (abonos) sobre el monto total
- ✅ Historial completo de abonos con fecha y método de pago
- ✅ Saldo pendiente actualizado automáticamente

### Reportes Financieros
- ✅ Total cobrado (suma de todos los abonos)
- ✅ Total pendiente por cobrar
- ✅ Resumen general del estado financiero
- ✅ Estadísticas de pedidos por estado

## 📖 API Endpoints

### Clientes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/clientes` | Listar todos los clientes |
| GET | `/api/clientes/:id` | Obtener un cliente |
| POST | `/api/clientes` | Crear un cliente |
| PUT | `/api/clientes/:id` | Actualizar un cliente |
| DELETE | `/api/clientes/:id` | Eliminar un cliente |

### Categorías
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categorias` | Listar todas las categorías |
| GET | `/api/categorias/:id` | Obtener una categoría |
| POST | `/api/categorias` | Crear una categoría |
| PUT | `/api/categorias/:id` | Actualizar una categoría |
| DELETE | `/api/categorias/:id` | Eliminar una categoría |

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Listar todos los productos |
| GET | `/api/productos/:id` | Obtener un producto |
| GET | `/api/productos/categoria/:categoriaId` | Productos por categoría |
| POST | `/api/productos` | Crear un producto |
| PUT | `/api/productos/:id` | Actualizar un producto |
| PATCH | `/api/productos/:id/stock` | Actualizar stock |
| DELETE | `/api/productos/:id` | Eliminar un producto |

### Pedidos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pedidos` | Listar todos los pedidos |
| GET | `/api/pedidos/:id` | Obtener un pedido con detalles |
| GET | `/api/pedidos/cliente/:clienteId` | Pedidos de un cliente |
| GET | `/api/pedidos/estado/:estado` | Pedidos por estado |
| GET | `/api/pedidos/reporte` | Reporte financiero |
| POST | `/api/pedidos` | Crear un pedido |
| PUT | `/api/pedidos/:id` | Actualizar un pedido |
| PATCH | `/api/pedidos/:id/estado` | Actualizar estado |
| DELETE | `/api/pedidos/:id` | Eliminar un pedido |

### Abonos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/abonos` | Listar todos los abonos |
| GET | `/api/abonos/:id` | Obtener un abono |
| GET | `/api/abonos/pedido/:pedidoId` | Abonos de un pedido |
| POST | `/api/abonos` | Registrar un abono |
| PUT | `/api/abonos/:id` | Actualizar un abono |
| DELETE | `/api/abonos/:id` | Eliminar un abono |

### Health Check
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Verificar estado del API |

## 📝 Licencia

MIT
