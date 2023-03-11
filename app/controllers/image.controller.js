const fs = require('fs')
const {uploadFile, __basedir} = require('../services/upload')
const { imageQueries } = require('../queries')
const message = require('../../response-helpers/messages').MESSAGE
const responseHendler = require('../../response-helpers/error-helper')


class imageController {

     async uploadImage (req, res, next) {
        try {

            const id = req.params.id
            
            //deploy storage dicloudinary
            await uploadFile(req, res)
    
            if(req.files === undefined) { return responseHendler.badRequest(res, message('images').incompleteKeyOrValue)}

            //use to bulk upload
            let images = req.files.map((item) => {
                const image = {}
                image.item_id = id
                image.url = item.path
                
                return image
            })

            const createImage = await imageQueries.createBulkImage(images)
            if(!createImage) { return responseHendler.badRequest(res, message('create images').invalidCreateResource)}

            return responseHendler.ok(res, message('images').created)

        }
        catch(err) {
            const key = err.message
            return responseHendler.internalError(res, message(key).errorMessage)
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
