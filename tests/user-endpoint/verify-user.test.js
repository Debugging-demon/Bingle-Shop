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

    describe('should error', () => {
        describe('when user is verified', () => {
            beforeEach(async () => {
                 const createUser = await User.create({
                     fullname: 'siti maimunah',
                     address: 'jpogja',
                     phone: '084432145166',
                     email: 'sitijogja1@gmail.com',
                     password: bcrypt.hashSync('jokoIntegration', 8),
                     is_verified: true,
                     role: 'user'
                 })
            })
     
            afterEach(async () => {
                 await User.destroy({where: { email: 'sitijogja1@gmail.com'}})
            })
     
     
             it('return user is already verified', async () => {
                 const findUser = await User.findOne({where: { email: 'sitijogja1@gmail.com'}})
     
                 token = findUser.verification_token
     
                 const resp = await request(app)
                     .get(`/v1/api/verify-email?token=${token}`)
                     .set('Content-Type', 'application/json')
                     .set('Accept', 'application/json')
                     .send()

                     expect(resp.body.error).toBe(true)
                     expect(resp.body.message).toBe('User is already verified')
                     expect(resp.body.type).toBe('invalid_request_error')
                     expect(resp.status).toBe(400)
             })
             
         })

        describe('when token null', () => {
    
            it('return verify email success', async () => {
                token = null
    
                const resp = await request(app)
                    .get(`/v1/api/verify-email?token=${token}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send()
                    
                    expect(resp.body.error).toBe(true)
                    expect(resp.body.message).toBe('invalid input syntax for type uuid: "null"')
                    expect(resp.body.type).toBe('api_error')
                    expect(resp.status).toBe(500)
            })
            
        })
    })
})