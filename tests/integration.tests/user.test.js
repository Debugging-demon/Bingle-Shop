require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})

const request = require('supertest');
const app = require('../../app')
const sequelize = require('../../db/config/config')
const { User } = require('../../db/models')
const bcrypt = require('bcrypt')

describe('Integration Testing: user.router', () => {

    beforeAll(async () => {
        await sequelize.authenticate()
    })
      
    afterAll(async () => {
        await sequelize.close()
    })

    describe('router: /v1/api/register/user', () => {
        describe('should be successful', () => {

            afterEach( async() => {
                const findUser = await User.findOne({
                    where: { email: "yasinal@gmail.com" }
                })
                await User.destroy({
                    where: { id: findUser.id}
                })
            })

            it('should return success register user', async () => {

                const resp = await request(app)
                    .post('/v1/api/register/user')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({
                        fullname: "yasin alqurni",
                        address: "gg. masjid alfatah",
                        phone: "082239236521",
                        email: "yasinal@gmail.com",
                        password: "passwordlah1"
                    })
    
                expect(resp.body).toHaveProperty('message')
                expect(resp.body.type).toBe('success')
                expect(resp.status).toBe(200)
            })
    
        })
        
        describe('should be error', () => {
            describe('duplicate data',() => {
                beforeEach(async() => {
                    await User.create({
                        fullname: 'Joko Integration',
                        address: 'pacitan',
                        phone: '084432145166',
                        email: 'joko123@gmail.com',
                        password: bcrypt.hashSync('jokoIntegration', 8),
                        role: 'user'
                    })
                })
    
                afterEach( async() => {
                    const findUser = await User.findOne({
                        where: { email: 'joko123@gmail.com' }
                    })
                    await User.destroy({
                        where: { id: findUser.id}
                    })
                })
    
                it('cannot register because data duplicates', async () => {
                    const resp = await request(app)
                    .post('/v1/api/register/user')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({
                        fullname: 'Joko Integration',
                        address: 'pacitan',
                        phone: '084432145166',
                        email: 'joko123@gmail.com',
                        password: 'jokoIntegration'
                    })
                    
                    expect(resp.body).toHaveProperty('message')
                    expect(resp.body.type).toBe('duplicate_data_error')
                    expect(resp.status).toBe(409)
                })
            })
            
            describe('email & phone format is wrong', () => {
                it('cannot register because email format is wrong', async () => {
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

                it('cannot register because phone format is wrong', async () => {
                    const resp = await request(app)
                    .post('/v1/api/register/user')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({
                        fullname: 'Joko Integration',
                        address: 'pacitan',
                        phone: '084432145',
                        email: 'joko12@gmail.com',
                        password: 'jokoIntegration'
                    })
                    
                    expect(resp.body).toHaveProperty('message')
                    expect(resp.body.message).toBe('Invalid email/phone number or password')
                    expect(resp.body.type).toBe('invalid_request_error')
                    expect(resp.status).toBe(400)
            })

            describe('internal server error', () => {
                it('must be internal server error', async () => {
                    const resp = await request(app)
                    .post('/v1/api/register/user')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({
                        undefined
                    })
                    
                    expect(resp.body).toHaveProperty('message')
                    expect(resp.body.type).toBe('api_error')
                    expect(resp.status).toBe(500)
            })
                })
            })
        })

    })

    describe('router: /v1/api/login', () => {

        describe('should be successful', () => {

            beforeEach( async () => {
                await User.create({
                    fullname: 'Joko Integration',
                    address: 'pacitan',
                    phone: '084432145166',
                    email: 'joko123@gmail.com',
                    password: bcrypt.hashSync('jokoIntegration', 8),
                    role: 'user'
                })
            })
            
            afterEach( async() => {
                const findUser = await User.findOne({
                    where: { email: "joko123@gmail.com" }
                })
                await User.destroy({
                    where: { id: findUser.id}
                })
            })

            it('success login', async () => {
                const resp = await request(app)
                    .post('/v1/api/login')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({
                        email: 'joko123@gmail.com',
                        password: 'jokoIntegration',
                    })
    
                expect(resp.body).toHaveProperty('message')
                expect(resp.body.message).toBe('login success')
                expect(resp.body.data).toHaveProperty('token')
                expect(resp.status).toBe(200)
            })
            
        })
        
        describe('should be error', () => {

            describe('user forget to register', () => {
                it('email not found', async () => {
                    const resp = await request(app)
                    .post('/v1/api/login')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({
                        email: 'joko123@gmail.com',
                        password: 'jokoIntegration',
                    })
    
                expect(resp.body).toHaveProperty('message')
                expect(resp.body.message).toBe('email not found in our database')
                expect(resp.body.data).not.toHaveProperty('token')
                expect(resp.status).toBe(404)
                })
            })

            describe('password is wrong', () => {

                beforeEach( async () => {
                    await User.create({
                        fullname: 'Joko Integration',
                        address: 'pacitan',
                        phone: '084432145166',
                        email: 'joko123@gmail.com',
                        password: bcrypt.hashSync('jokoIntegration', 8),
                        role: 'user'
                    })
                })
                
                afterEach( async() => {
                    const findUser = await User.findOne({
                        where: { email: "joko123@gmail.com" }
                    })
                    await User.destroy({
                        where: { id: findUser.id}
                    })
                })

                it('must wrong', async () => {
                    const resp = await request(app)
                    .post('/v1/api/login')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({
                        email: 'joko123@gmail.com',
                        password: 'jokotidakIntegration',
                    })
    
                expect(resp.body).toHaveProperty('message')
                expect(resp.body.message).toBe('wrong password')
                expect(resp.body.data).not.toHaveProperty('token')
                expect(resp.status).toBe(404)
                })
            })
        })
    })
    
})