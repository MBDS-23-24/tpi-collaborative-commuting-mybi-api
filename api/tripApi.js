const express = require('express');
const router = express.Router();
const tripModel = require('../models/tripModel');
const User = require('../models/userModel');
const Sequelize = require('sequelize');
const { authenticateToken } = require('./loginApi');

// Post Trip
router.post('/createTrip', authenticateToken,async (req,res)=>{
    try{
        const trip =  await tripModel.Voyage.create(req.body);
        res.status(201).json(trip);
    }catch(error){
        res.status(400).json({ error: error.message });
    }

});

// Get  trips

// Endpoint pour récupérer tous les voyages d'un utilisateur, soit comme conducteur, soit comme passager
router.get('/getTripsUser/:userId', authenticateToken, async (req, res) => {
    const userId = parseInt(req.params.userId);

    try {
        // Récupère les voyages où l'utilisateur est conducteur directement
        const driverTrips = await tripModel.Voyage.findAll({
            where: { conducteurId: userId },
            order: [['timestamp', 'DESC']]
        });

        // Pour obtenir les voyages où l'utilisateur est passager, il faut faire une jointure via la table `VoyagePassagers`
        const passengerTrips = await Voyage.findAll({
            include: [{
                model: User,
                as: 'Passagers',
                required: true,
                through: { model: VoyagePassagers, where: { userId: userId } }
            }],
            order: [['timestamp', 'DESC']]
        });

        res.json({
            driverTrips,
            passengerTrips
        });
    } catch (error) {
        console.error('Error fetching trips for user:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/getTripDrvier/:userId',authenticateToken, async (req,res)=>{
    const userId = parseInt(req.params.userId);
    try{
// Récupère les voyages où l'utilisateur est conducteur directement
        const driverTrips = await  tripModel.Voyage.findAll({
            where: { conducteurId: userId },
            order: [['timestamp', 'DESC']]
                });
        res.json(driverTrips);
    }catch(error){
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

router.get('/getTripPassager/:userId',authenticateToken, async (req,res)=>{    
    const userId = parseInt(req.params.userId);
    try{
        const passengerTrips = await  tripModel.Voyage.findAll({
            include: [{
                model: User,
                as: 'Passagers',
                required: true,
                through: { model: VoyagePassagers, where: { userId: userId } }
            }],
            order: [['timestamp', 'DESC']]

        });        res.json(passengerTrips);
    }catch(error){
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});


// Endpoint pour récupérer un voyage par son ID
router.get('/getTripById/:tripId', authenticateToken, async (req, res) => {
    const tripId = parseInt(req.params.tripId);

    try {
        // Utiliser findByPk pour récupérer le voyage par son ID primaire
        const trip = await  tripModel.Voyage.findByPk(tripId);

        // Si le voyage n'existe pas, renvoyer une réponse 404
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        res.json(trip);
    } catch (error) {
        console.error('Error fetching trip by ID:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});


// Endpoint pour récupérer des voyages par filtres
router.get('/getTripByFilter', authenticateToken, async (req, res) => {
    // Récupérer les paramètres de requête pour les filtres
    const { depart, destination, dateDepartSouhaite } = req.query;

    try {
        // Filtrer les voyages selon les critères en s'assurant que les comparaisons sont insensibles à la casse
        const trips = await Voyage.findAll({
            where: {
                // Utilise Sequelize.where et Sequelize.fn pour ignorer la casse lors de la comparaison
                Depart: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Depart')), Sequelize.fn('LOWER', depart)),
                Destination: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Destination')), Sequelize.fn('LOWER', destination)),
                timestamp: {
                    [Op.gte]: new Date(dateDepartSouhaite) // Assurez-vous que la date est correctement formatée
                }
            },
            order: [['timestamp', 'DESC']] // Optionnel: trier par timestamp si nécessaire
        });

        res.json(trips);
    } catch (error) {
        console.error('Error fetching trips by filter:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});   


// put trip

router.put('/updateTrip/:tripId/:userId', authenticateToken, async (req, res) => {
    const tripId = parseInt(req.params.tripId);
    const userId = parseInt(req.params.userId);


    try {
        // Récupérer le voyage par son ID
        const trip = await  tripModel.Voyage.findByPk(tripId);

        // Si le voyage n'existe pas, renvoyer une réponse 404
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        // Mettre à jour le voyage avec les nouvelles valeurs
        await trip.update(req.body);

        res.json(trip);
    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});