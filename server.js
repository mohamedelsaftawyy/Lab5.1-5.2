require("dotenv").config();
const app = require("./index");
const {
    db,
    createUsersTable,
    createTripsTable,
    createReviewsTable,
    addManagerColumn,
    insertUsers,
    insertTrips,
    insertReviews
} = require("./db.js");
const PORT = process.env.PORT || 3000;
const hostname = 'localhost';

async function startServer() {

    try {

        await db.query(createUsersTable);
        console.log("Users table created or already exists.");

        const [columns] = await db.query("SHOW COLUMNS FROM users LIKE 'manager_id'");
        if (columns.length === 0) {
            await db.query(addManagerColumn);
            console.log("manager_id column added to users.");
        }

        await db.query(createTripsTable);
        console.log("Trips table created or already exists.");

        await db.query(createReviewsTable);
        console.log("Reviews table created or already exists.");

        const [users] = await db.query("SELECT COUNT(*) AS total FROM users");
        if (users[0].total === 0) {
            await db.query(insertUsers);
            console.log("Test users inserted.");
        }

        const [trips] = await db.query("SELECT COUNT(*) AS total FROM trips");
        if (trips[0].total === 0) {
            await db.query(insertTrips);
            console.log("Test trips inserted.");
        }

        const [reviews] = await db.query("SELECT COUNT(*) AS total FROM reviews");
        if (reviews[0].total === 0) {
            await db.query(insertReviews);
            console.log("Test reviews inserted.");
        }

        app.listen(PORT, hostname, () => {
            console.log(`Server is running on http://${hostname}:${PORT}`);
        });

    }
    catch (error) {
        console.error("Error starting server:", error);
    }
}
startServer();