"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Menu {
  /**
   * Create a menu from data and update db
   */

  static async create({ restaurant_id, title }) {
    const duplicateCheck = await db.query(
      `SELECT title
            FROM menus
            WHERE title = $1`,
      [title]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate menu: ${title}`);

    const result = await db.query(
      `INSERT INTO menus
           (restaurant_id, title)
           VALUES ($1, $2)
           RETURNING id, restaurant_id AS "restaurantId", title`,
      [restaurant_id, title]
    );
    const menu = result.rows[0];

    return menu;
  }

  /**
   * Find All Menus and order by title
   *
   */

  static async findAll(searchFilters = {}) {
    let query = `SELECT id, 
                        restaurant_id AS "restaurantId",
                        title
                FROM menus`;
    let whereExpressions = [];
    let queryValues = [];

    const { restaurant_id } = searchFilters;
    if (restaurant_id) {
      queryValues.push(`${restaurant_id}`);
      whereExpressions.push(`restaurant_id = $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    query += " ORDER BY title";
    const menusRes = await db.query(query, queryValues);
    return menusRes.rows;
  }

  /**
   * Get a menu by id
   */

  static async get(id) {
    const menusRes = await db.query(
      `SELECT id,
            restaurant_id AS "restaurantId",
            title
         FROM menus
         WHERE id = $1`,
      [id]
    );

    const menu = menusRes.rows[0];

    if (!menu) throw new NotFoundError(`No menu: ${id}`);

    return menu;
  }

  /**
   * Add a Menu Item to menu_item junction table
   *
   */

  static async addMenuItem(menu_id, item_id) {
    const result = await db.query(
      `INSERT INTO menu_item
        (menu_id, item_id)
        VALUES ($1, $2)
        RETURNING menu_id, item_id`,
      [menu_id, item_id]
    );
    const menu_item = result.rows[0];
    return menu_item;
  }

  static async deleteMenuItems(menu_id) {
    const result = await db.query(
      `DELETE FROM menu_item
      WHERE menu_id = $1
      RETURNING menu_id`,
      [menu_id]
    );
    const menu = result.rows[0];

    if (!menu) throw new NotFoundError(`No menu: ${menu_id}`);
  }

  /**
   * Get items from menu_id
   *  
   */

  static async getMenuItems(menu_id) {
    const result = await db.query(
      `SELECT DISTINCT m.id, m.title, i.id, i.name, i.price, i.type, i.ingredients, i.description
      FROM menus AS m
      INNER JOIN menu_item
      ON m.id = menu_item.menu_id
      INNER JOIN items AS i
      ON menu_item.item_id = i.id
      WHERE m.id = $1`,
      [menu_id]
    );
    const items = result.rows;
    return items;
  }

  /**
   * Delete given menu
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
               FROM menus
               WHERE id = $1
               RETURNING id`,
      [id]
    );
    const menu = result.rows[0];

    if (!menu) throw new NotFoundError(`No menu: ${id}`);
  }
}

module.exports = Menu;
