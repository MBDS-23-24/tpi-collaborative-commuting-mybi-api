const sequelize = require('./../sequelize.js');
const Sequelize = require('sequelize'); // Importation de Sequelize
const User = require('./userModel');
// Nouveau modèle Position
const Position = sequelize.define('Position', {
    positionID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'PositionID'
    },
    latitude: {
        type: Sequelize.DOUBLE,
        field: 'Latitude'
    },
    longitude: {
        type: Sequelize.DOUBLE,
        field: 'Longitude'
    },
},{
    timestamps: false,
});

User.hasOne(Position, {
    foreignKey: 'userID',
    as: 'position'
});

module.exports = Position;