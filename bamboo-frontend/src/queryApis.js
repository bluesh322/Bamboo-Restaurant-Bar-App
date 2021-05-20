import axios from "axios";

const COCKTAIL = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const LSA = "https://api.documenu.com/v2/restaurant/3321424597133156/menuitems?key=11e1657f83ef96fec61a49cf3abf7107";
const GIUSSEPPES = "https://api.documenu.com/v2/restaurant/3322165197132586/menuitems?key=11e1657f83ef96fec61a49cf3abf7107";

export class cockTailApi {
  static async request() {
    console.debug("API Call:", "cocktailURL");
    try {
      return (
        await axios.get(
          COCKTAIL
        )
      ).data;
    } catch (err) {
      console.error("API Error:", err);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getdrinks() {
    let res = await cockTailApi.request();
    return res;
  }
}

export class USRestAPI {
  static async request(url) {
    console.debug("API Call:", "USRestAPI");
    try {
      return (
        await axios.get(
          url
        )
      ).data;
    } catch (err) {
      console.error("API Error:", err);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getLSAMenu() {
    let res = await USRestAPI.request(LSA);
    return res;
  }

  static async getItalianMenu() {
    let res = await USRestAPI.request(GIUSSEPPES);
    return res;
  }
}

