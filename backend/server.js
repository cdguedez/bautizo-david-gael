const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "confirmaciones.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

async function ensureDataDirectory() {
  const dataDir = path.join(__dirname, "data");
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

async function readConfirmaciones() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo confirmaciones:", error);
    return [];
  }
}

async function saveConfirmaciones(confirmaciones) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(confirmaciones, null, 2));
    return true;
  } catch (error) {
    console.error("Error guardando confirmaciones:", error);
    return false;
  }
}

app.post("/api/confirmacion", async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, acompanantes, mensaje } =
      req.body;

    if (!nombre || !apellido || !telefono || !email) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos requeridos",
      });
    }

    const confirmaciones = await readConfirmaciones();

    const duplicadoEmail = confirmaciones.find(
      (c) => c.email.toLowerCase() === email.toLowerCase(),
    );
    const duplicadoTelefono = confirmaciones.find(
      (c) => c.telefono === telefono,
    );

    if (duplicadoEmail) {
      return res.status(409).json({
        success: false,
        message: "Ya existe una confirmación con este correo electrónico",
        duplicate: true,
      });
    }

    if (duplicadoTelefono) {
      return res.status(409).json({
        success: false,
        message: "Ya existe una confirmación con este número de teléfono",
        duplicate: true,
      });
    }

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

async function startServer() {
  await ensureDataDirectory();
  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`📁 Datos guardados en: ${DATA_FILE}`);
  });
}

startServer();
