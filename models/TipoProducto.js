const mongoose = require('mongoose');

const tipoProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true }
});

module.exports = mongoose.model('TipoProducto', tipoProductoSchema);
