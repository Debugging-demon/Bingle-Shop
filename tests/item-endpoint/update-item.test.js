require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})

const request = require('supertest');
const app = require('../../app')
const sequelize = require('../../db/config/config')
const { Item, User } = require('../../db/models')
const bcrypt = require('bcrypt')
const generateToken  = require('../../lib/jwt')

describe('endpoint: update v1/api/item/:id', () => {

    beforeAll(async () => {
        await sequelize.authenticate()
    })
        
    afterAll(async () => {
        await sequelize.close()
    })

    describe('should be successful', () => {
        beforeEach(async () => {
            
            const createUser = await User.create({
                fullname: 'Asep Surasep',
                address: 'Bandung',
                phone: '084432145166',
                email: 'asep@gmail.com',
                password: bcrypt.hashSync('asepvsAb1', 8),
                role: 'seller'
            })
            const createItem = await Item.create({
                user_id: createUser.id,
                name_item: "tisu paseo sedang1",
                category_id: 1,
                price: 3500,
                quantity: 20,
            })

        })

        afterEach(async () => {

            await User.destroy({where: { email: 'asep@gmail.com' }})

            await Item.destroy({where: { name_item: 'tisu paseo 20gr'}})
        })

        it('changing item name from tisu paseo to tisu paseo 20gr', async () => {

            const findUser = await User.findOne({where: { email: 'asep@gmail.com' }})

            const payload = {
                id: findUser.id,
                role: findUser.role
            }
            const token = await generateToken(payload)

            const findItem = await Item.findOne({ where: {name_item: "tisu paseo sedang1"} })

            const pathParams = findItem.id

            const res = await request(app)
                .patch(`/v1/api/item/${pathParams}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('authorization', token)
                .send({
                    name_item: "tisu paseo 20gr",
                    category_id: 1,
                    price: 3500,
                    quantity: 500,
                })
        
                expect(res.body).toHaveProperty('message')
                expect(res.body.message).toBe(`item updated successfuly`)
                expect(res.status).toBe(200)
        })
    })

    describe('should error', () => {

        beforeEach(async () => {
            
            const createUser = await User.create({
                fullname: 'andika',
                address: 'Bandung',
                phone: '084432145166',
                email: 'andika@gmail.com',
                password: bcrypt.hashSync('asepvsAb1', 8),
                role: 'user'
            })
            const createSeller = await User.create({
                fullname: 'Asep Surasep',
                address: 'Bandung',
                phone: '084432145166',
                email: 'asep@gmail.com',
                password: bcrypt.hashSync('asepvsAb1', 8),
                role: 'seller'
            })

            await Item.create({
                user_id: createSeller.id,
                name_item: "tisu Sehat",
                category_id: 1,
                price: 3500,
                quantity: 20,
            })
        })

        afterEach(async () => {

            await User.destroy({where: { email: 'asep@gmail.com'}})
            await User.destroy({where: { email: 'andika@gmail.com'}})
            await Item.destroy({where: { name_item: "tisu paseo"}})

        })
        it('when not owner of items to update', async () => {
            const findUser = await User.findOne({where: { email: 'andika@gmail.com' }})

            const payload = {
                id: findUser.id,
                role: findUser.role
            }
            const token = await generateToken(payload)

            const findItem = await Item.findOne({ where: {name_item: "tisu Sehat"} })
            const pathParams = findItem.id

            const res = await request(app)
                .patch(`/v1/api/item/${pathParams}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('authorization', token)
        
                expect(res.body).toHaveProperty('message')
                expect(res.body.message).toBe(`failed to authorize`)
                expect(res.status).toBe(401)
        })
    })
})