const { db } = require("../db.js");
const { isMissing, trimText, isValidId, isPositiveNumber } = require("../utils/validation.js");

const createTrip = async (req, res) => {
    let { destination, country, cost } = req.body || {};

    if (isMissing(destination) || isMissing(country) || isMissing(cost)) {
        return res.status(400).json({
            status: "fail",
            message: "All fields are required."
        });
    }

    if (!isPositiveNumber(cost)) {
        return res.status(400).json({
            status: "fail",
            message: "Cost must be a positive number."
        });
    }

    destination = trimText(destination);
    country = trimText(country);

    try {
        const [result] = await db.query(
            "INSERT INTO trips (destination, country, cost) VALUES (?, ?, ?)",
            [destination, country, cost]
        );

        res.status(201).json({
            status: "success",
            message: "You are going to " + destination,
            data: { id: result.insertId, destination, country, cost }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

const retrieveAllTrips = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM trips");

        res.status(200).json({
            status: "success",
            message: "Trips retrieved successfully",
            results: rows.length,
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

const retrieveTripById = async (req, res) => {
    const id = Number(req.params.id);

    if (!isValidId(id)) {
        return res.status(400).json({
            status: "fail",
            message: "ID must be a positive integer."
        });
    }

    try {
        const [rows] = await db.query("SELECT * FROM trips WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Trip not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Trip retrieved successfully",
            data: rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

const checkBudget = async (req, res) => {
    const { budget } = req.body || {};

    try {
        const [rows] = await db.query("SELECT * FROM trips WHERE cost <= ?", [budget]);

        res.status(200).json({
            status: "success",
            message: "Trips within your budget",
            results: rows.length,
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

const updateTrip = async (req, res) => {
    const id = Number(req.params.id);
    let { destination, country, cost } = req.body || {};

    if (!isValidId(id)) {
        return res.status(400).json({
            status: "fail",
            message: "ID must be a positive integer."
        });
    }

    if (isMissing(destination) || isMissing(country) || isMissing(cost)) {
        return res.status(400).json({
            status: "fail",
            message: "All fields are required."
        });
    }

    if (!isPositiveNumber(cost)) {
        return res.status(400).json({
            status: "fail",
            message: "Cost must be a positive number."
        });
    }

    destination = trimText(destination);
    country = trimText(country);

    try {
        const [result] = await db.query(
            "UPDATE trips SET destination = ?, country = ?, cost = ? WHERE id = ?",
            [destination, country, cost, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Trip not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Trip updated successfully",
            data: { id, destination, country, cost }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

const deleteTrip = async (req, res) => {
    const id = Number(req.params.id);

    if (!isValidId(id)) {
        return res.status(400).json({
            status: "fail",
            message: "ID must be a positive integer."
        });
    }

    try {
        const [result] = await db.query("DELETE FROM trips WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Trip not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Trip deleted successfully"
        });
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                status: "fail",
                message: "Cannot delete this trip because it has reviews."
            });
        }
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

const getTripRatings = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT t.id, t.destination, t.country, r.rating FROM trips t LEFT JOIN reviews r ON t.id = r.trip_id"
        );

        res.status(200).json({
            status: "success",
            message: "Trips and ratings retrieved successfully",
            results: rows.length,
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

module.exports = {
    createTrip,
    retrieveAllTrips,
    retrieveTripById,
    checkBudget,
    updateTrip,
    deleteTrip,
    getTripRatings
};