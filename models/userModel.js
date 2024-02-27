const Sequelize = require('sequelize');
const sequelize = require('./../sequelize.js');
const User = sequelize.define('User', {
    // Map Sequelize model attributes to table column names
    userID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'UserID'  // Column name in the database
    },
    firstName: {
        type: Sequelize.STRING,
        field: 'FirstName'  // Column name in the database
    },
    lastName: {
        type: Sequelize.STRING,
        field: 'LastName'  // Column name in the database
    },
    email: {
        type: Sequelize.STRING,
        field: 'Email'  // Column name in the database
    },
    password: {
        type: Sequelize.STRING,
        field: 'Password'  // Column name in the database
    },
    photoURL: {
        type: Sequelize.STRING,
        field: 'PhotoURL'  // Column name in the database
    },
    biography: {
        type: Sequelize.TEXT,
        field: 'Biography'  // Column name in the database
    },
    role: {
        type: Sequelize.ENUM('CONDUCTEUR', 'PASSAGER', 'BOTH'),
        field: 'Role'  // Column name in the database
    },
},
 {
    timestamps: false, // Disable    automatic timestamps
},);
User.removeAttribute('id');


module.exports = User;
