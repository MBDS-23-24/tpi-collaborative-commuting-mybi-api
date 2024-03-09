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

    socket.on('addRequest', (data) => {
      const newRequest = { ...data, time: new Date(), status: 'pending', type: data.type };
      addRequest(newRequest);
    });
  
    socket.on('addFakeRequest', (data) => {
      if (data.type === 'driver') {
        addRequest(data);
      } else {
        console.log('Invalid fake request type');
      }
    });
  
    socket.on('deletePassenger', (userId) => {
      const index = passengers.findIndex((passenger) => passenger.userId === userId);
      if (index !== -1) {
        const deletedPassenger = passengers[index];
        passengers.splice(index, 1);
        return deletedPassenger;
      } else {
        return null;
      }
    });
  
    socket.on('deleteDriver', (userId) => {
      const index = drivers.findIndex((driver) => driver.userId === userId);
      if (index !== -1) {
        const deletedDriver = drivers[index];
        drivers.splice(index, 1);
        return deletedDriver;
      } else {
        return null;
      }
    });
  
    socket.on('getDrivers', ({ originLat, originLong, destinationLat, destinationLong }) => {
      const filteredDrivers = filterDriversByOriginAndDestination(originLat, originLong, destinationLat, destinationLong);
      console.log('Je suis entreeeeeeeeeeeee');
      console.log('requestRide:', getDrivers);

      socket.emit('drivers', filteredDrivers);
    });
  
    socket.on('getPassengers', ({ originLat, originLong, destinationLat, destinationLong }) => {
      const filteredPassengers = filterPassengersByOriginAndDestination(originLat, originLong, destinationLat, destinationLong);
      socket.emit('passengers', filteredPassengers);
      console.log('Filtered passengers:', filteredRequests);
  
     // socket.emit('callDrivers', filteredPassengers);
  
    });
  
    socket.on('getAllDrivers', () => {
      socket.emit('allDrivers', drivers);
    });

    // Handle ride request from passenger to driver
    socket.on('requestRide', (data) => {
      const { driverId, passengerId, originLat, originLong, destinationLat, destinationLong } = data;
      console.log('requestRide:', driverId);
      //socket.emit('hak', data);
     // socket.emit('SendrideRequest', data);
  
      addRideRequest(passengerId, driverId, originLat, originLong, destinationLat, destinationLong);
  
    });
  
    socket.on('getDriverRequests', (driverId) => {
  
      const requests = getRideRequestsForDriver(driverId);
    //  console.log('Driver getRideRequestsForDriver:', requests);
  
      socket.emit('driverRequests', requests);
     // socket.emit('callDrivers', requests);
     console.log('Driver response:', driverId);
  
  
    });
    socket.on('SendrideRequest', (data) => {
      // Handle the driver's response here
      //console.log('Driver response:', data);
      socket.emit('hak', data);
  
      // You can send the response back to the passenger or perform any other actions as needed
    });
    socket.on('callme', (data) => {
      // Handle the driver's response here
     console.log('callDriverscallDriverscallDriverscallDrivers:', data);
      socket.emit('callDrivers', data);
  
      // You can send the response back to the passenger or perform any other actions as needed
    });
  });

  // ********************************************    Functions of Map     ********************************************

  function addRideRequest(passengerId, driverId, originLat, originLong, destinationLat, destinationLong) {
    // Find the driver and passenger by their IDs
    const driver = drivers.find(driver => driver.userId === driverId);
    const passenger = passengers.find(passenger => passenger.userId === passengerId);
  
    // Calculate the distance between the driver's origin and the passenger's origin
    const distance = calculateDistance(driver.originLat, driver.originLong, originLat, originLong);
    const time = new Date(); // Get the current time
  
    // Create a new request object with the required information
    const newRequest = { passengerId, driverId, originLat, originLong, destinationLat, destinationLong, distance,time };
  
    // Push the new request object into the driverRequests list
    driverRequests.push(newRequest);
  }
  function getRideRequestsForDriver(driverId) {
    //console.log('getRideRequestsForDriver driverRequests:', driverRequests);
    
    // If driverId is an object, extract the driverId value
    const id = typeof driverId === 'object' ? driverId.driverId : driverId;
   // console.log('driverId:', id);
    
    // Filter the driverRequests array based on driverId
    const filteredRequests = driverRequests.filter((request) => {
     // console.log('request.driverId:', request.driverId);
      
      // Check if request.driverId matches the extracted driverId value
      return request.driverId === id;
    });
  
    //console.log('Filtered requests:', filteredRequests);
    
    return filteredRequests;
  }
  
  
  // Function to calculate the distance between two coordinates using the Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;
    return distance;
  }
  
  // Function to add a new request
  function addRequest(data) {
    io.emit('request', data);
  
    if (data.type === 'PASSAGER') {
      passengers.push(data);
    } else if (data.type === 'CONDUCTEUR') {
      drivers.push(data);
    }
  }
  
  // Function to filter drivers based on origin and destination
  function filterDriversByOriginAndDestination(originLat, originLong, destinationLat, destinationLong) {
    return drivers.filter((driver) => {
      const originDistance = calculateDistance(originLat, originLong, driver.originLat, driver.originLong);
      const destinationDistance = calculateDistance(destinationLat, destinationLong, driver.destinationLat, driver.destinationLong);
      return originDistance <= 300 && destinationDistance <= 300;
    });
  }
  
  // Function to filter passengers based on origin and destination
  function filterPassengersByOriginAndDestination(originLat, originLong, destinationLat, destinationLong) {
    return passengers.filter((passenger) => {
      const originDistance = calculateDistance(originLat, originLong, passenger.originLat, passenger.originLong);
      const destinationDistance = calculateDistance(destinationLat, destinationLong, passenger.destinationLat, passenger.destinationLong);
      return originDistance <= 300 && destinationDistance <= 300;
    });
  }
  

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


