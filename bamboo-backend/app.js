"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const menusRoutes = require("./routes/menus");
const itemsRoutes = require("./routes/items");
const stripeRoutes = require("./routes/stripe");
const calendarsRoutes = require("./routes/calendars");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

//Routes

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/menus", menusRoutes);
app.use("/items", itemsRoutes);
app.use("/stripe", stripeRoutes);
app.use("/calendars", calendarsRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
