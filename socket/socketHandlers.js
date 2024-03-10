const mapFunctions = require('../map/functionMap.js');
//  module.exports = { filterPassengersByOriginAndDestination, filterDriversByOriginAndDestination, addRequest,calculateDistance,updateDriverStatus,getRideRequestsForDriver,addRideRequest };
const { filterPassengersByOriginAndDestination, filterDriversByOriginAndDestination, addRequest,calculateDistance,updateDriverStatus,getRideRequestsForDriver,addRideRequest } = mapFunctions;

module.exports = function(io, clients, passengers, drivers, driverRequests) {

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
          console.log('addRequest: ', data);
    
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
      
        socket.on('deleteMyrequest', (userId) => {
          // Find the index of the request in driverRequests array based on user ID
          const index = driverRequests.findIndex(request => request.passengerId === userId);
      
          if (index !== -1) {
            const deletedRequest = driverRequests.splice(index, 1)[0]; // Remove the request and get it
            
            console.log(`Request deleted for passenger ID ${userId}`);
          } else {
            console.log(`No request found for passenger ID ${userId}`);
          }
        });
        socket.on('getDrivers', ({ originLat, originLong, destinationLat, destinationLong }) => {
          const filteredDrivers = filterDriversByOriginAndDestination(originLat, originLong, destinationLat, destinationLong);
          console.log('Je suis entreeeeeeeeeeeee');
          console.log('requestRide:', filteredDrivers);
    
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
          updateDriverStatus(driverId,"In Progress");
      
        });
        socket.on('rejectRequest', (data) => {
          const { passengerId, driverId } = data;
        
          // Update the status of the ride request to "Rejected"
          const index = driverRequests.findIndex(request => request.passengerId === passengerId && request.driverId === driverId);
          updateDriverStatus(driverId,"Rejected");
        
          if (index !== -1) {
            const deletedRequest = driverRequests.splice(index, 1)[0]; // Remove the request and get it
        
            // Emit an event to notify the passenger about the status update
            //io.emit(`rideRequestStatusUpdated_${passengerId}`, { status: 'Rejected' });
            io.emit(`rideRejected`, { status: 'Rejected' });
        
            console.log(`Ride request rejected for passenger ${passengerId} by driver ${driverId}`);
          } else {
            console.log(`Ride request not found for passenger ${passengerId} and driver ${driverId}`);
          }
        });
    
        socket.on('acceptRequest', (data) => {
          const { passengerId, driverId } = data;
        
          // Update the status of the ride request to "Accepted"
          const index = driverRequests.findIndex(request => request.passengerId === passengerId && request.driverId === driverId);
        
          if (index !== -1) {
            updateDriverStatus(driverId,"Accepted");
        
        
            // Emit an event to notify the passenger about the status update
            io.emit(`rideAccepted`, { status: 'Accepted' });
        
            console.log(`Ride request accepted for passenger ${passengerId} by driver ${driverId}`);
          } else {
            console.log(`Ride request not found for passenger ${passengerId} and driver ${driverId}`);
          }
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

};