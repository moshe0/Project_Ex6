import * as http from 'http';
import app from './app';

const server = http.createServer(app);

server.listen(4000, ()=>console.log("listening on port 4000"));



const io = require('socket.io')(server);

io.on('connection', (socket)=> {
    console.log('new connection:', socket.id);

    socket.on('chat', function(names){
        io.sockets.emit('chat', names);
    });

    socket.on('disconnect', () => {
        console.log('disconnect:', socket.id);
    });
});
