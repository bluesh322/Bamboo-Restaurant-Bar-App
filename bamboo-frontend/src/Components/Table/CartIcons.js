import React from "react";
import { IconButton } from "@material-ui/core"
import { Add, Remove} from "@material-ui/icons"

const CartIcons = ({ id, price, name, addItem, removeItem}) =>{
    const add = () => {
        addItem(id, price, name);
    }

    const remove = () => {
        removeItem(id);
    }
    return (
        <div className="justify-content-between">
            <IconButton onClick={add}><Add></Add></IconButton>
            <IconButton onClick={remove}><Remove></Remove></IconButton>
        </div>
    )
}

export default CartIcons;