const { db } = require("../db.js");
const { isMissing, trimText, isValidEmail, isStrongPassword } = require("../utils/validation.js");

const register = async (req, res) => {
    let { username, email, password } = req.body || {};

    if (isMissing(username) || isMissing(email) || isMissing(password)) {
        return res.status(400).json({
            status: "fail",
            message: "Username, email and password are required."
        });
    }

    username = trimText(username);
    email = trimText(email);

    if (!isValidEmail(email)) {
        return res.status(400).json({
            status: "fail",
            message: "Invalid email format."
        });
    }

    if (!isStrongPassword(password)) {
        return res.status(400).json({
            status: "fail",
            message: "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a symbol."
        });
    }

    email = email.toLowerCase();

    try {
        const [result] = await db.query(
            "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
            [username, email, password, "user"]
        );

        res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: { id: result.insertId, username, email, role: "user" }
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                status: "fail",
                message: "Email already exists."
            });
        }
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

const login = async (req, res) => {
    let { email, password } = req.body || {};

    if (isMissing(email) || isMissing(password)) {
        return res.status(400).json({
            status: "fail",
            message: "Email and password are required."
        });
    }

    email = trimText(email);

    if (!isValidEmail(email)) {
        return res.status(400).json({
            status: "fail",
            message: "Invalid email format."
        });
    }

    email = email.toLowerCase();

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0 || rows[0].password !== password) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password."
            });
        }

        const user = rows[0];

        res.status(200).json({
            status: "success",
            message: "Welcome back " + user.username,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                manager_id: user.manager_id
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

module.exports = { register, login };