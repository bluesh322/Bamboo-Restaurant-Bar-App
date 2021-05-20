import React, { useState, useEffect } from "react";
import BambooApi from "../../api";
import {cockTailApi, USRestAPI } from "../../queryApis";

const Query = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const query = async () => {
            try{
                // getting drinks from cocktail api

                let drink = await cockTailApi.getdrinks();
                const {drinks} = drink;
                console.log(drinks);
                let drinkData = {
                    name: drinks[0].strDrink,
                    price: 10.00,
                    ingredients: `${drinks[0].strIngredient1}, ${drinks[0].strIngredient2 || ''}, ${drinks[0].strIngredient3 || ''}, ${drinks[0].strIngredient4 || ''}, ${drinks[0].strIngredient5 || ''}, ${drinks[0].strIngredient6 || ''}`,
                    description: drinks[0].strInstructions,
                    type: "cocktail"
                }
                let res = await BambooApi.createItem(drinkData)

                // getting food from US RESTAURANT MENU API

                let food = await USRestAPI.getItalianMenu();
                let item;
                const {data} = food;
                console.log(data);
                for(let arr of data) {
                    console.log(arr);
                    item = {
                        name: arr.menu_item_name,
                        price: arr.menu_item_price,
                        ingredients: arr.menu_item_description,
                        description: arr.menu_item_description,
                        type: "food"
                    }
                    let res = await BambooApi.createItem(item);
                }

                // getting food from LSA

                // let lsafood = await USRestAPI.getLSAMenu();
                // let lsaitem;
                // const {data} = lsafood;
                // console.log(data);
                // for(let arr of data) {
                //     console.log(arr);
                //     lsaitem = {
                //         name: arr.menu_item_name,
                //         price: arr.menu_item_price,
                //         ingredients: arr.menu_item_description,
                //         description: arr.menu_item_description,
                //         type: "food"
                //     }
                //     let res = await BambooApi.createItem(lsaitem);
                // }


            } catch (errors) {
                console.error("Query failed", errors);

            }
        }
        if(loading) {
        query();
        setLoading(e => !e);
        }
    }, [loading])

    return (
        <div>
            <h1>Hello</h1>
        </div>
    )
}

export default Query;