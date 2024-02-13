const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');
const User = require('./userModel.js'); // Assurez-vous que le chemin est correct

const Message = sequelize.define('Message', {
    messageId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'MessageID'
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
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: 'Content'
    },
    timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'Timestamp'
    }
}, {
    timestamps: false
});

module.exports = Message;
