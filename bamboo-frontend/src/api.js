import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class BambooApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${BambooApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async register(registerData) {
    let res = await this.request(`auth/register`, registerData, "post");
    return res.token;
  }

  static async login(loginData) {
    let res = await this.request(`auth/token`, loginData, "post");
    return res.token;
  }

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  static async getMenus(id) {
      let res = await this.request(`menus?restaurant_id=${id}`);
      return res.menus;
  }

  static async createMenu(menuData, itemData) {
    const {restaurant_id, title} = menuData;
    console.log(menuData);
    let res = await this.request(`menus/`, {restaurant_id, title}, "post");
    console.log(res.menu);
    const menu_id = res.menu.id;

    for(let item of itemData) {
      let item_id = item.id
      res = await this.request(`menus/menu_item`, {menu_id, item_id}, "post");
    }
    return res.menu;
  }

  static async createItem(itemData) {
    let res = await this.request(`items/`, itemData, "post")
    return res.item;
  }

  static async getItems() {
    let res = await this.request(`items/`);
    return res.items;
  }

  static async getItemsFromMenuId(menu_id) {
    let res = await this.request(`menus/menu_item/${menu_id}`);
    return res.items;
  }

  static async deleteMenu(menu_id) {
    let res = await this.request(`menus/${menu_id}`, {}, "delete")
  }

  static async deleteMenuItems(menu_id) {
    let res = await this.request(`menus/menu_item/${menu_id}`, {}, "delete")
    return res.msg;
  }



}

export default BambooApi;
