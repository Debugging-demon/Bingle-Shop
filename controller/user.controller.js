const config = require('../config/auth')
const { User } = require('../db/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const errorHelper = require('../respon-helper/error.helper')
const response = require('../respon-helper/response.helper')

class userController {

    async registerUser (req, res, next) {

        try {
            //membuat user baru 
            const createUsers = await User.create({
                fullname: req.body.fullname,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
                role: 'user'
            })
                //memberikan respon bila gagal membuat user baru
                if(!createUsers){
                    throw new errorHelper(400, 'cannot create user')
                }
                return new response(res, 201, 'create user successfully')
        }
       catch(error) {
            next(error)
        }  
    }

    async registerSeller (req, res, next) {

        try {
            //membuat user baru 
            const createUsers = await User.create({
                fullname: req.body.fullname,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
                role: 'seller'
            })
                //memberikan respon bila gagal membuat user baru
                if(!createUsers){
                    throw new errorHelper(400, 'cannot create user')
                }
                return new response(res, 201, 'create user successfully')
        }
       catch(error) {
            next(error)
        }  
    }

    async registerAdmin (req, res, next) {

        try {
            //membuat user baru 
            const createUsers = await User.create({
                fullname: req.body.fullname,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
                role: 'admin'
            })
                //memberikan respon bila gagal membuat user baru
                if(!createUsers){
                    throw new errorHelper(400, 'cannot create user')
                }
                return new response(res, 201, 'create user successfully')
        }
       catch(error) {
            next(error)
        }  
    }
    
    async loginUser (req, res, next) {
        
        try {
            const findUser = await User.findOne({
                where:{
                    email: req.body.email
                }
            })
            if(!findUser) {
                throw new errorHelper(404, 'email not found')
            }
                //membuat fariable validasi password
            let passwordIsValid = bcrypt.compareSync(req.body.password, findUser.password)
            
            if(!passwordIsValid) {
                throw new errorHelper(400, 'Invalid password')
            }
            //membuat token dan akan mengirimkannya kedalam respom
            let token = jwt.sign({ id: findUser.id, role: findUser.role}, config.secret, {
                expiresIn: 86400, //24 jam
            })
            //respon dari login
            return new response(res, 201, token )  
        }

        catch(error) {
            next(error)
        }

    }

    async profileUser(req, res, next) {
        try{
            //membuat queri untuk menemukan id sesuai dengan yang ada di token
            console.log(req.userId)
            const userProfile = await User.findOne({
            attributes:['fullname', 'email', 'phone'],
            where: {id: req.userId} 
            })

            if(!userProfile) {
                throw new errorHelper(404, "User not found")
            }
            return new response(res, 200, userProfile)
        }
        catch(error){
            next (error)
        }
    }
}

module.exports = {
    userController
}