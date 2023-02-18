const { Order, Cart, Item_cart, Item } = require('../db/models')
const errorHelper = require('../respon-helper/error.helper')
const response = require('../respon-helper/response.helper')

class orderController {
    
    async checkout(req, res, next) {
    
        try {   
            //find cart with status_cart pending
            const findCart = await Cart.findOne({
                where: { 
                    status_cart: 'pending',
                    user_id: req.userId
                    }
            })
            if(!findCart) {
                throw new errorHelper(404, 'Cart not found')
            }

            //create order
            let itemCart = await Item_cart.findAll({
                where: { cart_id: findCart.id}
              })

            if (itemCart.length === 0) {
                throw new errorHelper(404, 'item_cart not found')
            }

            let cartPrice = {}
            let totalPrice = 0;
            itemCart.forEach((itemCartData) => {
                cartPrice[itemCartData.id] = itemCartData.total_price
                totalPrice = totalPrice + itemCartData.total_price
            })

            const createOrder = await Order.create({
                user_id: findCart.user_id,
                cart_id: findCart.id,
                status_order: 'pending',
                total_price: totalPrice
            })
                if (!createOrder) {
                    throw new errorHelper(400, 'cannot create order')
                }

            //update status cart
            const updateCart = await Cart.update(
                { status_cart: 'process' },
                { where: {id: findCart.id}}
            )
                if(!updateCart) {
                    throw new errorHelper(400, 'cannot update cart')
                }

             //update quantity item
            //  const itemCart = await Item_cart.findAll({
            //     where: {cart_id: findCart.id}
            // })
            for (const item of itemCart) {
                const findItem = await Item.findOne({
                    where: {id: item.item_id}
                })
                const qty = findItem.quantity - item.quantity_order
                await Item.update(
                    {quantity: qty },
                    {where: {id: item.item_id}}
                )
            }
            
            return new response(res, 201, createOrder)
           
        }

        catch(error) {
            next(error)
        }
    }

    async confirmPayment(req, res, next) {
        //update order status dari pending menjadi success
        //update cart status dari process menjadi success
        //update stock item 
        try{
            //update order
            const findOrder = await Order.findOne({
                where: {
                    user_id: req.userId,
                    status_order: 'pending'
                    }
            })
                if (!findOrder) {
                    throw new errorHelper(404, 'cannot find order')
                }
    
            const updateOrder = await Order.update(
                {status_order: 'success'},
                {where: {id: findOrder.id}}
            )
                if (!updateOrder) {
                    throw new errorHelper(400, 'cannot update order')
                }
                

            // Update cart
            const findCart = await Cart.findOne({
                where: {
                    status_cart: 'process',
                    user_id: findOrder.user_id
                }
            })
                if (!findCart) {
                    throw new errorHelper(404, 'cannot find cart')
                }

            const updateCart = await Cart.update(
                {status_cart: 'success'},
                {where: {id: findCart.id}}
            )
                if (!updateCart) {
                    throw new errorHelper(400, 'cannot update cart')
                }

           
            return new response(res, 201, 'payment successfully')
    
        }
        catch (error) {
            next(error)
        }


    }

    async cancelOrder(req, res, next) {
        //find order dengan status pending
        //delete order
        //merubah status cart dari process menjadi pending
        //update stock item
        try {
            const findOrder = await Order.findOne({
                where: {
                    status_order: 'pending',
                    user_id: req.userId
                }
            })
                if(!findOrder) {
                    throw new errorHelper(404, 'Order not found')
                }
            await Order.destroy({
                where: {id: findOrder.id}
            })
    
            const findCart = await Cart.findOne({
                where: {
                    status_cart: 'process',
                    user_id: findOrder.user_id
                }
            })
                if(!findCart) {
                    throw new errorHelper(404, 'Cart not found')
                }
            await Cart.update(
                {status_cart: 'pending'},
                {where: {id: findCart.id}}
            )
            //update stock barang
            const itemCart = await Item_cart.findAll({
                where: {id: findCart.id}
            })
            for (let item of itemCart) {
                const findItem = await Item.findOne({
                    where: {id: item.item_id}
                })
                let qty = findItem.quantity + item.quantity_order 
                await Item.update(
                    {quantity: qty},
                    {where: {id: item.item_id}})
            }
            return new response(res, 201, 'cancel order successfully')

        }
        
        catch(error) {
            next(error)
        }
    }
    
}

module.exports = { orderController }