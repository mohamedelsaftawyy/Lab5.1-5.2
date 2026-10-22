const express = require("express");
const app = express();
app.use(express.json());


//Trip data

const trips = [
    {
        id: 1,destination: "Paris", price: 1000, country: "France"
    },
    {id: 2, destination: "New York", price: 1500, country: "USA"},
    {id: 3, destination: "Tokyo", price: 2000, country: "Japan"},
];
let nextId = 4;

app.get("/trips", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Trips retrieved successfully",
    results: trips.length,
    data: trips
  });
});

app.get("/trips/:id", (req, res) => {
    const id = Number(req.params.id);

    for (let i = 0; i < trips.length; i++) {
        if (trips[i].id === id) {
            return res.status(200).json({
                status: "success",
                message: "Trip retrieved successfully",
                data: trips[i]
            });
        }   
    }       

    res.status(404).json({
        status: "fail",
        message: "Trip not found"
    });
});         
    

app.put("/trips/:id", (req, res) => {
    const id = Number(req.params.id);
    const { destination, country, price } = req.body;

    if (!destination || !country || price === undefined) {
        return res.status(400).json({
            status: "fail",
            message: "All fields are required."
        });
    }

    for (let i = 0; i < trips.length; i++) {
        if (trips[i].id === id) {
            trips[i].destination = destination;
            trips[i].country = country;
            trips[i].price = price;

            return res.status(200).json({
                status: "success",
                message: "Trip updated successfully",
                data: trips[i]
            });
        }
    }

    res.status(404).json({
        status: "fail",
        message: "Trip not found"
    });
});

app.delete("/trips/:id", (req, res) => {
    const id = Number(req.params.id);

    for (let i = 0; i < trips.length; i++) {
        if (trips[i].id === id) {
            trips.splice(i, 1);

            return res.status(200).json({
                status: "success",
                message: "Trip deleted successfully"
            });
        }
    }

    res.status(404).json({
        status: "fail",
        message: "Trip not found"
    });
});


app.post("/trips", (req, res) => {
    const { destination, country, price } = req.body;

    if (!destination || !country || price === undefined) {
        return res.status(400).json({ error: "All fields are required." });
    }

    

       const trip = { id: nextId++, destination, country, price };
    trips.push(trip);

    res.status(201).json({
        message: "You are going to " + destination,
        data: trip
    });
});


app.listen(3000, "127.0.0.1" , () => {
  console.log("Server is running.");
});


 



