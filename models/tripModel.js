    const sequelize = require('./../sequelize.js');
    const Sequelize = require('sequelize');
    const User = require('./userModel');

    // Définition du modèle Voyage sans passagerId
    const Voyage = sequelize.define('Voyage', {
        voyageId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'voyageId'
        },
        conducteurId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'conducteurId',
            references: {
                model: User,
                key: 'userID'
            }
        },
        Depart: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'Depart'
        },
        Destination: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'Destination'
        },
        timestamp: {
            type: Sequelize.DATE,
            allowNull: false, // Assurez-vous que le champ timestamp est toujours fourni lors de la création d'un voyage
            field: 'Timestamp'
        }, 
        placeDisponible: {
            type: Sequelize.INTEGER,
            field: 'placeDisponible',
            allowNull: false,
        }
    }, {
        timestamps: false
    });

    // Définition de la table de jointure VoyagePassagers
    const VoyagePassagers = sequelize.define('VoyagePassagers', {
        voyageId: {
            type: Sequelize.INTEGER,
            references: {
                model: Voyage,
                key: 'voyageId'
            }
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: User,
                key: 'userID'
            }
        },
        status: {
            type: Sequelize.ENUM('EN-ATTENTE', 'ACCETPTE', '    '),
            field: 'status'  // Column name in the database
        }
    }, {
        timestamps: false
    });

    // Définition des relations
    Voyage.belongsToMany(User, { through: VoyagePassagers, foreignKey: 'voyageId', otherKey: 'userId' });
    User.belongsToMany(Voyage, { through: VoyagePassagers, foreignKey: 'userId', otherKey: 'voyageId' });

    module.exports = { Voyage, VoyagePassagers };