const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js'); // Remplacez par le chemin correct vers votre instance sequelize
const bcrypt = require('bcrypt');

const User = require('../models/userModel.js'); // Remplacez par le chemin correct vers votre modèle User
const Position = require('../models/postionModel.js'); // Remplacez par le chemin correct vers votre modèle Position

let compteur = 0;
// Fonction pour générer un utilisateur et sa position
// Fonction pour générer un utilisateur et sa position
async function createUserWithPosition() {
    try {
       // Générer un sel pour le hachage du mot de passe
       const salt = await bcrypt.genSalt(10); // Assurez-vous que c'est un nombre

       // Assurez-vous que le mot de passe est une chaîne de caractères
       const password = 'password'; // Remplacez par le mot de passe que vous souhaitez hacher

       // Hacher le mot de passe avec le sel généré
       const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            firstName: `FirstName${compteur}`,
            lastName: `LastName${Math.random()}`,
            email: `user${compteur}@example.com`,
            password: hashedPassword,
            photoURL: 'http://example.com/photo.jpg',
            biography: 'Biography example',
            role: 'PASSAGER' // ou 'CONDUCTEUR' ou 'BOTH'
        });

        compteur++;
        // Créer la position associée à cet utilisateur
        const position = await Position.create({
            latitude: Math.random() * 180 - 90,  
            longitude: Math.random() * 360 - 180,  
            userID: user.userID 
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
  
  