// Define the Request model structure
const Request = {
    userId: {
        type: 'INTEGER',
        primaryKey: true,
        allowNull: false,
        field: 'UserID'
    },
    originLat: {
        type: 'DOUBLE',
        allowNull: false,
        field: 'OriginLat'
    },
    originLong: {
        type: 'DOUBLE',
        allowNull: false,
        field: 'OriginLong'
    },
    destinationLat: {
        type: 'DOUBLE',
        allowNull: false,
        field: 'DestinationLat'
    },
    destinationLong: {
        type: 'DOUBLE',
        allowNull: false,
        field: 'DestinationLong'
    },
    time: {
        type: 'DATE',
        defaultValue: Date.now(),
        field: 'Time'
    },
    seats: {
        type: 'INTEGER', // Adjust the data type based on your requirements
        allowNull: false,
        field: 'Seats' // Add the Seats field
    },
    status: {
        type: 'STRING', // Adjust the data type based on your requirements
        allowNull: false,
        field: 'Status'
    },
    type: {
        type: 'STRING',
        allowNull: false,
        field: 'Type' // Add the Type field
    }
};

module.exports = Request;
