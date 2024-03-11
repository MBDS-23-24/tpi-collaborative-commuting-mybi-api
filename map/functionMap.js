
// ********************************************    Functions of Map     ********************************************

function addRideRequest(passengerId, driverId, originLat, originLong, destinationLat, destinationLong) {

    const existingRequest = driverRequests.find(request => request.passengerId === passengerId && request.driverId === driverId);
  
    if (existingRequest) {
      console.log('You have already sent a request to this driver.');
      return; // Exit the function if a request already exists
    }
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
  function updateDriverStatus(driverId, newStatus) {
    // Find the driver by their ID
    const driverIndex = drivers.findIndex(driver => driver.userId === driverId);
  
    // If driver is found, update their status
    if (driverIndex !== -1) {
      drivers[driverIndex].status = newStatus;
      console.log(`Driver ${driverId} status updated to ${newStatus}`);
    } else {
      console.log(`Driver ${driverId} not found`);
    }
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
  function addRequest(data,io) {
    io.emit('request', data); //il faut ajouter ici marwna
  
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
  
  module.exports = { filterPassengersByOriginAndDestination, filterDriversByOriginAndDestination, addRequest,calculateDistance,updateDriverStatus,getRideRequestsForDriver,addRideRequest };