const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const moment = require('moment');
const mongoose = require('mongoose');

const {generateMessage, generateLocationMessage}= require('./utils/message');
const {isRealString, isActive}=require('./utils/validation');
const {Users}=require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();


app.use(express.static(publicPath));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/Chat', { useNewUrlParser: true }, err => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to mongodb');
    }
});

const chatSchema = mongoose.Schema({
    name: String,
    message: String,
    url: String,
    createdAt: Date
});

io.on(`connection`, (socket)=>{

    socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
     return  callback('Name and room name are required.');
    }
    if (isActive(params.name, users.users)) {
           return callback(`${params.name} is currently active in another session. Log out before continuing.`);
       }
    params.room=params.room.toLowerCase();
        var userList=users.getUserList(params.room).filter((name)=>name === params.name);
        if(userList.length>0){
            return callback('Username already exists');
        }
    const Chat = mongoose.model(params.room, chatSchema);
        Chat.find({}, (err, docs) => {
            if (err) throw err;
            socket.emit('oldMessages', docs);
        });
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList',users.getUserList(params.room));

    socket.emit('newMessage',generateMessage('ChatApp','Welcome to the Chat Room'));

    socket.broadcast.to(params.room).emit('newMessage',generateMessage('ChatApp:',`${params.name} has joined`));

    callback();
  });

   socket.on('createMessage',(message, callback)=>{
     const user =users.getUser(socket.id);
     const Chat = mongoose.model(user.room, chatSchema);

     if(user && isRealString(message.text)){
       const newMessage = new Chat({ name: user.name, message: message.text, createdAt: moment().valueOf() });

       newMessage.save(err => {
               if (err) throw err;
       io.to(user.room).emit('newMessage',generateMessage(user.name, message.text));
     });
     }

     callback();
   });


   socket.on('createLocationMessage', (coords) => {
     var user =users.getUser(socket.id);
     const Chat = mongoose.model(user.room, chatSchema);
     if(user ){
       const newMessage = new Chat({ name: user.name, url: `https://www.google.com/maps/?q=${coords.latitude},${coords.longitude}`, createdAt: moment().valueOf() });
       newMessage.save(err => {
                 if (err) throw err;

                 io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
             });
     }

     });
     socket.on('newIncomingRequest',()=>{
             console.log('newIncomingRequest');
             socket.emit('updateRoomList',users.getRooms());
         });
  socket.on('disconnect',()=>{
    var user =users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
    }
  });
});


server.listen(port, ()=>{
  console.log(`Server is on ${port}`);
});
