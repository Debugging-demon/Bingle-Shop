const { cartController } = require('../controllers/cart.controller')
const router = require('express').Router()
const { tokenJwt } = require('../middlewares/authentication')



const cartcontroller = new cartController()
const tokenjwt = new tokenJwt()


//add cart
router.post('/api/cart/:id',tokenjwt.verifyToken, cartcontroller.addCart)

//show cart
router.get('/api/cart',tokenjwt.verifyToken, cartcontroller.showCart)


module.exports = router
