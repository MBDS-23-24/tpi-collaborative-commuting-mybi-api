const express = require('express');
const router= express.Router();
const Message = require('../models/messageModel');
const Sequelize = require('sequelize');
const { authenticateToken } = require('./loginApi');



router.post('/',authenticateToken, async (req, res) => {  
    try {
        const message = await Message.create(req.body);
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



router.get('/getLatestMessages/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId; // Récupère l'ID de l'utilisateur

        // Requête pour récupérer le dernier message pour chaque couple sender-receiver
        // où l'utilisateur est soit le sender, soit le receiver
        const latestMessages = await Message.findAll({
            attributes: [
                [Sequelize.fn('max', Sequelize.col('timestamp')), 'latestTimestamp'],
                'senderId',
                'receiverId',
            ],
            where: {
                [Sequelize.Op.or]: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            group: ['senderId', 'receiverId'],
            order: [[Sequelize.fn('max', Sequelize.col('timestamp')), 'DESC']]
        });

        res.json(latestMessages);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});



router.get('/messagesBetween/:senderId/:receiverId', authenticateToken, async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        const messages = await Message.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            },
            order: [['timestamp', 'ASC']]
        });

        if (messages.length > 0) {
            res.json(messages);
        } else {
            res.status(404).send('No messages found between these users');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});
module.exports = router;
