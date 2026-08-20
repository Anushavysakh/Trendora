// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "trendora-products",
//     allowed_formats: ["jpg", "jpeg", "png", "webp"]
//   }
// });

// const upload = multer({
//   storage
// });

// module.exports = upload;


const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

console.log("CloudinaryStorage =", CloudinaryStorage);
console.log("cloudinary =", typeof cloudinary);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "trendora-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;