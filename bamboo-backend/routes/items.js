"use strict";

/** Routes for items. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Item = require("../models/item");

const itemNewSchema = require("../schemas/itemNew.json");
const itemSearchSchema = require("../schemas/itemSearch.json");

const router = new express.Router();

/** POST / { item } =>  { item }
 *
 * Authorization required: none
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, itemNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const item = await Item.create(req.body);
    return res.status(201).json({ item });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { items: [ {item}, ...]}
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;
  // arrive as strings from querystring, but we want as ints
  
  try {
    const validator = jsonschema.validate(q, itemSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const items = await Item.findAll(q);
    return res.json({ items });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: handle }
 *
 * Authorization: admin
 */

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    await Item.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
