const Sequelize = require('sequelize');

const sequelize = new Sequelize('commutingDB', 'commutingAdmin', 'badisBoucheffa123@', {
    host: 'commuting.database.windows.net',
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true
        }
    }
});


sequelize.sync({ force: false }) // Set force to true only if you want to drop and recreate tables
    .then(() => {
        console.log('Database & tables created!');
    });

module.exports = sequelize;