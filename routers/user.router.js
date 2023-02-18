
const { userController} = require('../controller/user.controller')
const router = require('express').Router()
const { isUserExist, tokenJwt  } = require('../middleware')

const usercontroller = new userController()
const isuserexist = new isUserExist()
const tokenjwt = new tokenJwt()

//router user
router.post('/api/register/user',isuserexist.validate, usercontroller.registerUser )
//router seller
router.post('/api/register/seller',isuserexist.validate, usercontroller.registerSeller )
//router admin
router.post('/api/register/admin',isuserexist.validate, usercontroller.registerAdmin )
//router login
router.post('/api/login', usercontroller.loginUser )
//router cek profile
router.get('/api/profile',tokenjwt.verifyToken, usercontroller.profileUser)

module.exports = router
