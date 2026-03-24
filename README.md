# IANET-sistema 🌐

Este es el repositorio unificado (Monorepo) del sistema **IANET**, que incluye tanto el panel de administración como la página principal para usuarios.

## 📁 Estructura del Proyecto

El proyecto está dividido en dos aplicaciones principales construidas con **Next.js**:

*   **`ianet-panel-adm/`**: Panel de control administrativo para la gestión de citas, inventario, noticias, personal y estadísticas.
*   **`ianet-spa/`**: Página principal interactiva (Single Page Application) para que los clientes consulten servicios, vean noticias y realicen solicitudes.

---

## 🚀 Tecnologías

*   **Frontend**: Next.js (React), Tailwind CSS, Lucide React.
*   **Backend**: Next.js API Routes.
*   **Base de Datos**: MongoDB (Mongoose).
*   **Autenticación**: NextAuth.js (en el panel administrativo).

---

## 🛠️ Configuración Local

Para correr cualquiera de los proyectos localmente:

1.  Navega a la carpeta del proyecto:
    ```bash
    cd ianet-panel-adm  # o cd ianet-spa
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Configura las variables de entorno (`.env.local` en el panel, `.env` en la spa).
4.  Lanza el servidor de desarrollo:
    ```bash
    npm run dev
    ```

---

## ☁️ Despliegue (Vercel)

Este monorepo está diseñado para ser desplegado en **Vercel** como dos proyectos independientes que comparten la misma base de datos en **MongoDB Atlas**.

1.  Conecta tu repositorio en Vercel.
2.  Para cada proyecto, configura el **Root Directory** correspondiente.
3.  Añade las variables de entorno necesarias (especialmente `MONGODB_URI`).

---

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.
