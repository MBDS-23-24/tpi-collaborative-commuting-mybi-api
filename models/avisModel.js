const sequelize = require('./../sequelize.js');
const Sequelize = require('sequelize');
const User = require('./userModel');

// Modèle Avis corrigé avec ajout d'une note
const Avis = sequelize.define('Avis', {
    AvisId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'AvisId'
    },
    senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'SenderID',
        references: {
            model: User,
            key: 'userID'
        }
    },
    receiverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'ReceiverID',
        references: {
            model: User,
            key: 'userID'
        }
    },
    Comment: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: 'Comment'
    },
    Rating: {
        type: Sequelize.INTEGER, // ou Sequelize.FLOAT si vous souhaitez autoriser les demi-points par exemple
        allowNull: false,
        validate: {
            min: 1, // Note minimale
            max: 5  // Note maximale
        },
        field: 'Rating'
    },
    timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'Timestamp'
    }
}, {
    timestamps: false
});

module.exports = Avis;
