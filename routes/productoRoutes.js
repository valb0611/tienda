const express = require("express");
const Producto = require("../models/Producto");
const verificarAdmin = require("../middleware/auth");
const upload = require("../middleware/cloudinary"); // ✅ Multer + Cloudinary
const cloudinary = require("cloudinary").v2;
const router = express.Router();

// Función para eliminar imágenes de Cloudinary
async function eliminarImagenCloudinary(url) {
  // Extrae el public_id de la URL
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.(?:jpg|jpeg|png|webp|gif|svg)$/i);
  if (match && match[1]) {
    await cloudinary.uploader.destroy(match[1]);
  }
}

// Crear producto
router.post("/", verificarAdmin, upload.array("imagenes", 10), async (req, res) => {
  try {
    const nuevo = new Producto({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      tipo: req.body.tipo,
      imagenes: req.files ? req.files.map(f => f.path) : [],
    });
    await nuevo.save();
    res.json(nuevo);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Editar producto
router.put("/:id", verificarAdmin, upload.array("imagenes", 10), async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    const data = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      tipo: req.body.tipo,
    };

    if (req.files && req.files.length > 0) {
      // Eliminar imágenes antiguas
      if (producto.imagenes && producto.imagenes.length > 0) {
        for (const url of producto.imagenes) {
          await eliminarImagenCloudinary(url);
        }
      }
      // Guardar nuevas imágenes
      data.imagenes = req.files.map(f => f.path);
    }

    const actualizado = await Producto.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find().populate("tipo");
    res.json(productos);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Eliminar producto + imágenes
router.delete("/:id", verificarAdmin, async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    if (producto.imagenes && producto.imagenes.length > 0) {
      for (const url of producto.imagenes) {
        await eliminarImagenCloudinary(url);
      }
    }

    await Producto.findByIdAndDelete(req.params.id);
    res.json({ msg: "Producto y sus imágenes eliminadas" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
