const express = require('express');
const router = express.Router();
const Avis = require('../models/avisModel');
const Sequelize = require('sequelize');
const { authenticateToken } = require('./loginApi');

router.post('/', authenticateToken, async (req, res) => {  
    try {
        const avis = await Avis.create(req.body);
        res.status(201).json(avis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Correction de la récupération des avis en fonction de receiverId
router.get('/getAvis/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        // Assurez-vous de corriger la condition où pour rechercher par senderId ou receiverId selon votre logique métier
        const avis = await Avis.findAll({
            where: {
                receiverId: userId // ou senderId selon la logique
            },
            order: [['timestamp', 'DESC']] // Correction de l'ordre
        });

        res.json(avis);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});


router.get('/averageRating/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const avis = await Avis.findAll({
            where: {
                receiverId: userId 
            },
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('Rating')), 'averageRating']
            ],
            raw: true,
        });

        const averageRating = avis[0].averageRating ? Number(avis[0].averageRating).toFixed(2) : 'Pas d\'avis';

        res.json({ userId, averageRating });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

module.exports = router;
