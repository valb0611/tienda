const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "productos", // carpeta en Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // formatos permitidos
    transformation: [{ width: 800, height: 800, crop: "limit" }], // opcional: limitar tamaño
  },
});

// Configurar Multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // máximo 5MB por archivo
});

module.exports = upload;
