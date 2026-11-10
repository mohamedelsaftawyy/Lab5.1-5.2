const express = require("express");
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUsersWithManagers
} = require('../controller/UserController.js');

const userRouter = express.Router();

userRouter.get("/managers", getUsersWithManagers);

userRouter.get("/", getAllUsers);

userRouter.get("/:id", getUserById);

userRouter.post("/", createUser);

userRouter.put("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

module.exports = userRouter;