require('dotenv').config();
const express = require('express');
const http = require('http');
const userApi = require('./api/userApi');
const messageApi = require('./api/messageApi');
const avisApi = require('./api/avisApi.js');

const { router: loginApi, authenticateToken } = require('./api/loginApi'); // Modification ici
const User = require('./models/userModel.js');
const Position = require('./models/postionModel.js'); 
const Avis = require('./models/avisModel.js');
const Message = require('./models/messageModel.js');
const Trip = require('./models/tripModel.js');
const app = express();

//const { createMultipleUsers } = require('./test/puplerdatabase.js');
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
app.use('/api/avis', avisApi);
app.use('',loginApi);
app.use('/api/messages', messageApi);

io.on('connection', (socket) => {
    console.log('Client connecté:', socket.id);
  
    // Enregistrer le client en utilisant l'ID de socket comme clé
    clients[socket.id] = socket;
  
    // Gérer l'événement "signin"
    socket.on("signin", (userId) => {
      // Associer l'ID utilisateur au socket pour un accès facile
      clients[userId] = socket;
      console.log(`Utilisateur ${userId} connecté avec socket ${socket.id}`);
    });
  
    socket.on('disconnect', () => {
        // Supprimer le client sur la déconnexion
        delete clients[socket.id];
        console.log('Client déconnecté:', socket.id);
    });
  
    socket.on('message', (/*{ toId, message }*/message) => {
        console.log(`Message de ${message.sourceId} à ${message.targetId}:`, message.message);
        // Envoyer le message au destinataire si disponible
        if (clients[message.targetId]) {
            clients[message.targetId].emit('message', /*{ fromId: message.sourceId, message }*/ message);
        } else {
            console.log(`Le destinataire ${message.targetId} n'est pas connecté.`);
        }
    });
  });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


