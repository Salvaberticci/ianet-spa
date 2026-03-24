# IANET - Instituto de Alimentación y Nutrición del Estado Trujillo

Single Page Application (SPA) informativa para el Instituto de Alimentación y Nutrición del Estado Trujillo.

## Características

- Información institucional (Quiénes somos, Servicios)
- Sistema de noticias con listado y detalle
- Formulario de solicitud de citas médicas/nutricionales
- Formulario de contacto
- Diseño responsive con Tailwind CSS
- Arquitectura Atomic Design

## Requisitos Previos

- Node.js 16+ y npm

## Instalación
1. Instalar dependencias:

\`\`\`bash
npm install
\`\`\`

3. Crear archivo `.env` en la raíz del proyecto:

\`\`\`env
REACT_APP_API_BASE_URL=http://localhost:3001
\`\`\`

## Scripts Disponibles

### `npm run dev` o `npm start`

Ejecuta la aplicación en modo desarrollo.
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### `npm run build`

Construye la aplicación para producción en la carpeta `build`.

## Estructura del Proyecto

\`\`\`
src/
├── components/
│   ├── atoms/          # Componentes básicos (Button, Input, Card)
│   ├── molecules/      # Componentes compuestos (Navbar, Footer)
│   └── organisms/      # Componentes complejos (HeroCarousel)
├── pages/              # Páginas de la aplicación
├── services/           # Servicios de API
├── hooks/              # Custom hooks
├── utils/              # Utilidades y validaciones
└── App.jsx             # Componente principal
\`\`\`

## API Endpoints

La aplicación consume los siguientes endpoints públicos:

- `POST /api/public/appointments` - Crear solicitud de cita
- `GET /api/public/news` - Listar noticias
- `GET /api/public/news/:id` - Detalle de noticia
- `POST /api/public/contact` - Enviar mensaje de contacto

## Variables de Entorno

- `REACT_APP_API_BASE_URL` - URL base del API backend (requerido)

## Tecnologías

- React 18
- React Router 6
- Tailwind CSS 4
- JavaScript (ES6+)

## Licencia

© 2025 IANET. Todos los derechos reservados.
