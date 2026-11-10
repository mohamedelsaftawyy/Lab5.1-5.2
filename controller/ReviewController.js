const { db } = require("../db.js");
const { isMissing, isValidId, isValidRating } = require("../utils/validation.js");

const retrieveAllReviews = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM reviews");

        res.status(200).json({
            status: "success",
            message: "Reviews retrieved successfully",
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

const retrieveReviewById = async (req, res) => {
    const id = Number(req.params.id);

    if (!isValidId(id)) {
        return res.status(400).json({
            status: "fail",
            message: "ID must be a positive integer."
        });
    }

    try {
        const [rows] = await db.query("SELECT * FROM reviews WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Review not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Review retrieved successfully",
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

const createReview = async (req, res) => {
    const { user_id, trip_id, rating } = req.body || {};

    if (isMissing(user_id) || isMissing(trip_id) || isMissing(rating)) {
        return res.status(400).json({
            status: "fail",
            message: "All fields are required."
        });
    }

    if (!isValidId(user_id) || !isValidId(trip_id)) {
        return res.status(400).json({
            status: "fail",
            message: "user_id and trip_id must be positive integers."
        });
    }

    if (!isValidRating(rating)) {
        return res.status(400).json({
            status: "fail",
            message: "Rating must be an integer from 1 to 5."
        });
    }

    try {
        const [users] = await db.query("SELECT id FROM users WHERE id = ?", [user_id]);

        if (users.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        const [trips] = await db.query("SELECT id FROM trips WHERE id = ?", [trip_id]);

        if (trips.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Trip not found"
            });
        }

        const [result] = await db.query(
            "INSERT INTO reviews (user_id, trip_id, rating) VALUES (?, ?, ?)",
            [user_id, trip_id, rating]
        );

        res.status(201).json({
            status: "success",
            message: "Review created successfully",
            data: { id: result.insertId, user_id, trip_id, rating }
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                status: "fail",
                message: "This user already reviewed this trip."
            });
        }
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

const updateReview = async (req, res) => {
    const id = Number(req.params.id);
    const { rating } = req.body || {};

    if (!isValidId(id)) {
        return res.status(400).json({
            status: "fail",
            message: "ID must be a positive integer."
        });
    }

    if (!isValidRating(rating)) {
        return res.status(400).json({
            status: "fail",
            message: "Rating must be an integer from 1 to 5."
        });
    }

    try {
        const [result] = await db.query("UPDATE reviews SET rating = ? WHERE id = ?", [rating, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Review not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Review updated successfully",
            data: { id, rating }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

const deleteReview = async (req, res) => {
    const id = Number(req.params.id);

    if (!isValidId(id)) {
        return res.status(400).json({
            status: "fail",
            message: "ID must be a positive integer."
        });
    }

    try {
        const [result] = await db.query("DELETE FROM reviews WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Review not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Review deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

const getReviewDetails = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT u.username, t.destination, r.rating FROM reviews r INNER JOIN users u ON r.user_id = u.id INNER JOIN trips t ON r.trip_id = t.id"
        );

        res.status(200).json({
            status: "success",
            message: "Review details retrieved successfully",
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
    retrieveAllReviews,
    retrieveReviewById,
    createReview,
    updateReview,
    deleteReview,
    getReviewDetails
};