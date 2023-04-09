require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})

const request = require('supertest');
const app = require('../../app')
const sequelize = require('../../db/config/config')
const { Item, User } = require('../../db/models')
const bcrypt = require('bcrypt')
const generateToken  = require('../../lib/jwt')

describe('endpoint: delete v1/api/item/:id', () => {

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
                email: 'asep1@gmail.com',
                password: bcrypt.hashSync('asepvsAb1', 8),
                role: 'seller'
            })

            await Item.create({
                user_id: createUser.id,
                name_item: "tisu paseo 500gr",
                category_id: 1,
                price: 3500,
                quantity: 20,
            })
        })

        afterEach(async () => {

            await User.destroy({
                where: { email: 'asep1@gmail.com'}
            })

        })

        it('always success', async () => {

            const findUser = await User.findOne({where: { email: 'asep1@gmail.com' }})

            const payload = {
                id: findUser.id,
                role: findUser.role
            }
            const token = await generateToken(payload)

            const findItem = await Item.findOne({ where: {name_item: "tisu paseo 500gr"} })
            const pathParams = findItem.id

            const res = await request(app)
                .delete(`/v1/api/item/${pathParams}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('authorization', token)
        
                expect(res.body).toHaveProperty('message')
                expect(res.body.message).toBe(`item deleted successfuly`)
                expect(res.status).toBe(200)
        })
    })

    describe('should error', () => {

        beforeEach(async () => {
            
            const createUser = await User.create({
                fullname: 'andika',
                address: 'Bandung',
                phone: '084432145166',
                email: 'andika1@gmail.com',
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
            await User.destroy({where: { email: 'andika1@gmail.com'}})
            await Item.destroy({where: { name_item: "tisu Sehat"}})

        })
        it('when not owner of items to delete', async () => {
            const findUser = await User.findOne({where: { email: 'andika1@gmail.com' }})

            const payload = {
                id: findUser.id,
                role: findUser.role
            }
            const token = await generateToken(payload)

            const findItem = await Item.findOne({ where: {name_item: "tisu Sehat"} })
            const pathParams = findItem.id

            const res = await request(app)
                .delete(`/v1/api/item/${pathParams}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('authorization', token)
        
                expect(res.body).toHaveProperty('message')
                expect(res.body.message).toBe(`failed to authorize`)
                expect(res.status).toBe(401)
        })
    })
})