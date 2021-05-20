import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
} from "@material-ui/core";
import TableContext from "./TableContext";
import UserContext from "../auth/UserContext";
import { Link, useParams } from "react-router-dom";
import BambooApi from "../../api";
import CartIcons from "./CartIcons";

const CustomerMenu = () => {
  const { currentUser } = useContext(UserContext);
  const {
    customersStorage,
    handleCustomerStorage,
    cartsStorage,
    handleCartsStorage,
  } = useContext(TableContext);
  const { cust_id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [emptyStorage, setEmptyStorage] = useState(false);

  useEffect(() => {
    const getCustomer = async () => {
      for (let c of customersStorage) {
        if (cust_id === c.id) setCustomer(c);
      }
    };

    getCustomer();
  }, [cust_id, customersStorage]);

  useEffect(() => {
    const getCurrentMenuItems = async () => {
      const menus = await BambooApi.getMenus(currentUser.id);
      const menuItems = await BambooApi.getItemsFromMenuId(menus[0].id);
      setMenuItems((i) => [...menuItems]);
    };
    getCurrentMenuItems();
  }, [currentUser]);

  useEffect(() => {
    const setCurrentCart = async () => {
      if (cart.length === 0 && !emptyStorage) {
        if (cartsStorage && cartsStorage[cust_id]) {
          setCart((prev) => {
            let storageItem = cartsStorage[cust_id];
            const item = storageItem;

            return [...item];
          });
        }
      } else {
        let storageWithId;
        if (cartsStorage) {
          storageWithId = cartsStorage;
          storageWithId[cust_id] = [...cart];
        } else {
          storageWithId = {};
          storageWithId[cust_id] = [...cart];
        }
        handleCartsStorage(storageWithId);
      }
      setLoaded((e) => !e);
    };
    if (!loaded) {
      setCurrentCart();
    }
  }, [cartsStorage, loaded, cart, emptyStorage]);

  const addItem = (id, price, name) => {
    const item = [{ id, price, amount: 1, name }];
    setCart((prev) => {
      const isItemInCart = prev.find((item) => item.id === id);

      if (isItemInCart) {
        return prev.map((item) =>
          item.id === id ? { ...item, amount: item.amount + 1 } : item
        );
      }
      return [...prev, ...item];
    });
    setLoaded((e) => !e);
  };

  const removeItem = (id) => {
    setCart((prev) =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [])
    );
    setEmptyStorage((e) => !e);
    setLoaded((e) => !e);
  };

  const calculateTotalQuantity = () => {
    let totalQuantity = 0;
    for (let c of cart) {
      totalQuantity += c.amount;
    }

    return totalQuantity;
  };

  const getItemQuantity = (id) => {
    const q = cart.filter((c) => c.id === id);
    return q.amount;
  };

  const cartTotal = () => {
    let total = 0.0;
    for (let c of cart) {
      total += +c.price * c.amount;
    }
    return total.toFixed(2);
  };

  return (
    <Container maxWidth="md" fixed>
      <Box mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <Link to={`/table`}>
              <Button size="small" variant="contained" color="secondary">
                Back
              </Button>
            </Link>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h4">Add Items to Your Cart</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="h5">
              Items: {calculateTotalQuantity()}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="h5">Total: ${cartTotal()}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Link to={`/table/checkout/${cust_id}`}>
              <Button variant="contained" color="primary">
                Place Order
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Box>
      {menuItems.map(({ id, name, price, type, description }) => {
        return (
          <Card key={id}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="h6">{name}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">{description}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="h6">{`$${price}`}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="h6">{getItemQuantity(id)}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <CartIcons
                    id={id}
                    price={price}
                    name={name}
                    addItem={addItem}
                    removeItem={removeItem}
                  ></CartIcons>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
};

export default CustomerMenu;
