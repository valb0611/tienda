const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require("path");

// Importar rutas
const adminRoutes = require('./routes/adminRoutes');
const productoRoutes = require('./routes/productoRoutes');
const tipoProductoRoutes = require('./routes/tipoProductoRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/admin', adminRoutes);
app.use('/productos', productoRoutes);
app.use('/tipos', tipoProductoRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Puerto dinámico (Render asigna uno en process.env.PORT)
const PORT = process.env.PORT || 3001;

// Conectar a MongoDB y luego iniciar el servidor
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "tienda", // 👈 así fuerzas a que use la BD "tienda"
    });
    console.log("✅ MongoDB conectado a Atlas");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    process.exit(1);
  }
}

startServer();
