const message = require('../../response-helpers/messages').MESSAGE
const responseHendler = require('../../response-helpers/error-helper')
const { userQueries } = require('../queries')
const { emailFormatValidator, phoneFormatValidator } = require('../middlewares/user.validation')
const generateToken = require('../../lib/jwt')
const { loginDecorator, profileDecorator } = require('../decorators/users-decorator')
class userController {

    async registerUser (req, res) {

        try {
            const payload = req.body
            //validate email is exist
            const findUser = await userQueries.findUserByEmail(payload)
            if (findUser) { return responseHendler.duplicate(res, message('email').duplicateData)}
            //validate format email and numberphone
            const emailFormat = await emailFormatValidator(payload)
            if (emailFormat === false) { return responseHendler.badRequest(res, message('email').invalidEmailOrPassword)}

            const phoneFormat = await phoneFormatValidator(payload)
            if (phoneFormat === false) { return responseHendler.badRequest(res, message('phone').invalidEmailOrPassword)}
            
            //create a new user
            const newUser = await userQueries.createUser(payload, 'user')
            if (!newUser) { return responseHendler.internalError(res, message().serverError)}

            return responseHendler.ok(res, message('user').created)
        }

       catch(err) {
            const key = err.message
            return responseHendler.internalError(res, message(key).errorMessage)
        }  
    }

    async registerSeller (req, res) {

        try {
            const payload = req.body
            //validate email is exist
            const findUser = await userQueries.findUserByEmail(payload)
            if (findUser) { return responseHendler.duplicate(res, message('email').duplicateData)}
            //validate format email and numberphone
            const emailFormat = await emailFormatValidator(payload)
            if (emailFormat === false) { return responseHendler.badRequest(res, message('email').invalidEmailOrPassword)}

            const phoneFormat = await phoneFormatValidator(payload)
            if (phoneFormat === false) { return responseHendler.badRequest(res, message('phone').invalidEmailOrPassword)}
            
            //create a new user
            const newUser = await userQueries.createUser(payload, 'seller')
            if (!newUser) { return responseHendler.internalError(res, message().serverError)}

            return responseHendler.ok(res, message('user').created)
        }

       catch(err) {
            const key = err.message
            return responseHendler.internalError(res, message(key).errorMessage)
        }  
    }

    async registerAdmin (req, res) {

        try {
            const payload = req.body
            //validate email is exist
            const findUser = await userQueries.findUserByEmail(payload)
            if (findUser) { return responseHendler.duplicate(res, message('email').duplicateData)}
            //validate format email and numberphone
            const emailFormat = await emailFormatValidator(payload)
            if (emailFormat === false) { return responseHendler.badRequest(res, message('email').invalidEmailOrPassword)}

            const phoneFormat = await phoneFormatValidator(payload)
            if (phoneFormat === false) { return responseHendler.badRequest(res, message('phone').invalidEmailOrPassword)}
            
            //create a new user
            const newUser = await userQueries.createUser(payload, 'admin')
            if (!newUser) { return responseHendler.internalError(res, message().serverError)}

            return responseHendler.ok(res, message('user').created)
        }

       catch(err) {
            const key = err.message
            return responseHendler.internalError(res, message(key).errorMessage)
        }  
    }
    
    async loginUser (req, res) {
        
        try {
             //find user
             const payload = req.body
            
             const findUser = await userQueries.findUserByEmail(payload)
             if(!findUser) { return responseHendler.notFound(res,message('email').notFoundResource)}
 
             const token = await generateToken(findUser)
             if(!token) { return responseHendler.internalError(res,message().serverError)}
 
             const data = loginDecorator(findUser, token)
             return responseHendler.ok(res,message('login').success, data) 
        }

        catch(err) {
            const key = err.message
            return responseHendler.internalError(res, message(key).errorMessage)
        }

    }

    async profileUser(req, res) {

        try{
            
            const payload = req.userId
            const userProfile = await userQueries.findUserById(payload)
            if(!userProfile) { return responseHendler.notFound(res, message('user').notFoundResource)}

            const data = profileDecorator(userProfile)
            return responseHendler.ok(res, message('profile').success, data)
        }
        catch(err) {
            const key = err.message
            return responseHendler.internalError(res, message(key).errorMessage)
        }
    }
}

module.exports = {
    userController
}