const request = require('supertest');
const app = require('../app')

const loginUser = async (payload) => {
    return request(app)
    .post(`/v1/api/login`)
    .post('/v1/api/login')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
        email: payload.email,
        password: payload.password,
    })
}

module.exports = {
    loginUser
}