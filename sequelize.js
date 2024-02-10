const Sequelize = require('sequelize');

const sequelize = new Sequelize('commutingDB', 'commutingAdmin', 'badisBoucheffa123@', { // name, username, and password
    host: 'commuting.database.windows.net',
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true
        }
    }
}); 

// Importation des modèles


sequelize.sync({ force: true }) // Set force to true only if you want to drop and recreate tables
    .then(() => {
        console.log('Database & tables created!');
    });

module.exports = sequelize;