const express = require("express");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const tripRouter = require("./routes/tripRoute");
const reviewRouter = require("./routes/reviewRoute");
const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/trips", tripRouter);
app.use("/reviews", reviewRouter);

module.exports = app;