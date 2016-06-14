/**
 * Created by tianhang on 14/6/2016.
 */

var socketio = require('socket.io');
var io;
var guestNumber = 1;// total number of user
var nickNames = {};// associate name with conn ID
var nameUsed = [];// note the name is used
var currentRoom = {};

exports.listen = function (server) {
   io = socketio.listen(server);
    io.set('log level',1);
    io.sockets.on('connection',function (socket) {
        guestNumber = assignGuestName(socket,guestNumber,nickNames,nameUsed);
        joinRoom(socket,'Lobby');
        handleMessageBroadcasting(socket,nickNames);
        handleNameChangeAttempts(socket,nickNames,nameUsed);
        handleRoomJoining(socket);
        socket.on('room',function () {
            socket.emit('room',io.sockets.manager.rooms);
        });
        handleClientDisconnection(socket,nickNames,nameUsed);
    });
}

function assignGuestName(socket,guestNumber,nickNames,nameUsed) {
    var name = 'Guest'+guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult',{
        success:true,
        name:name
    });
    nameUsed.push(name);
    return guestNumber+1;
}