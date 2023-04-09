require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})

const request = require('supertest');
const app = require('../../app')
const sequelize = require('../../db/config/config')
const { User } = require('../../db/models')
const bcrypt = require('bcrypt')

describe('endpoint: get /v1/api/verify-email', () => {

    beforeAll(async () => {
        await sequelize.authenticate()
    })
        
    afterAll(async () => {
        await sequelize.close()
    })

    describe('should successfully', () => {
       beforeEach(async () => {
            const createUser = await User.create({
                fullname: 'siti maimunah',
                address: 'jpogja',
                phone: '084432145166',
                email: 'sitijogja@gmail.com',
                password: bcrypt.hashSync('jokoIntegration', 8),
                is_verified: false,
                role: 'user'
            })

            console.log(createUser)
       })

       afterEach(async () => {
            User.destroy({where: { email: 'sitijogja@gmail.com'}})
       })


        it('return verify email success', async () => {

            const resp = await request(app)
                .post('/v1/api/register/user')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    fullname: 'Joko Integration',
                    address: 'pacitan',
                    phone: '084432145166',
                    email: 'joko12.com',
                    password: 'jokoIntegration'
                })
                
                expect(resp.body).toHaveProperty('message')
                expect(resp.body.message).toBe('Invalid email/phone number or password')
                expect(resp.body.type).toBe('invalid_request_error')
                expect(resp.status).toBe(400)
        })
        
    })
})