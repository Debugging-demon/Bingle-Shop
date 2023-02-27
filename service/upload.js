const multer = require('multer')
const { cloudinary } = require('../config/cloudinary')
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const util = require('util')
const path = require('path')
const __basedir = path.resolve()

const imageFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb (null, true)
    }else {
        cb('please upload only images', false)
    }
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "bingleshop",
        format: async (req, file) => {
            "jpg", "png"
        }, // supports promises as well
        public_id: (req, file) => {
            console.log(
                new Date().toISOString().replace(/:/g, "-") + file.originalname
            )
            return (
                new Date().toISOString().replace(/:/g, "-") + file.originalname
            )
        }
    }
})

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, __basedir + '/storage/upload')
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`) //
//     },
// })

const uploadImage =  multer({
    storage: storage,
    fileFilter: imageFilter,
}).array('file',5) //untuk menentukan banyak image yg bisa diupload

let uploadFile = util.promisify(uploadImage)

module.exports = {
    uploadFile,
    __basedir,
}