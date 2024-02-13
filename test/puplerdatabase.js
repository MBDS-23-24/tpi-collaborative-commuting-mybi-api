const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js'); // Remplacez par le chemin correct vers votre instance sequelize
const bcrypt = require('bcrypt');
const Message = require('../models/messageModel.js'); // Remplacez par le chemin correct vers votre modèle Message
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
            firstName: `FirstName ${compteur}`,
            lastName: `LastName ${compteur}`,
            email: `user${compteur}@example.com`,
            password: hashedPassword,
            photoURL: 'http://example.com/photo.jpg',
            biography: 'Biography example',
            role: 'PASSAGER' // ou 'CONDUCTEUR' ou 'BOTH'
        });

        compteur++;

        //console.log(`Utilisateur créé avec l'ID: ${user.userID}, Position créée avec l'ID: ${position.positionID}`);
    } catch (error) {
        console.error('Erreur lors de la création de l’utilisateur et de la position :', error);
    }
}

// creation des messages
async function createMessage(senderId, receiverId, content) {
    try {
        const message = await Message.create({
            senderId: senderId,
            receiverId: receiverId,
            content: content,
            timestamp: new Date() // Ou utilisez Sequelize.NOW
        });

        //console.log(`Message créé avec l'ID: ${message.messageId}`);
    } catch (error) {
        console.error('Erreur lors de la création du message :', error);
    }
}


// Créer des messages pour les utilisateurs
async function createMessagesForUsers() {
    try {
        const users = await User.findAll();
        for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < users.length; j++) {
                if (i !== j) { // Assurez-vous que l'expéditeur et le destinataire ne sont pas la même personne
                    await createMessage(users[i].userID, users[j].userID, `Message de ${users[i].firstName} à ${users[j].firstName}`);
                }
            }
        }
    } catch (error) {
        console.error('Erreur lors de la création des messages entre utilisateurs :', error);
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

// Fonction pour générer une position pour un utilisateur
async function createPositionForUser(userId) {
    try {
        const position = await Position.create({
            latitude: Math.random() * 180 - 90,  // Génération d'une latitude aléatoire
            longitude: Math.random() * 360 - 180,  // Génération d'une longitude aléatoire
            userID: userId // ID de l'utilisateur
        });

        //console.log(`Position créée pour l'utilisateur ID ${userId} : Latitude ${position.latitude}, Longitude ${position.longitude}`);
    } catch (error) {
        console.error('Erreur lors de la création de la position :', error);
    }
}

// Créer des positions pour les utilisateurs
async function createPositionsForUsers() {
    try {
        const users = await User.findAll();
        for (const user of users) {
            await createPositionForUser(user.userID);
        }
    } catch (error) {
        console.error('Erreur lors de la création des positions pour les utilisateurs :', error);
    }
}


createMultipleUsers(15).then(() => {
    console.log('100 utilisateurs ont été créés.');
    createMessagesForUsers().then(() => {
        console.log('Messages entre utilisateurs ont été créés.');
    });
    createPositionsForUsers().then(() => {
        console.log('Positions pour les utilisateurs ont été créées.');
    });
});
