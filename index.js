require('dotenv').config()
const app = require('./app')(__dirname)
const server = require('http').Server(app)
// const io = require('socket.io')(server)
// require('./socketio')(io)
server.listen(4000);