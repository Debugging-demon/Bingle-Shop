require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})

const request = require('supertest');
const app = require('../../app')
const path = require('path')
const __basedir = path.resolve()

const sequelize = require('../../db/config/config')
const { User, Item } = require('../../db/models')
const bcrypt = require('bcrypt')
const generateToken  = require('../../lib/jwt')
const fs = require('fs')

describe('endpoint: post /v1/api/image/:id', () => {

    beforeAll(async () => {
        await sequelize.authenticate()
    })
        
    afterAll(async () => {
        await sequelize.close()
    })

    describe('when successful', () => {
        beforeEach(async () => {
            const createSeller = await User.create({
                fullname: 'Syakaila',
                address: 'Bandung',
                phone: '084432145166',
                email: 'syakaila@gmail.com',
                password: bcrypt.hashSync('asepvsAb1', 8),
                role: 'seller'
            })

            await Item.create({
                user_id: createSeller.id,
                name_item: "baju Bayi",
                category_id: 2,
                price: 25000,
                quantity: 6,
            })
        })

        afterEach(async() => {
            await User.destroy({where: { email: 'syakaila@gmail.com'}})
            await Item.destroy({where: { name_item: "baju Bayi"}})
        })

        it('return success', async () => {
            const findUser = await User.findOne({where: { email: 'syakaila@gmail.com' }})

            const payload = {
                id: findUser.id,
                role: findUser.role
            }
            const token = await generateToken(payload)

            const findItem = await Item.findOne({ where: {name_item: "baju Bayi"} })
            const pathParams = findItem.id
            
            const res = await request(app)
                .post(`/v1/api/image/${pathParams}`)
                .set({connection: 'keep-alive'})
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('authorization', token)
                .send()
                .attach('files', fs.readFileSync(`${__basedir}/refactories/BAJU.JPG`) )

                console.log(res.body)
                expect(res.body.error).toBe(false)
                expect(res.body.message).toBe('images created successfuly')
                expect(res.body.type).toBe('success')
                expect(res.status).toBe(200)
        })
    })

    describe('when error', () => {
        describe('error 500', () => {
            beforeEach(async () => {
                const createSeller = await User.create({
                    fullname: 'Syakaila',
                    address: 'Bandung',
                    phone: '084432145166',
                    email: 'syakaila@gmail.com',
                    password: bcrypt.hashSync('asepvsAb1', 8),
                    role: 'seller'
                })
    
                await Item.create({
                    user_id: createSeller.id,
                    name_item: "baju Bayi",
                    category_id: 2,
                    price: 25000,
                    quantity: 6,
                })
            })
    
            afterEach(async() => {
                await User.destroy({where: { email: 'syakaila@gmail.com'}})
                await Item.destroy({where: { name_item: "baju Bayi"}})
            })
    
            it('return error', async () => {
                const findUser = await User.findOne({where: { email: 'syakaila@gmail.com' }})
    
                const payload = {
                    id: findUser.id,
                    role: findUser.role
                }
                const token = await generateToken(payload)
    
                const findItem = await Item.findOne({ where: {name_item: "baju Bayi"} })
                const pathParams = findItem.id
                
                const res = await request(app)
                    .post(`/v1/api/image/${pathParams}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .set('authorization', token)
                    .send()
                    .attach('files',`${__basedir}/refactories/BAJU.JPG` )
    
                    expect(res.body.error).toBe(true)
                    expect(res.body.message).toBe('Unexpected field')
                    expect(res.body.type).toBe(`api_error`)
                    expect(res.status).toBe(500)
            })
        })
        
    })
})