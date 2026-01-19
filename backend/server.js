const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "confirmaciones.json");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

// Asegurar que el directorio de datos existe
async function ensureDataDirectory() {
  const dataDir = path.join(__dirname, "data");
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  // Crear archivo JSON si no existe
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Leer confirmaciones
async function readConfirmaciones() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo confirmaciones:", error);
    return [];
  }
}

// Guardar confirmaciones
async function saveConfirmaciones(confirmaciones) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(confirmaciones, null, 2));
    return true;
  } catch (error) {
    console.error("Error guardando confirmaciones:", error);
    return false;
  }
}

// Endpoint para guardar confirmación
app.post("/api/confirmacion", async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, acompanantes, mensaje } =
      req.body;

    // Validar datos requeridos
    if (!nombre || !apellido || !telefono || !email) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos requeridos",
      });
    }

    // Leer confirmaciones existentes
    const confirmaciones = await readConfirmaciones();

    // Crear nueva confirmación
    const nuevaConfirmacion = {
      id: Date.now(),
      nombre,
      apellido,
      telefono,
      email,
      acompanantes: parseInt(acompanantes) || 0,
      mensaje: mensaje || "",
      fecha: new Date().toISOString(),
    };

    // Agregar y guardar
    confirmaciones.push(nuevaConfirmacion);
    const saved = await saveConfirmaciones(confirmaciones);

    if (saved) {
      res.json({
        success: true,
        message: "Confirmación guardada exitosamente",
        data: nuevaConfirmacion,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Error al guardar la confirmación",
      });
    }
  } catch (error) {
    console.error("Error en POST /api/confirmacion:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
});

// Endpoint para obtener todas las confirmaciones
app.get("/api/confirmaciones", async (req, res) => {
  try {
    const confirmaciones = await readConfirmaciones();
    res.json({
      success: true,
      data: confirmaciones,
      total: confirmaciones.length,
    });
  } catch (error) {
    console.error("Error en GET /api/confirmaciones:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener confirmaciones",
    });
  }
});

// Endpoint para obtener estadísticas
app.get("/api/estadisticas", async (req, res) => {
  try {
    const confirmaciones = await readConfirmaciones();
    const totalConfirmaciones = confirmaciones.length;
    const totalPersonas = confirmaciones.reduce((sum, conf) => {
      return sum + 1 + parseInt(conf.acompanantes || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        totalConfirmaciones,
        totalPersonas,
        confirmaciones: confirmaciones.map((c) => ({
          nombre: `${c.nombre} ${c.apellido}`,
          acompanantes: c.acompanantes,
          fecha: c.fecha,
        })),
      },
    });
  } catch (error) {
    console.error("Error en GET /api/estadisticas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
    });
  }
});

// Iniciar servidor
async function startServer() {
  await ensureDataDirectory();
  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📁 Datos guardados en: ${DATA_FILE}`);
  });
}

startServer();
