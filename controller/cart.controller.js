const { Item, Cart, Item_cart } = require('../db/models')
const user = require('../db/models/users.model')
const errorHelper = require('../respon-helper/error.helper')
const response = require('../respon-helper/response.helper')

class cartController {
   
    async addCart(req, res, next) {
        try {
        //status cart {pending,processing,complete}
        //1. menemukan item yang akan dimasukkan ke cart dengan menggunakan id_item
        //2. menemukan cart dengan status item:pending
        //3. bila tidak ditemukan maka akan membuat cart baru dengan status:pending        
        //4. membuat cart_item dengan id cart pending tsb

            //menemukan item
            const id = req.params.id
            
            const findItem = await Item.findByPk(id)
            if (!findItem) {
                throw new errorHelper(404, 'cannot find item')
            }

            // menemukan cart dengan status item:pending
            let cart = await Cart.findOne({
                attributes: ['id', 'user_id','status_cart'],
                where: { 
                    status_cart: 'pending',
                    user_id: req.userId,
                    }
            })      

            // bila tidak ditemukan maka akan membuat cart baru dengan status:pending
            if(!cart) {
                cart = await Cart.create({
                    user_id: req.userId,
                    status_cart: 'pending'
                })
            } 
            
            const cartId = {}
            cartId[cart.status_cart] = cart.id

            //create item_cart
            const qty = req.body.quantity_order
            const totalprice = qty * findItem.price

            const createItemcart = await Item_cart.create({
                item_id: id,
                cart_id: cartId['pending'],
                quantity_order: qty,
                total_price: totalprice
            })
            if (!createItemcart) {
                throw new errorHelper(400, `cannot create itemcart`)
            }
            return new response(res, 201, 'create item_cart successfully')

        }
        catch (error) {
            next(error)
        }
    }

    async showCart(req, res, next) {
       
        try {
            const findCart = await Cart.findAll({
                attributes: ['id', 'status_cart'],
                include: [
                    {
                        model: user,
                        attributes: ['fullname', 'email']
                    },
                    {
                        model: Item_cart,
                        attributes: ['id', 'item_id', 'quantity_order', 'total_price'],
                        include: [{
                            model: Item,
                            attributes: ['name_item', 'price'],
                        }]
                    }
                ],
                where: {user_id: req.userId}
            })
            if (!findCart) {
                throw new errorHelper(404, 'cannot find cart')
            }
            
            return new response(res, 200, findCart)
 
        }
        catch(error) {
            next(error)
        }
        
    }

}

module.exports = {
    cartController
}