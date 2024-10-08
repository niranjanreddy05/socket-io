import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

const io = new Server(3000, {
  cors: {origin: ['http://localhost:5173','https://admin.socket.io']}
});

instrument(io, {
  auth: false
})

io.on('connection', socket => {
  console.log(socket.id)
  socket.on('send-message', (msg, room) => {
    if(room === ''){
      socket.broadcast.emit('receive-message', msg);
    } else {
      socket.to(room).emit('receive-message', msg);
    }
  })
  socket.on('join-room', (room, cb) => {
    socket.join(room);
    cb(`You joined the room ${room}`)
  })
})

