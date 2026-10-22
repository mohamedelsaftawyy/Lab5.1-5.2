const {trips} = require("../models/trips");

const retrieveAllTrips = (req, res) => {
    const allTrips = trips;

    res.send(allTrips);
};

const createTrip = (req, res) => {
    const { destination, country, cost, description } = req.body;


    if (!destination || !country || !cost == null) {
        return res.status(400).json({
            status: "fail",
            message: "All fields are required."
        });
    }

    const newTrip = {
        id: trips.length + 1,
        destination,
        country,
        cost,
        description: description || "No description available"
    };

    trips.push(newTrip);

    res.status(201).json({
        status: "success",
        message: "Trip created successfully",
        data: newTrip
    });
};

const retrieveTripById = (req, res) => {
    const id = Number(req.params.id);

    for (let i = 0; i < trips.length; i++) {
        if (trips[i].id === id) {
            return res.status(200).json({
                status: "success",
                data: trips[i]
            });
        }

        return res.status(404).json({
            status: "fail",
            message: "Trip not found"
        });
    }}



    const checkBudget = (req, res) => {
        const budget = req.body.budget;
        console.log("in middleware");
       

        const affordableTrips = [];

        for (let i = 0; i < trips.length; i++){
            if (trips[i].cost <= budget){
                affordableTrips.push(trips[i]) 
                 
            
            }
        }

        return res.status(200).json({
            message: "successfully retrieved"
        });
    

        

        
    }

    module.exports = {
    retrieveAllTrips,
    createTrip,
    retrieveTripById,
    checkBudget
};


