require('dotenv').config()
const app = require('./app')(__dirname)
const server = require('http').Server(app)
const port = process.env.PORT || 4000
// const io = require('socket.io')(server)
// require('./socketio')(io)
server.listen(port);