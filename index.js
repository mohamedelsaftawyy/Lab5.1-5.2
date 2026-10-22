const express = require("express");
const tripRouter = require('./routes/tripRoute');
const app = express();

app.use(express.json());

app.use("/trips", tripRouter);

module.exports = app;