const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Assurez-vous d'utiliser bcrypt pour la vérification du mot de passe
const User = require('../models/userModel');

let validRefreshTokens = [];


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ where: { email } });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérification du mot de passe (assurez-vous que le mot de passe dans la base est hashé)
    //const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    //
  }

    // Création du token si les identifiants sont valides
    console.log(process.env.ACCESS_TOKEN_SECRET);
    console.log( user.userID );

    const accessToken = jwt.sign({ userId: user.userID }, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = jwt.sign({ userId: user.userID }, process.env.REFRESH_TOKEN_SECRET);
    console.log(accessToken); 
    res.json({ accessToken });
    validRefreshTokens.push(refreshToken);

  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Route pour rafraîchir le token
router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  
  if (!validRefreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
      res.json({ accessToken });
  });
});

// Assurez-vous d'ajouter router à votre application express
// app.use(router);
exports.router = router;
exports.authenticateToken = authenticateToken;
