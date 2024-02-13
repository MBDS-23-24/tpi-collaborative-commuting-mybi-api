const express =require('express');
const app = express();
const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);


app.use(express.json());
//app.use(express.static('public')); // Serve les fichiers statiques

// Middleware pour autoriser les requêtes CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

let clients = {};

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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
