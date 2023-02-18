const fs = require('fs')
const {uploadFile, __basedir} = require('../service/upload')
const errorHelper = require('../respon-helper/error.helper')
const response = require('../respon-helper/response.helper')
const { Image, Item } = require ('../db/models')


class imageController {

     async uploadImage (req, res, next) {
        try {

            const id = req.params.id
            await uploadFile(req, res)

            if(req.files == undefined){
                return res.status(400).json({
                    message: 'please upload a file'
                })
            }
            console.log(req.files)
            let images = req.files.map((item) => {
                const image = {}
                image.item_id = id
                image.url = item.filename
                
                return image
            })

            const createImage = Image.bulkCreate(images)
            if(!createImage) {
                throw new errorHelper(400, 'cannot upload image')
            }

            return new response (res, 201, 'upload image successfully')

        }
        catch(error) {
            next(error)
        }
     }

     async removeImage (req, res, next) {

        try {
            //find image yg akan dihapus
        
            const id = req.params.id
            const findImage = await Image.findOne({
                where: {id: id}
            })

            if(!findImage) {
                throw new errorHelper(404, "No image found")
            }
            
            //menghapus image di storage
            fs.unlink(__basedir + `/storage/upload/${findImage.url}`, 
                function (err)  {
                    if (err) {
                        throw new errorHelper(400, 'cannot unlink')
                    }

                    const deleteImage = Image.destroy({
                        where: {
                            id: id
                        }
                    })
                    if(deleteImage === 0) {
                        throw new errorHelper(400, 'cannot delete image')
                    }
                    
                    return new response(res, 200, 'delete image successfully')
                })
        }

        catch(error) {
            next(error)
        }
   
     }
}

module.exports = {
    imageController,
}
