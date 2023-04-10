require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})

const request = require('supertest');
const app = require('../../app')
const sequelize = require('../../db/config/config')
const { User, Item } = require('../../db/models')
const bcrypt = require('bcrypt')
const generateToken  = require('../../lib/jwt')


describe('endpoint: post v1/api/item', () => {

    beforeAll(async () => {
        await sequelize.authenticate()
    })
        
    afterAll(async () => {
        await sequelize.close()
    })
    
    describe('should be successful' , () => {
        beforeEach( async () => {
            await User.create({
                fullname: 'Joko Integration',
                address: 'pacitan',
                phone: '084432145166',
                email: 'joko321@gmail.com',
                password: bcrypt.hashSync('jokoIntegration', 8),
                role: 'seller'
            
            })
        })

        afterEach( async() => {
            const findUser = await User.findOne({
                where: { email: 'joko321@gmail.com' }
            })
            await User.destroy({
                where: { id: findUser.id}
            })

            const findItem = await Item.findOne({ where: {name_item: "mie sedap original"} })
            await Item.destroy({ where: {id: findItem.id}})

        })

        it('should be return success create item', async () => {
            const findUser = await User.findOne({where: { email: 'joko321@gmail.com' }})

            const payload = {
                id: findUser.id,
                role: findUser.role
            }
            const token = await generateToken(payload)

            const res = await request(app)
                .post('/v1/api/item')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('authorization', token)
                .send({
                    name_item: "mie sedap original",
                    category_id: 1,
                    price: 3500,
                    quantity: 20
                })

                expect(res.body).toHaveProperty('message')
                expect(res.body.type).toBe(`success`)
                expect(res.status).toBe(200)
        })
    })

    describe('should be error', () => {
        describe('if role is user', () => {
            beforeEach( async () => {
                await User.create({
                    fullname: 'Joko Integration',
                    address: 'pacitan',
                    phone: '084432145166',
                    email: 'joko321@gmail.com',
                    password: bcrypt.hashSync('jokoIntegration', 8),
                    role: 'user'

                })
            })

            afterEach( async() => {
                const findUser = await User.findOne({
                    where: { email: 'joko321@gmail.com' }
                })
                await User.destroy({
                    where: { id: findUser.id}
                })

                
            })

            it('should be return failed to authorize', async () => {
                const findUser = await User.findOne({where: { email: 'joko321@gmail.com' }})

                const payload = {
                    id: findUser.id,
                    role: findUser.role
                }
                const token = await generateToken(payload)

                const res = await request(app)
                    .post('/v1/api/item')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .set('authorization', token)
                    .send({
                        name_item: "mie sedap original",
                        category_id: 1,
                        price: 3500,
                        quantity: 20
                    })
                expect(res.body).toHaveProperty('message')
                expect(res.body.type).toBe(`authentication_error`)
                expect(res.status).toBe(401)
            })
        })

        // describe('if req.body undefined', () => {
        //     beforeEach( async () => {
        //         await User.create({
        //             fullname: 'Joko Integration',
        //             address: 'pacitan',
        //             phone: '084432145166',
        //             email: 'joko3211@gmail.com',
        //             password: bcrypt.hashSync('jokoIntegration', 8),
        //             role: 'seller'

        //         })
        //     })

        //     afterEach( async() => {
        //         const findUser = await User.findOne({
        //             where: { email: 'joko3211@gmail.com' }
        //         })
        //         await User.destroy({
        //             where: { id: findUser.id}
        //         })

                
        //     })

        //     it('should be return failed to authorize', async () => {
        //         const findUser = await User.findOne({where: { email: 'joko3211@gmail.com' }})

        //         const payload = {
        //             id: findUser.id,
        //             role: findUser.role
        //         }
        //         const token = await generateToken(payload)

        //         const res = await request(app)
        //             .post('/v1/api/item')
        //             .set('Content-Type', 'application/json')
        //             .set('Accept', 'application/json')
        //             .set('authorization', token)
        //             .send(null)

        //         console.log('res create item 500', res.body)
        //         expect(res.body).toHaveProperty('message')
        //         expect(res.body.type).toBe(`authentication_error`)
        //         expect(res.status).toBe(401)
        //     })
        // })
    })
})