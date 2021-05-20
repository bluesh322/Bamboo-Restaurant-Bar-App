"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Calendar {
    static async create({menu_id, startDate, endDate}) {
        const result = await db.query(
            `INSERT INTO calendars
                (menu_id, s_date, e_date)
                VALUES($1, $2, $3)
                RETURNING menu_id, s_date, e_date`,
                [menu_id, startDate, endDate]
        );
        const calendar = result.rows[0];

        return calendar;
    }
}

module.exports = Calendar;
