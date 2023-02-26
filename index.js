const dotenv = require('dotenv')

dotenv.config({path: '.env'})

const app = require('./app')

const port = process.env.PORT

const server = app.listen(port, () => {
    console.log(`server running on port ${port}`)
})

// socket.io
const socketio = require('socket.io');
const io = socketio(server);
const fileIo = require('./chat/socketio')(io);