const {userController} = require('../app/controllers/user.controller')


describe('test register user controller', () => {
    
    
    it('must be successful', async () => {

        const request = () => {
            return {
                'fullname' : 'yasin',
                'address' : 'gg kali maro',
                'password' : 'yasin123',
                'email' : 'yasin123@gmail.com',
                
            }
        }
        request.fullname = 'yasin'
        request.password = 'yasin123'
        request.email = 'yalqurni@gmail.com'
        request.address = 'bampel'

        
       
    })
})