"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const app_1 = require("./app");
const server = http.createServer(app_1.default);
server.listen(4000, () => console.log("listening on port 4000"));
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log('new connection:', socket.id);
    socket.on('chat', function (names) {
        io.sockets.emit('chat', names);
    });
    socket.on('disconnect', () => {
        console.log('disconnect:', socket.id);
    });
});
//# sourceMappingURL=Index.js.map