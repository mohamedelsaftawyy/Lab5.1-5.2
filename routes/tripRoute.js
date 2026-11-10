const express = require("express");
const {
    createTrip,
    retrieveAllTrips,
    retrieveTripById,
    checkBudget,
    updateTrip,        // add
    deleteTrip,        // add
    getTripRatings,    // add
} = require('../controller/TripController.js');

const { validateBudget } = require('../utils/middlewares.js');

const tripRouter = express.Router();

tripRouter.post("/", createTrip);

tripRouter.get("/", retrieveAllTrips);

tripRouter.get("/ratings", getTripRatings);   

tripRouter.get("/:id", retrieveTripById);

tripRouter.put("/:id", updateTrip);           

tripRouter.delete("/:id", deleteTrip);        

tripRouter.post("/check-budget", validateBudget, checkBudget);

module.exports = tripRouter;