"use strict";

/** Routes for menus. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const {
  ensureAdmin,
  ensureCorrectUserOrAdmin,
  ensureLoggedIn,
} = require("../middleware/auth");
const Calendar = require("../models/calendar");

const calendarNewSchema = require("../schemas/calendarNew.json");

const router = new express.Router();

/** POST / CALENDAR => CALENDAR
 * 
 * 
 */

router.post("/", ensureLoggedIn, async function (req,res, next) {
    try {
        const validator = jsonschema.validate(req.body, calendarNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }
        const calendar = await Calendar.create(req.body);
        return res.status(201).json({calendar});

    } catch (err) {
        return next(err);
    }
});

module.exports = router;
