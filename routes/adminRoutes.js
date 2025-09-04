const express = require('express');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { usuario, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const nuevoAdmin = new Admin({ usuario, password: hashed });
  await nuevoAdmin.save();
  res.json({ mensaje: 'Admin creado' });
});

// Login admin
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;
  const admin = await Admin.findOne({ usuario });
  if (!admin) return res.status(400).json({ error: 'Usuario no encontrado' });

  const valido = await bcrypt.compare(password, admin.password);
  if (!valido) return res.status(400).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
