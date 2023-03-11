const { Image } = require('../../db/models')

const createBulkImage = (payload) => {
    return Image.bulkCreate(payload)
}

module.exports = {
    createBulkImage
}