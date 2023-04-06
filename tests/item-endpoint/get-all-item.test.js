require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})

const request = require('supertest');
const app = require('../../app')
const sequelize = require('../../db/config/config')
const { Item } = require('../../db/models')


describe('endpoint: get v1/api/item', () => {

    beforeAll(async () => {
        await sequelize.authenticate()
    })
        
    afterAll(async () => {
        await sequelize.close()
    })

    // describe('if not items found', () => {

    //     beforeEach(async () => {
    //         const findAllItems = async () => {
    //             return await Item.findAll({})
    //         }

    //         for(item of findAllItems) {
    //             await Item.destroy({where: {id: item.id}})
    //         }
            
    //     })
    //     it('should return error', async () => {

    //         const res = await request(app)
    //             .get('/v1/api/item')
    //             .set('Content-Type', 'application/json')
    //             .set('Accept', 'application/json')

    //             expect(res.body).toHaveProperty('message')
    //             expect(res.body.type).toBe(`invalid_request_error`)
    //             expect(res.status).toBe(404)
    //     })
    // })
    
    describe('should be successful', () => {

        beforeEach(async () => {
            await Item.create({
                name_item: "sapu lidi1",
                category_id: 1,
                price: 3500,
                quantity: 20
            })
        })

        afterEach(async () => {
            const findItem = await Item.findOne({ where: {name_item: "sapu lidi1"} })
            await Item.destroy({ where: {id: findItem.id}})
        })
        it('should be return success get all item', async () => {
        
            const res = await request(app)
                .get('/v1/api/item')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
           
                expect(res.body).toHaveProperty('message')
                expect(res.body.type).toBe(`success`)
                expect(res.status).toBe(200)
        })
    })

})
