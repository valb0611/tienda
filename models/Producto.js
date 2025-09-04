const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  imagenes: [String], 
  tipo: { type: mongoose.Schema.Types.ObjectId, ref: 'TipoProducto' }
});

module.exports = mongoose.model('Producto', productoSchema);
