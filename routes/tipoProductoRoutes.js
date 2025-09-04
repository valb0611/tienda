const express = require('express');
const TipoProducto = require('../models/TipoProducto');
const verificarAdmin = require('../middleware/auth');
const router = express.Router();

// Obtener tipos (público)
router.get('/', async (req, res) => {
  const tipos = await TipoProducto.find();
  res.json(tipos);
});

// Crear tipo (requiere admin)
router.post('/', verificarAdmin, async (req, res) => {
  const nuevo = new TipoProducto(req.body);
  await nuevo.save();
  res.json(nuevo);
});

// Editar tipo (requiere admin)
router.put('/:id', verificarAdmin, async (req, res) => {
  const actualizado = await TipoProducto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizado);
});

// Eliminar tipo (requiere admin)
router.delete('/:id', verificarAdmin, async (req, res) => {
  await TipoProducto.findByIdAndDelete(req.params.id);
  res.json({ msg: "Tipo de producto eliminado" });
});

module.exports = router;
