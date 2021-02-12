
// // server.listen(process.env.PORT);
var jsonServer = require('json-server');
const cors = require('cors');
const express = require('express');
const app = express();
var multer  = require('multer');
var fs  = require('fs');
app.use(cors());
app.use('/api', jsonServer.defaults(), jsonServer.router('db.json'));

// app.listen(3000);

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });


const http = require('http').createServer(app);
var allowedOrigins = "http://localhost:* http://127.0.0.1:*";
// const io = require('socket.io')(http);
// const io = require('socket.io')(http,{  origins: allowedOrigins});


// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// })

// const io = require('socket.io')(http, { origins: '*:*'});
// io.origins('origins', '*:*');


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null,  Date.now() +  '-' + file.originalname );
    }
});

var upload = multer({storage: storage}).array('file', 12);
app.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong:(");
        }
        // res.end("Upload completed.");
        res.send(req.files);
    });
})


const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    // cors: {
    //   origin: '*:*',
    // }
  });


// const io = require('socket.io')(http, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// });


app.get('/soc', (req, res) => {
    //   res.send('<h1>Hello world</h1>');
    res.sendFile(__dirname + '/Views/index.html');
});



io.on('connection', (socket) => {
    console.log("loggeduser => " + socket.handshake.query.loggeduser);
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
        io.emit('chat message', socket.id + ':' + msg);

        // send to everyone except sender
        // socket.broadcast.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// http.listen(process.env.PORT, () => {
http.listen("3008", () => {
    // console.log('listening on *:' + process.env.PORT);
});