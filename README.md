# CryptoTradeExpress 🚀

¡Bienvenido a **CryptoTradeExpress**! Una plataforma integral diseñada para simular trading, analizar el mercado de criptomonedas y aprender sobre el ecosistema financiero digital.

## 🌟 Características Principales

*   **Simulador de Trading**: Practica tus estrategias de inversión sin riesgo utilizando dinero virtual en un entorno realista.
*   **Predicciones de Mercado**: Accede a análisis y predicciones de precios potenciados por algoritmos para tomar decisiones informadas.
*   **Noticias en Tiempo Real**: Mantente al día con las últimas novedades y tendencias del mundo crypto.
*   **Chat de Comunidad**: Interactúa, debate y comparte conocimientos con otros traders en tiempo real.
*   **Gestión de Portafolio**: Rastrea el rendimiento de tus activos y diversifica tu cartera de manera eficiente.
*   **Recursos Educativos**: Aprende los fundamentos y estrategias avanzadas a través de videos y quizzes interactivos.

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido sobre un stack tecnológico moderno, robusto y escalable:

### Backend 🐍
*   **Django & Django REST Framework**: El núcleo de nuestra API y lógica de negocio, proporcionando seguridad y rapidez.
*   **Celery**: Manejo de tareas asíncronas y procesamiento en segundo plano para operaciones pesadas.
*   **Django Channels**: Soporte para WebSockets, permitiendo funcionalidades en tiempo real como el chat y actualizaciones de precios.
*   **PostgreSQL**: Base de datos relacional confiable para la integridad de los datos.

### Frontend ⚛️
*   **React**: Biblioteca líder para construir interfaces de usuario dinámicas e interactivas.
*   **Vite**: Herramienta de construcción de próxima generación para un desarrollo frontend ultrarrápido.
*   **Tailwind CSS**: Framework de estilos "utility-first" para un diseño moderno, limpio y totalmente responsivo.
*   **Redux Toolkit**: Gestión eficiente y predecible del estado global de la aplicación.
*   **Chart.js & Plotly**: Potentes librerías para la visualización de datos financieros y gráficos interactivos.

## 🚀 Cómo Correr el Proyecto Localmente

Sigue estos sencillos pasos para levantar el entorno de desarrollo en tu máquina local.

### Prerrequisitos
Asegúrate de tener instalado:
*   [Python 3.8+](https://www.python.org/)
*   [Node.js 16+](https://nodejs.org/)
*   [Redis](https://redis.io/) (Requerido para Celery y Channels)

### 1. Configuración del Backend

Navega al directorio del backend:

```bash
cd backend
```

Crea y activa un entorno virtual para aislar las dependencias:

```bash
# En macOS/Linux
python3 -m venv env
source env/bin/activate

# En Windows
python -m venv env
.\env\Scripts\activate
```

Instala las dependencias del proyecto:

```bash
pip install -r requirements.txt
```

Configura las variables de entorno (si es necesario) y ejecuta las migraciones de la base de datos:

```bash
python manage.py migrate
```

Inicia el servidor de desarrollo:

```bash
python manage.py runserver
```
El backend estará corriendo en `http://127.0.0.1:8000/`.

### 2. Configuración del Frontend

Abre una nueva terminal y navega al directorio del cliente:

```bash
cd client
```

Instala las dependencias de Node:

```bash
npm install
```

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

¡Listo! Abre tu navegador en la URL que te indique la terminal (usualmente `http://localhost:5173`) para ver **CryptoTradeExpress** en acción.
