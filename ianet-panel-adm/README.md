# Panel Administrativo IANET

Panel de administración interno para el **Instituto de Alimentación y Nutrición del Estado Trujillo (IANET)**. Este sistema permite la gestión integral de las operaciones internas del instituto y facilita la interacción con el sitio web público.

## Sobre IANET

El Instituto de Alimentación y Nutrición del Estado Trujillo es una institución gubernamental dedicada a la promoción de la alimentación saludable y la nutrición en el estado Trujillo, Venezuela.

## Características Principales

### Dashboard
- **Estadísticas en tiempo real**: Noticias publicadas, mensajes nuevos, citas del día y control de stock
- **Acceso rápido** a las funcionalidades más utilizadas
- **Vista general** del estado del sistema

### Gestión de Noticias
- Crear, editar y publicar noticias
- Control de estado (borrador, publicada)
- Integración con el sitio web público

### Gestión de Contacto
- Administrar mensajes recibidos desde el sitio web
- Seguimiento de consultas ciudadanas
- Estados de respuesta

### Sistema de Citas
- Gestión de citas médicas y consultas
- Programación y seguimiento
- Estados de citas (solicitada, confirmada, completada)

### Control de Inventario
- Gestión de productos y suministros
- Control de stock y alertas de bajo inventario
- Categorización de productos

### Gestión de Eventos
- Crear y administrar eventos del instituto
- Programación de actividades
- Gestión de participantes

### Gestión de Personal
- Administración del personal del instituto
- Roles y permisos
- Información de contacto

## Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Autenticación**: NextAuth.js
- **UI Components**: Radix UI, Lucide React
- **Formularios**: React Hook Form, Zod
- **Base de Datos**: MongoDB

## Requisitos del Sistema

- Node.js 18+ 
- MongoDB
- npm o pnpm

## Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env.local` en la raíz del proyecto:

```env
MONGODB_URI=mongodb://localhost:27017/ianet-admin
AUTH_SECRET=tu-secreto-super-seguro-aqui
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_PAID_FEATURES=news,contact,appointments,staff,inventory,events
```

> [!TIP]
> **¿No tienes MongoDB instalado?** Puedes usar [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratis) para obtener una `MONGODB_URI` en la nube. Esto evitará errores de conexión local (`ECONNREFUSED`).

## 🗄️ Configuración de Base de Datos

El sistema requiere MongoDB para funcionar. Tienes dos opciones principales:

### Opción A: MongoDB Atlas (Recomendado)
Es la opción más sencilla y no requiere instalar nada en tu computadora.
1. Regístrate en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Crea un **clúster gratuito** y un usuario de base de datos.
3. En la sección "Network Access", agrega tu IP o `0.0.0.0/0` (permitir acceso desde cualquier lugar).
4. Obtén tu cadena de conexión (URI) y pégala en `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster.mongodb.net/ianet-admin
   ```

### Opción B: MongoDB Local (Community Server)
1. Descarga e instala [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2. Asegúrate de que el servicio esté iniciado:
   - **Windows**: `net start MongoDB` (en CMD como Administrador).
   - **Linux/Mac**: `sudo systemctl start mongod`.
3. Tu URI por defecto será:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ianet-admin
   ```

### 🧭 Uso con MongoDB Compass
Si prefieres usar Compass para gestionar la conexión:
1. Abre MongoDB Compass y conéctate a tu base de datos (local o Atlas).
2. En la parte superior, verás la **Connection String**.
3. Haz clic en el ícono de copiar y pega ese valor en tu archivo `.env.local` bajo la variable `MONGODB_URI`.

> [!IMPORTANT]
> **MongoDB Compass vs Server**: MongoDB Compass es solo una herramienta visual (interfaz). Tener Compass instalado **no significa** que tengas el servidor de la base de datos corriendo. Debes tener el "MongoDB Community Server" activo o usar un clúster en la nube (Atlas).

> [!WARNING]
> Si recibes el error `ECONNREFUSED 127.0.0.1:27017`, significa que MongoDB no está instalado o el servicio no ha iniciado correctamente.

### 4. Crear usuario administrador

```bash
# Ejecutar script de inicialización
npm run seed
```

**Credenciales por defecto:**
- **Email**: admin@ianet.gob.ve
- **Contraseña**: admin123

⚠️ **IMPORTANTE**: Cambiar la contraseña después del primer login.

### 5. Ejecutar el proyecto
```bash
npm run dev
```

El panel estará disponible en: `http://localhost:3000/admin`

## 🔐 Autenticación y Seguridad

### Roles de Usuario
- **Admin**: Acceso completo a todas las funcionalidades
- **Editor**: Acceso limitado para edición de contenido

### Seguridad
- Autenticación obligatoria para todas las rutas administrativas
- Encriptación de contraseñas con bcrypt
- Validación de datos con Zod
- Middleware de protección de rutas


## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Ejecutar en producción
npm run start

# Linting
npm run lint

# Crear usuario admin
npm run seed
```

## API Endpoints

### Administrativos
- `GET/POST /api/admin/appointments` - Gestión de citas
- `GET/POST /api/admin/contact` - Gestión de contacto
- `GET/POST /api/admin/events` - Gestión de eventos
- `GET/POST /api/admin/inventory` - Control de inventario
- `GET/POST /api/admin/news` - Gestión de noticias
- `GET/POST /api/admin/staff` - Gestión de personal

### Públicos
- `GET /api/public/appointments` - Consulta de citas
- `POST /api/public/contact` - Envío de mensajes
- `GET /api/public/news` - Noticias públicas

## 🎨 Personalización

### Colores del Tema
El panel utiliza una paleta de colores institucional:
- **Verde principal**: `#16a34a` (IANET)
- **Grises**: Para elementos secundarios
- **Estados**: Verde (éxito), Azul (info), Naranja (advertencia)

### Componentes UI
Basado en Radix UI con Tailwind CSS para una experiencia moderna y accesible.

## Responsive Design

El panel está optimizado para:
- **Desktop**: Experiencia completa
- **Tablet**: Navegación adaptada
- **Mobile**: Vista simplificada

## Integración con Sitio Web

El panel se integra con el sitio web público de IANET para:
- Sincronización de noticias
- Gestión de formularios de contacto
- Programación de citas públicas
- Publicación de eventos

## Despliegue

### Variables de Entorno de Producción
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ianet-admin
AUTH_SECRET=secreto-super-seguro-produccion
NEXTAUTH_URL=https://admin.ianet.gob.ve
```

### Plataformas Recomendadas
- **Vercel**: Para despliegue automático
- **Netlify**: Alternativa robusta
- **Servidor propio**: Con Docker

