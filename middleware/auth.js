const jwt = require('jsonwebtoken');

function verificarAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ msg: 'Acceso denegado, token faltante' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Token inválido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id; // guardamos el ID del admin
    next();
  } catch (err) {
    res.status(403).json({ msg: 'Token no válido o expirado' });
  }
}

module.exports = verificarAdmin;
