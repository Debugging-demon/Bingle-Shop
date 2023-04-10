require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})

const request = require('supertest');
const app = require('../../app')
const sequelize = require('../../db/config/config')
const { User, Item } = require('../../db/models')
const bcrypt = require('bcrypt')
const generateToken  = require('../../lib/jwt')


describe('endpoint: get v1/api/item', () => {

    beforeAll(async () => {
        await sequelize.authenticate()
    })
        
    afterAll(async () => {
        await sequelize.close()
    })

    describe('should be successful', () => {

        beforeEach(async() => {
            const createUser =await User.create({
                fullname: 'Mahalini',
                address: 'Bandung',
                phone: '084432145166',
                email: 'mahalini1@gmail.com',
                password: bcrypt.hashSync('asepvsAb1', 8),
                role: 'seller'
            })


            await Item.create({
                name_item: "Mainan anak cewek1",
                user_id: createUser.id,
                category_id: 1,
                price: 3500,
                quantity: 20,
            })

        })

        afterEach(async() => {
            await User.destroy({where: { email: 'mahalini1@gmail.com'}})
            await Item.destroy({where: { name_item: 'Mainan anak cewek1'}})
        })
            it('should be return success get all item', async () => {

                const findUser = await User.findOne({where: { email: 'mahalini1@gmail.com' }})

                const payload = {
                    id: findUser.id,
                    role: findUser.role
                }
                const token = await generateToken(payload)
                console.log(token)
                const res = await request(app)
                    .get('/v1/api/itemseller')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .set('authorization', token)

                    console.log(res.body)
                    expect(res.body).toHaveProperty('message')
                    expect(res.body.type).toBe(`success`)
                    expect(res.status).toBe(200)
        })
    })

    describe('should Error', () => {
        beforeEach(async() => {
            await User.create({
                fullname: 'Mahalini',
                address: 'Bandung',
                phone: '084432145166',
                email: 'mahalini2@gmail.com',
                password: bcrypt.hashSync('asepvsAb1', 8),
                role: 'seller'
            })
        })

        afterEach(async() => {
            await User.destroy({where: { email: 'mahalini2@gmail.com'}})
        })

        it('when 0 items', async () => {
            const findUser = await User.findOne({where: { email: 'mahalini2@gmail.com' }})

            const payload = {
                id: findUser.id,
                role: findUser.role
            }
            const token = await generateToken(payload)
            console.log(token)
            const res = await request(app)
                .get('/v1/api/itemseller')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('authorization', token)

                
                expect(res.body.error).toBe(true)
                expect(res.body.type).toBe('invalid_request_error')
                expect(res.status).toBe(404)
        })
    })
})
