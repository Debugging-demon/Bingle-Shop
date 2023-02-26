const { Chat, User } = require('../db/models');

exports = module.exports = function(io) {
    // console.log('5555555555555')
    io.of('/chat').on('connection', async (socket) => {
        
        // ambil user dari tabel users
        const sender = await User.findOne({
            attributes: ["id", "fullname", "role"],
            where: {id: socket.handshake.query.sender_id}
        })
        
        // cek apakah sender id sama dengan room id atau admin
        if (!(sender.id == socket.handshake.query.room_id || sender.role == "admin")) {
            socket.emit('error', "room id harus sama dengan sender id / role sender harus admin");
            socket.disconnect();
        }
        
        console.log('a user connected');
        socket.join(socket.handshake.query.room_id);
        
        // ambil history chat dari tabel chats
        const chatHistory = await Chat.findAll({
            attributes: ["id","sender_id", "room_id", "message"],
            where: {room_id: socket.handshake.query.room_id},
                order: [
                    ['id', 'ASC'],
                ],
        })
    
        // load chatHistory
        for(let data of chatHistory){
            message = data.message;
            
            if (socket.handshake.query.room_id == data.sender_id) {
                // ambil nama pembeli
                const buyerName = await Chat.findOne({
                    attributes: ["id"],
                    where: {id: data.id},
                    include: {
                        model: User,
                        attributes: ['fullname'],
                        as: 'owner'
                    }
                })
                socket.emit("messageHistory", `${buyerName.owner.fullname}: ${message}`)
            } else {
                // ambil nama admin
                const adminName = await Chat.findOne({
                    attributes: ["id"],
                    where: {id: data.id},
                    include: {
                        model: User,
                        attributes: ['fullname'],
                        as: 'owner'
                    }
                })
                socket.emit("messageHistory", `Admin ${adminName.owner.fullname}: ${message}`)
            }
        };
    
        // listen event sendEvent
        socket.on('sendEvent', async (data) => {
            await Chat.create({
                sender_id : socket.handshake.query.sender_id,
                room_id : socket.handshake.query.room_id,
                message: data
            })
            
            // mengirim pesan dengan event messageReceived
            if (sender.id == socket.handshake.query.room_id) {
                socket.to(socket.handshake.query.room_id).emit("messageReceived", `${sender.fullname}: ${data}`);
            } else {
                socket.to(socket.handshake.query.room_id).emit("messageReceived", `Admin ${sender.fullname}: ${data}`);
            }
        });
    });
}


