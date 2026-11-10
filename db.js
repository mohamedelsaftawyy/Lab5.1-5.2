require("dotenv").config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const createUsersTable = "CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, role ENUM('admin', 'user') NOT NULL DEFAULT 'user', manager_id INT NULL, FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL)";

const createTripsTable = "CREATE TABLE IF NOT EXISTS trips(id INT AUTO_INCREMENT PRIMARY KEY, destination VARCHAR(255) NOT NULL, country VARCHAR(255) NOT NULL, cost DECIMAL(10, 2) NOT NULL, description TEXT)";

const createReviewsTable = "CREATE TABLE IF NOT EXISTS reviews(id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, trip_id INT NOT NULL, rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5), UNIQUE (user_id, trip_id), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (trip_id) REFERENCES trips(id))";

const addManagerColumn = "ALTER TABLE users ADD COLUMN manager_id INT NULL, ADD FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL";

const insertUsers = "INSERT IGNORE INTO users (id, username, email, password, role, manager_id) VALUES (1, 'ahmed_admin', 'ahmed@example.com', 'Admin#2026', 'admin', NULL), (2, 'sara', 'sara@example.com', 'Sara#2026x', 'user', 1), (3, 'omar', 'omar@example.com', 'Omar#2026x', 'user', 1), (4, 'laila', 'laila@example.com', 'Laila#2026', 'user', 2)";

const insertTrips = "INSERT IGNORE INTO trips (id, destination, country, cost) VALUES (1, 'Paris', 'France', 1000), (2, 'Tokyo', 'Japan', 2000), (3, 'New York', 'USA', 1500), (4, 'Cape Town', 'South Africa', 1800)";

const insertReviews = "INSERT IGNORE INTO reviews (id, user_id, trip_id, rating) VALUES (1, 1, 1, 5), (2, 2, 1, 4), (3, 3, 2, 3), (4, 4, 3, 5)";

module.exports = {
    db,
    createUsersTable,
    createTripsTable,
    createReviewsTable,
    addManagerColumn,
    insertUsers,
    insertTrips,
    insertReviews
};