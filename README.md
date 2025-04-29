# Fórmula 1 - Web Components

Aplicación web de Fórmula 1 desarrollada con Web Components, Node.js y MySQL.

## 🚀 Características

- Web Components para la interfaz de usuario
- Autenticación de usuarios
- Base de datos MySQL con Docker
- API RESTful
- Validación de datos
- Manejo de sesiones

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- Docker y Docker Compose
- Git

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/formula1-web.git
cd formula1-web
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Iniciar la base de datos con Docker:
```bash
docker-compose up -d
```

5. Iniciar el servidor:
```bash
npm run dev
```

## 📦 Estructura del Proyecto

```
src/
├── modules/          # Módulos de la aplicación
│   ├── auth/        # Autenticación
│   └── pilotos/     # Gestión de pilotos
├── utils/           # Utilidades
├── config/          # Configuraciones
└── server.js        # Punto de entrada
```

## 🛠️ Tecnologías Utilizadas

- Node.js
- Express
- MySQL
- Docker
- Web Components
- bcrypt
- express-session

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## ✒️ Autores

- Tu Nombre - [@tu-usuario](https://github.com/tu-usuario)

## 📌 Versión

1.0.0
