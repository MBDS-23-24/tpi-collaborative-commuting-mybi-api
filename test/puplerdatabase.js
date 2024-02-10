const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js'); // Remplacez par le chemin correct vers votre instance sequelize

const User = require('../models/userModel.js'); // Remplacez par le chemin correct vers votre modèle User
const Position = require('../models/postionModel.js'); // Remplacez par le chemin correct vers votre modèle Position

// Fonction pour générer un utilisateur et sa position
async function createUserWithPosition() {
    try {
        const user = await User.create({
            firstName: `FirstName${Math.random()}`,
            lastName: `LastName${Math.random()}`,
            email: `user${Math.random()}@example.com`,
            password: 'password', // Utilisez une méthode de hachage sécurisée dans la production
            photoURL: 'http://example.com/photo.jpg',
            biography: 'Biography example',
            role: 'PASSAGER' // ou 'CONDUCTEUR' ou 'BOTH'
        });

        const position = await Position.create({
            latitude: Math.random() * 180 - 90,  // Latitude aléatoire
            longitude: Math.random() * 360 - 180,  // Longitude aléatoire
            userID: user.userID // Assurez-vous que cette clé étrangère correspond à votre définition de modèle
        });

        console.log(`Utilisateur créé avec l'ID: ${user.userID}, Position créée avec l'ID: ${position.positionID}`);
    } catch (error) {
        console.error('Erreur lors de la création de l’utilisateur et de la position :', error);
    }
}

// Créer 100 utilisateurs avec positions
async function createMultipleUsers(numberOfUsers) {
    for (let i = 0; i < numberOfUsers; i++) {
        try {
            await createUserWithPosition();
        } catch (error) {
            console.error(`Erreur lors de la création de l'utilisateur numéro ${i}:`, error);
        }
    }
}

createMultipleUsers(100).then(() => {
    console.log('100 utilisateurs et leurs positions ont été créés.');
  });
  