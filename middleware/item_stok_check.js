const { Item, Item_cart, Cart } = require('../db/models')
const errorHelper = require('../respon-helper/error.helper')
class itemCek {

    async itemStokCart (req, res, next) {

        try{
        //find item by req.params.id table item
            const id = req.params.id
            const qty = req.body.quantity_order
        //cek stock dari item (quantity)
            const findItem = await Item.findOne({
                where: {id:id}
            })
        // membuat perandingan antara item.quantity dan req.body.quantity_item dari table cart_item
            if(findItem.quantity < qty) {
                throw new errorHelper(400,'sorry, quantity item is too low' )
            }
            next()
        }
        catch(err){
            next(err)
        }
    }
    async itemStokOrder(req, res, next) {
        try{
            //cek cart dengan status pending
            const findCart = await Cart.findOne({
                where: {
                    status_cart: 'pending',
                    user_id: req.userId
                }
            })
            if(!findCart) {
                throw new errorHelper(404, "not found order")
            }
            //cek quantity_order di table Item_cart
            const findItemcart = await Item_cart.findAll({
                where: {cart_id: findCart.id}
            })
            //cek quantity di table item
            //bandingkan
            for (let item of findItemcart) {
                const findItem = await Item.findOne({where: {id: item.item_id}})
                if(item.quantity_order > findItem.quantity) {
                    throw new errorHelper(400, 'sorry, quantity item is too low')
                }
            }
            next ()
        }
        catch(err) {
            next(err)
        }
    }
}

module.exports = {
    itemCek,
}