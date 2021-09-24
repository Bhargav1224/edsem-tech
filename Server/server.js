const express = require("express");
const app = express();
const userRouter = require("./src/controllers/user.controller");

app.use("/users", userRouter);

module.exports = app;