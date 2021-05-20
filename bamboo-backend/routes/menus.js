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
const Menu = require("../models/menu");

const menuNewSchema = require("../schemas/menuNew.json");
const menuSearchSchema = require("../schemas/menuSearch.json");

const router = new express.Router();

/** POST / { menu } => { menu }
 *  add a menu
 *
 * Authorization required: user
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, menuNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const menu = await Menu.create(req.body);
    return res.status(201).json({ menu });
  } catch (err) {
    return next(err);
  }
});

/** GET /
 *
 * Authorization required: user
 *
 */

router.get("/", async function (req, res, next) {
  const q = req.query;
  // arrive as strings from querystring, but we want as ints
  if (q.restaurant_id !== undefined) q.restaurant_id = +q.restaurant_id;
  try {
    const validator = jsonschema.validate(q, menuSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const menus = await Menu.findAll(q);
    return res.json({ menus });
  } catch (err) {
    return next(err);
  }
});

/** GET /:restaurant_id => { menu }
 *
 *  Authorization required: user
 */

router.get("/:restaurant_id", ensureLoggedIn, async function (req, res, next) {
  try {
    const menu = await Menu.get(req.params.restaurant_id);
    return res.json({ menu });
  } catch (err) {
    return next(err);
  }
});

/** Add an item to a menu via junction table menu_item
 *
 */

router.post("/menu_item", ensureLoggedIn, async function (req, res, next) {
  try {
    const menu_item = await Menu.addMenuItem(
      req.body.menu_id,
      req.body.item_id
    );
    return res.json({ menu_item });
  } catch (err) {
    return next(err);
  }
});

/** Get items based on menu_id from menu_item table
 *
 */

router.get(`/menu_item/:id`, ensureLoggedIn, async function (req, res, next) {
  try {
    const items = await Menu.getMenuItems(req.params.id);
    return res.json({ items });
  } catch (err) {
    return next(err);
  }
});

/** DELETE all items with a menu
 * 
 */

router.delete(`/menu_item/:id`, ensureLoggedIn, async function (req, res, next) {
    try {
        await Menu.deleteMenuItems(req.params.id);
        return res.json({ msg :"deleted"})
    } catch (err) {
        return next(err);
    }
})

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: user
 */

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    await Menu.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
