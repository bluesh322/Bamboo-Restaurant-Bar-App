"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const stripe = require("stripe")(process.env.STRIPE_KEY)

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");

const router = express.Router();
const { v4 } = require("uuid");


router.get("/", ensureLoggedIn, async function (req, res, next) {
    try {

    } catch {
        return next(err);
    }
})

router.post("/payment", ensureLoggedIn, async function (req, res,next) {
    try{
    const {product, token} = req.body;
    const idempotencyKey = v4();

    console.log(token);

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: product.name,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country,
                    line1: token.card.address_line1
                },

            }
        }, {idempotencyKey})
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err));
    
    } catch (err){
        next(err);
    }
})

module.exports = router;
