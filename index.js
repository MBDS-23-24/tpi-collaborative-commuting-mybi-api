require('dotenv').config();
const express = require('express');
const http = require('http');
const userApi = require('./api/userApi');
const { router: loginApi, authenticateToken } = require('./api/loginApi'); // Modification ici
const User = require('./models/userModel.js');
const Position = require('./models/postionModel.js');
const app = express();
const { createMultipleUsers } = require('./test/puplerdatabase.js');
// WebSocket 

const server = http.createServer(app);
const io = require('socket.io')(server);
//
let clients = {};

app.use(express.json()); // for parsing application/json

// Middleware pour autoriser les requêtes CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });



// la partie de les api
app.use('/api/users', userApi);
app.use('',loginApi);


// la partie de WebSocket 
io.on('connection', (socket) => {
  clients[socket.id] = socket;
  console.log('Client connecté:', socket.id);

  socket.on('disconnect', () => {
      delete clients[socket.id];
      console.log('Client déconnecté:', socket.id);
  });

  socket.on('message', ({ toId, message }) => {
      console.log(`Message reçu de ${socket.id} à ${toId}:`, message);
      if (clients[toId]) {
          clients[toId].emit('message', { fromId: socket.id, message });
      }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


