const { User } = require('../db/models')
const validator = require('validator')
const errorHelper = require('../respon-helper/error.helper')

class isUserExist {
    async validate (req, res, next) {

        try {
            //verifikasi email
            const isEmailExist = await  User.findOne({
                where: {
                    email: req.body.email
                }
            })
            if(isEmailExist) {
                throw new errorHelper(400, 'User already exists')
            }
            
            //verifikasi format email
            const isEmail = await validator.isEmail(req.body.email)
            if(isEmail == false) {
                throw new errorHelper(400, 'your email or phone number are invalid!')
            }

            //verifikasi format noHp
            const isNoHp = await validator.isMobilePhone(req.body.phone,['id-ID'])
            if(isNoHp == false) {
                throw new errorHelper(400, 'your email or phone number are invalid!')
            }
                next()

        }
        
        catch(error) {
            next(error)
        }
        
    }
}

module.exports = {
    isUserExist
}