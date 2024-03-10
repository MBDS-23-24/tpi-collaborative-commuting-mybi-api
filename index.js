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

const setupSocketHandlers = require('./socket/socketHandlers.js');

//const { createMultipleUsers } = require('./test/puplerdatabase.js');
// WebSocket 

const server = http.createServer(app);
const io = require('socket.io')(server);
// client pour la partie message
let clients = {};
// Initialize arrays to store passengers and drivers separately
let passengers = [];
let drivers = [];
let driverRequests = [];

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

// Express route to serve static files or other routes if needed
app.get('/', (req, res) => {
  res.send('Hello World!');
});

setupSocketHandlers(io, clients, passengers, drivers, driverRequests); 
  

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


