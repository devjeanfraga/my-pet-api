const path = require('path')
const multer = require('multer')
const cloudnary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { MulterError } = require('multer')


  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..','uploads'))
    },
  
    filename: function (req, file , cb) {
      const fileName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname.toUpperCase())}`
      //const fileName = `${file.fieldname}-${Date.now()}-${path.extname(file.originalname)}`

      cb(null,fileName )
    }
  })

  /*
    Cloudnary-Storage
  */
    
  const  allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];

  cloudnary.config( {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudnary,
    params: async (req, file) => {
      if(!allowedFormats.includes(file.mimetype)) {
        const err = new MulterError();
        err.message = 'file of this type not allowed';
        throw err;
      }

      const fileName = `${file.fieldname}-${Date.now()}`


      return {
        folder: process.env.CLOUDINARY_FOLDER_NAME,
        formats: ['jpeg', 'png', 'jpg'],
        public_id: fileName
      }
    }
  })




  module.exports = {
    cloudnary,
    multerStorage,
    cloudinaryStorage
  }
