const express = require('express');
const router = express.Router();
const tripModel = require('../models/tripModel');
const User = require('../models/userModel');
const { authenticateToken } = require('./loginApi');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
router.post('/createTrip', authenticateToken, async (req, res) => {
    try {
        // Transformation des données reçues pour s'assurer qu'elles correspondent au modèle
        const data = {
            ...req.body,
            timestamp: req.body.Timestamp // Assurez-vous que cela correspond au champ de votre modèle
        };
        const trip = await tripModel.Voyage.create(data);
        res.status(201).json(trip);
    } catch (error) {
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


router.get('/getTripByFilter', authenticateToken, async (req, res) => {
    const { depart, destination, dateDepartSouhaite } = req.query;
  
    const departKeyword = extractLocationKeyword(depart);
    const destinationKeyword = extractLocationKeyword(destination);
  
    const startDate = new Date(dateDepartSouhaite);
    startDate.setHours(startDate.getHours() - 4);
    const endDate = new Date(dateDepartSouhaite);
    endDate.setHours(endDate.getHours() + 4);
  
    try {
      const trips = await tripModel.Voyage.findAll({
        where: {
          // Utiliser Sequelize.fn pour appliquer la fonction LOWER à la colonne et Sequelize.where pour la comparaison
          Depart: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Depart')), 'LIKE', Sequelize.fn('LOWER', departKeyword)),
          Destination: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Destination')), 'LIKE', Sequelize.fn('LOWER', destinationKeyword)),
          timestamp: { [Op.between]: [startDate, endDate] }
        },
        order: [['timestamp', 'DESC']]
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


// Endpoint pour récupérer les passagers d'un voyage spécifique
router.get('/getPassengersByTrip/:tripId', authenticateToken, async (req, res) => {
    const { tripId } = req.params;

    try {
        // Récupère les passagers en utilisant une jointure avec la table VoyagePassagers
        const passengers = await User.findAll({
            include: [{
                model: tripModel.Voyage,
                required: true,
                through: {
                     model:tripModel.VoyagePassagers,
                    where: { voyageId: tripId }
                }
            }]
        });

        if (!passengers.length) {
            return res.status(204).json({ message: "No passengers found for this trip" });
        }

        res.json(passengers);
    } catch (error) {
        console.error('Error fetching passengers by trip:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});


////////////////////// fonction ////////////////////

const extractLocationKeyword = (locationString) => {
    if (!locationString) return '%';
    const parts = locationString.split(',').map(part => part.trim());
    let searchKeyword;
  
    // Plus de deux virgules, prendre l'élément à l'index length - 3
    if (parts.length >= 3) {
      searchKeyword = parts[parts.length - 3];
    } else if (parts.length === 2) {
      // Une seule virgule, prendre le premier élément
      searchKeyword = parts[0];
    } else {
      // Aucune ou une virgule, prendre la chaîne entière
      searchKeyword = locationString;
    }
  
    return `%${searchKeyword.toLowerCase()}%`;
  };

module.exports = router;
