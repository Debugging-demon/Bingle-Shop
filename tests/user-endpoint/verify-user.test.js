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
       })

       afterEach(async () => {
            await User.destroy({where: { email: 'sitijogja@gmail.com'}})
       })


        it('return verify email success', async () => {
            const findUser = await User.findOne({where: { email: 'sitijogja@gmail.com'}})

            token = findUser.verification_token

            const resp = await request(app)
                .get(`/v1/api/verify-email?token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send()
                
                console.log('respon body',resp.body)
                expect(resp.body).toHaveProperty('message')
                expect(resp.body.message).toBe('Token updated successfuly')
                expect(resp.body.type).toBe('success')
                expect(resp.status).toBe(200)
        })
        
    })
})