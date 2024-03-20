const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { authenticateToken } = require('./loginApi'); // Assurez-vous que le chemin est correct
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    try {
        // Récupérez le mot de passe de la requête
        const { password } = req.body;

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        req.body.password = hashedPassword;

        const newUser = await User.create(req.body);

        const userToReturn = { ...newUser.toJSON() };
        delete userToReturn.password;
        res.status(201).json(userToReturn);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/checkEmail', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            // L'email existe déjà dans la base de données
            res.json({ exists: true });
        } else {
            // L'email n'existe pas dans la base de données
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Get all users
router.get('/',authenticateToken, async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error:', error); // Log the error to the console
        res.status(500).json({ error: error.message || 'Internal Server Error' });    }
});

// Get a single user by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error:', error); // Log the error to the console
        res.status(500).json({ error: error.message || 'Internal Server Error' });    }
});

// Update a user
router.put('/:id', authenticateToken,async (req, res) => {
    try {
        const updated = await User.update(req.body, {
            where: { userID: req.params.id }
        });
        console.log(req.body);
        if (updated) {
            const updatedUser = await User.findByPk(req.params.id);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error:', error); // Log the error to the console
        res.status(500).json({ error: error.message || 'Internal Server Error' });    }
});

// Delete a user
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { userID: req.params.id }  
        });
        if (deleted) {
            res.status(204).send('User deleted');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});




module.exports = router;
            