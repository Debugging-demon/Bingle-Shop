const jwt = require('jsonwebtoken')
const config = require('../config/auth')



class tokenJwt {

    verifyToken (req, res, next) {

        const token = req.headers['authorization']

        if(!token) {
            return res.status(403).json({
                message: 'no token provided!'
            })
        }

        jwt.verify(token, config.secret, (err, decoded) =>{
            if(err) {
                return res.status(401).json({
                    message: 'unauthentized!'
                })
            }
            req.userId = decoded.id
            req.userRole = decoded.role
            next()
        })
    }

    otorisasi (req, res, next) {
        if(req.userRole == 'admin' || req.userRole == 'seller') {
            next()
        }else{
            res.status(500).json({
                message: 'you are not allowed'
            })
        }
    }
}

module.exports = {
    tokenJwt,
}