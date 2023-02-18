const { cartController } = require('../controller/cart.controller')
const router = require('express').Router()
const { tokenJwt, itemCek } = require('../middleware')


const cartcontroller = new cartController()
const tokenjwt = new tokenJwt()
const itemcek = new itemCek()

//add cart
router.post('/api/cart/:id',tokenjwt.verifyToken,itemcek.itemStokCart, cartcontroller.addCart)

//show cart
router.get('/api/cart',tokenjwt.verifyToken, cartcontroller.showCart)


module.exports = router
