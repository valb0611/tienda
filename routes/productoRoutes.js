const express = require('express');
const Producto = require('../models/Producto');
const verificarAdmin = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuración de multer (carpeta /uploads dentro de tu backend)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // guarda en backend/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // nombre único
  }
});

const upload = multer({ storage });

// Obtener todos los productos (público)
router.get('/', async (req, res) => {
  const productos = await Producto.find().populate('tipo');
  res.json(productos);
});

// Crear producto (requiere admin)
router.post('/', verificarAdmin, upload.array('imagenes', 10), async (req, res) => {
  try {
    const nuevo = new Producto({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      tipo: req.body.tipo,
      imagenes: req.files ? req.files.map(f => `/uploads/${f.filename}`) : []
    });
    await nuevo.save();
    res.json(nuevo);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Editar producto (requiere admin)
router.put('/:id', verificarAdmin, upload.array('imagenes', 10), async (req, res) => {
  const data = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    tipo: req.body.tipo
  };
  if (req.files && req.files.length > 0) {
    data.imagenes = req.files.map(f => `/uploads/${f.filename}`);
  }
  const actualizado = await Producto.findByIdAndUpdate(req.params.id, data, { new: true });
  res.json(actualizado);
});


// Eliminar producto
router.delete('/:id', verificarAdmin, async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ msg: "Producto eliminado" });
});

module.exports = router;
