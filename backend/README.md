# Backend - Mi Bautizo

Backend simple para almacenar confirmaciones de asistencia en un archivo JSON.

## 🚀 Instalación

1. Navega a la carpeta backend:

```bash
cd backend
```

2. Instala las dependencias:

```bash
npm install
```

## ▶️ Uso

### Iniciar el servidor:

```bash
npm start
```

### Modo desarrollo (con auto-reload):

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

## 📡 Endpoints

### POST `/api/confirmacion`

Guarda una nueva confirmación de asistencia.

**Body:**

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "04141234567",
  "email": "juan@example.com",
  "acompanantes": 2,
  "mensaje": "Felicidades!"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Confirmación guardada exitosamente",
  "data": {
    "id": 1737328800000,
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "04141234567",
    "email": "juan@example.com",
    "acompanantes": 2,
    "mensaje": "Felicidades!",
    "fecha": "2026-01-19T23:00:00.000Z"
  }
}
```

### GET `/api/confirmaciones`

Obtiene todas las confirmaciones guardadas.

**Respuesta:**

```json
{
  "success": true,
  "data": [...],
  "total": 5
}
```

### GET `/api/estadisticas`

Obtiene estadísticas de las confirmaciones.

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "totalConfirmaciones": 5,
    "totalPersonas": 12,
    "confirmaciones": [...]
  }
}
```

## 📁 Almacenamiento

Los datos se guardan en `backend/data/confirmaciones.json`

## 🔧 Configuración

- Puerto por defecto: `3000`
- Puedes cambiar el puerto con la variable de entorno `PORT`

```bash
PORT=5000 npm start
```

## 📝 Notas

- No requiere base de datos
- Los datos se almacenan en formato JSON
- CORS habilitado para desarrollo local
- El servidor también sirve los archivos estáticos del frontend
