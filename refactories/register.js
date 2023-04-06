const request = require('supertest');
const app = require('../app')

const registerUser = async (payload) => {
    return request(app)
    .post('/v1/api/register/user')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
        fullname: payload.fullname,
        address: payload.address,
        phone: payload.phone,
        email: payload.email,
        password:payload.password
    })
}

const registerSeller = async (payload) => {
    return request(app)
    .post('/v1/api/register/seller')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
        fullname: payload.fullname,
        address: payload.address,
        phone: payload.phone,
        email: payload.email,
        password:payload.password
    })
}

module.exports = {
    registerUser,
    registerSeller,
}