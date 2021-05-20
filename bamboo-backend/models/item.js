"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for items */

class Item {
  /**
   * Create an Item
   */

  static async create({ name, price, ingredients, type, description }) {
    const duplicateCheck = await db.query(
      `SELECT name
            FROM items
            WHERE name = $1`,
      [name]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate item: ${name}`);

    const result = await db.query(
      `INSERT INTO items
           (name, price, ingredients, type, description)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING name, price, ingredients, type, description`,
      [name, price, ingredients, type, description]
    );
    const items = result.rows[0];

    return items;
  }

    /** Find all items (optional filter on searchFilters).
   *
   * 
   * */

     static async findAll({ maxPrice, type, name } = {}) {
        let query = `SELECT id,
                            name,
                            price,
                            ingredients,
                            type,
                            description
                     FROM items`;
        let whereExpressions = [];
        let queryValues = [];
    
        // For each possible search term, add to whereExpressions and
        // queryValues so we can generate the right SQL
    
        if (maxPrice !== undefined) {
          queryValues.push(maxPrice);
          whereExpressions.push(`price <= $${queryValues.length}`);
        }
    
        if (name !== undefined) {
          queryValues.push(`%${name}%`);
          whereExpressions.push(`name ILIKE $${queryValues.length}`);
        }

        if (type) {
            queryValues.push(`${type}`)
            whereExpressions.push(`type = $${queryValues.length}`);
        }
    
        if (whereExpressions.length > 0) {
          query += " WHERE " + whereExpressions.join(" AND ");
        }
    
        // Finalize query and return results
    
        query += " ORDER BY name";
        const itemsRes = await db.query(query, queryValues);
        return itemsRes.rows;
      }

  /** Delete given item from database; returns undefined.
   *
   * Throws NotFoundError if item id not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
               FROM items
               WHERE id = $1
               RETURNING id`,
      [id]
    );
    const item = result.rows[0];

    if (!item) throw new NotFoundError(`No item: ${id}`);
  }
}

module.exports = Item;
