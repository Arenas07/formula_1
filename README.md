# Fórmula 1 - Web Components

Aplicación web de Fórmula 1 desarrollada con Web Components, Node.js y MongoDB.

## 🚀 Características

- Web Components para la interfaz de usuario
- Autenticación de usuarios
- Base de datos MongoDB con Docker
- API RESTful
- Validación de datos
- Manejo de sesiones
- Documentación Swagger

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- Docker y Docker Compose
- Git
- MongoDB (opcional, se puede usar con Docker)

## 🔧 Instalación y Despliegue Local

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/formula1-web.git
cd formula1-web
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
# Crear archivo .env basado en el ejemplo
cp .env.example .env

# Editar .env con las siguientes variables:
MONGODB_URI=mongodb://formula1_user:formula1_password@localhost:27017/formula1_db?authSource=admin
SESSION_SECRET=tu_secreto_seguro
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
```

### 4. Iniciar Base de Datos con Docker
```bash
# Iniciar MongoDB y la aplicación
docker-compose up -d

# Verificar que los contenedores estén corriendo
docker-compose ps
```

### 5. Inicializar la Base de Datos
```bash
# Ejecutar script de inicialización
npm run init-db
```

### 6. Iniciar el Servidor
```bash
# Modo desarrollo (con nodemon para recarga automática)
npm run dev

# Modo producción
npm start
```

### 7. Verificar la Instalación
- El servidor estará corriendo en: http://localhost:3000
- La documentación de la API estará disponible en: http://localhost:3000/api-docs
- El endpoint de salud estará disponible en: http://localhost:3000/health

## 📦 Estructura del Proyecto

```
src/
├── modules/          # Módulos de la aplicación
│   ├── auth/        # Autenticación
│   │   ├── controller/    # Controladores
│   │   ├── service/       # Lógica de negocio
│   │   ├── infraestructure/ # Persistencia
│   │   └── scream/        # Validaciones
│   └── example/     # Ejemplo de módulo
├── utils/           # Utilidades
│   ├── middleware/  # Middleware de autenticación
│   └── security/    # Funciones de seguridad
├── config/          # Configuraciones
│   ├── data/        # Configuración del servidor
│   ├── cors/        # Configuración CORS
│   └── swagger/     # Documentación API
└── server.js        # Punto de entrada
```

## 🛠️ Tecnologías Utilizadas

- Node.js
- Express
- MongoDB
- Docker
- Web Components
- bcrypt
- express-session
- Swagger UI
- express-validator

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## ✒️ Autores

- Tu Nombre - [@tu-usuario](https://github.com/tu-usuario)

## 📌 Versión

1.0.0
