const { imageController } = require('../controller/image.controller')
const router = require('express').Router()
const { tokenJwt } = require('../middleware')

const imagecontroller = new imageController()
const tokenjwt = new tokenJwt()

router.post('/api/image/:id', tokenjwt.verifyToken, tokenjwt.otorisasi, imagecontroller.uploadImage)
router.delete('/api/image/:id', tokenjwt.verifyToken, tokenjwt.otorisasi, imagecontroller.removeImage)

module.exports = router