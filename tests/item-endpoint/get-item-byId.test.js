require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})

const request = require('supertest');
const app = require('../../app')
const sequelize = require('../../db/config/config')
const { Item } = require('../../db/models')



describe('endpoint: get v1/api/item/:id', () => {

    beforeAll(async () => {
        await sequelize.authenticate()
    })
        
    afterAll(async () => {
        await sequelize.close()
    })

    describe('if not items found', () => {
        it('should return error', async () => {

            const res = await request(app)
                .get('/v1/api/item/7')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')

                expect(res.body).toHaveProperty('message')
                expect(res.body.type).toBe(`invalid_request_error`)
                expect(res.status).toBe(404)
        })
    })

    describe('should be successful', () => {

        beforeEach(async () => {
            await Item.create({
                name_item: "sapu lidi5",
                category_id: 1,
                price: 3500,
                quantity: 20,
            })          
        })

        afterEach(async () => {
            await Item.destroy({ where: {name_item: "sapu lidi5"}})
        })

        it('should be return success', async () => {
            const findItem = await Item.findOne({ where: {name_item: "sapu lidi5"} })
            const pathParams = findItem.id

            const res = await request(app)
                .get(`/v1/api/item/${pathParams}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
        
                expect(res.body).toHaveProperty('message')
                expect(res.body.message).toBe(`get item success`)
                expect(res.status).toBe(200)
        })
    })

})