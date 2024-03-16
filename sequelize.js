const Sequelize = require('sequelize');

const sequelize = new Sequelize('CommutingDB2', 'commutingAdmin', 'badisBoucheffa123@', { // name, username, and password
    host: 'commutingdb.database.windows.net',
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true
        }
    }
}); 

// Importation des modèles


sequelize.sync({ force: false }) // Set force to true only if you want to drop and recreate tables
    .then(() => {
        console.log('Database & tables created!');
    });

module.exports = sequelize;