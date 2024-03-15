require('dotenv').config();
const express = require('express');
const http = require('http');
const userApi = require('./api/userApi');
const messageApi = require('./api/messageApi');
const avisApi = require('./api/avisApi.js');
const tripApi = require('./api/tripApi.js');

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


app.use(express.json()); // for parsing applicat  ion/json

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
app.use('/api/trip', tripApi);

// Express route to serve static files or other routes if needed
app.get('/', (req, res) => {
  res.send('Hello World!');
});


const setupSocketHandlers = require('./socket/socketHandlers.js');
setupSocketHandlers(io); 
  

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


