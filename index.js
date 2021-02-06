 
// // server.listen(process.env.PORT);
var jsonServer = require('json-server');
const app = require('express')();

app.use('/api', jsonServer.defaults(), jsonServer.router('db.json'));
// app.listen(3000);

 
const http = require('http').createServer(app);
const io = require('socket.io')(http);


app.get('/soc', (req, res) => {
    //   res.send('<h1>Hello world</h1>');
    res.sendFile(__dirname + '/Views/index.html');
});



io.on('connection', (socket) => {
    console.log("loggeduser => " +  socket.handshake.query.loggeduser);
    socket.on('chat message', (msg) => {
        // create or join room
        // socket.join('some room');
        // io.sockets.connected[socketID].join(roomName);


        // console.log('message: ' + msg);
        
        // This will emit the event to all connected sockets
        // io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
        
        // send to specific SocketId
        // io.to(socket.id).emit('chat message', 'for your eyes only');
        // io.sockets.connected[socketid].emit('message', 'for your eyes only');


        // send to everyone
        io.emit('chat message',socket.id + ':' + msg); 

        // send to everyone except sender
        // socket.broadcast.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(process.env.PORT, () => {
// http.listen("3000", () => {
    // console.log('listening on *:' + process.env.PORT);
});