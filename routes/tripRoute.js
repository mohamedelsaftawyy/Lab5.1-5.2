const express = require("express");
const {
    createTrip,
    retrieveAllTrips,
    retrieveTripById,
    checkBudget,
} = require('../controller/TripController.js');

const { validateBudget } = require('../utils/middlewares.js'); 

const tripRouter = express.Router();

tripRouter.post("/", createTrip);

tripRouter.get("/", retrieveAllTrips);

tripRouter.get("/:id", retrieveTripById);

tripRouter.post("/check-budget", validateBudget, checkBudget);



module.exports = tripRouter;
