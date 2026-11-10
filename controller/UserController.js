const { db } = require("../db.js");
const { isMissing, trimText, isValidEmail, isStrongPassword, isValidId } = require("../utils/validation.js");

const getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, username, email, role, manager_id FROM users");

        res.status(200).json({
            status: "success",
            message: "Users retrieved successfully",
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

const getUserById = async (req, res) => {
    const id = Number(req.params.id);

    if (!isValidId(id)) {
        return res.status(400).json({
            status: "fail",
            message: "ID must be a positive integer."
        });
    }

    try {
        const [rows] = await db.query("SELECT id, username, email, role, manager_id FROM users WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "User retrieved successfully",
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

const createUser = async (req, res) => {
    let { username, email, password, role, manager_id } = req.body || {};

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

    if (role === undefined) {
        role = "user";
    }

    if (role !== "admin" && role !== "user") {
        return res.status(400).json({
            status: "fail",
            message: "Role must be admin or user."
        });
    }

    if (manager_id === undefined) {
        manager_id = null;
    }

    if (manager_id !== null && !isValidId(manager_id)) {
        return res.status(400).json({
            status: "fail",
            message: "manager_id must be a positive integer or null."
        });
    }

    email = email.toLowerCase();

    try {
        const [result] = await db.query(
            "INSERT INTO users (username, email, password, role, manager_id) VALUES (?, ?, ?, ?, ?)",
            [username, email, password, role, manager_id]
        );

        res.status(201).json({
            status: "success",
            message: "User created successfully",
            data: { id: result.insertId, username, email, role, manager_id }
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                status: "fail",
                message: "Email already exists."
            });
        }
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(409).json({
                status: "fail",
                message: "Manager does not exist."
            });
        }
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

const updateUser = async (req, res) => {
    const id = Number(req.params.id);
    let { username, email, password, role, manager_id } = req.body || {};

    if (!isValidId(id)) {
        return res.status(400).json({
            status: "fail",
            message: "ID must be a positive integer."
        });
    }

    if (username === undefined && email === undefined && password === undefined && role === undefined && manager_id === undefined) {
        return res.status(400).json({
            status: "fail",
            message: "Send at least one field to update."
        });
    }

    if (username !== undefined) {
        username = trimText(username);
        if (isMissing(username)) {
            return res.status(400).json({
                status: "fail",
                message: "Username cannot be empty."
            });
        }
    }

    if (email !== undefined) {
        email = trimText(email);
        if (!isValidEmail(email)) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid email format."
            });
        }
        email = email.toLowerCase();
    }

    if (password !== undefined && !isStrongPassword(password)) {
        return res.status(400).json({
            status: "fail",
            message: "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a symbol."
        });
    }

    if (role !== undefined && role !== "admin" && role !== "user") {
        return res.status(400).json({
            status: "fail",
            message: "Role must be admin or user."
        });
    }

    if (manager_id !== undefined && manager_id !== null) {
        if (!isValidId(manager_id)) {
            return res.status(400).json({
                status: "fail",
                message: "manager_id must be a positive integer or null."
            });
        }
        if (Number(manager_id) === id) {
            return res.status(400).json({
                status: "fail",
                message: "A user cannot be their own manager."
            });
        }
    }

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        const user = rows[0];

        if (username === undefined) username = user.username;
        if (email === undefined) email = user.email;
        if (password === undefined) password = user.password;
        if (role === undefined) role = user.role;
        if (manager_id === undefined) manager_id = user.manager_id;

        await db.query(
            "UPDATE users SET username = ?, email = ?, password = ?, role = ?, manager_id = ? WHERE id = ?",
            [username, email, password, role, manager_id, id]
        );

        res.status(200).json({
            status: "success",
            message: "User updated successfully",
            data: { id, username, email, role, manager_id }
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                status: "fail",
                message: "Email already exists."
            });
        }
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(409).json({
                status: "fail",
                message: "Manager does not exist."
            });
        }
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

const deleteUser = async (req, res) => {
    const id = Number(req.params.id);

    if (!isValidId(id)) {
        return res.status(400).json({
            status: "fail",
            message: "ID must be a positive integer."
        });
    }

    try {
        const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "User deleted successfully"
        });
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                status: "fail",
                message: "Cannot delete this user because they have reviews."
            });
        }
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database error"
        });
    }
};

const getUsersWithManagers = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT e.id, e.username AS EmployeeName, m.username AS ManagerName FROM users e LEFT JOIN users m ON e.manager_id = m.id"
        );

        res.status(200).json({
            status: "success",
            message: "Users and managers retrieved successfully",
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
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUsersWithManagers
};