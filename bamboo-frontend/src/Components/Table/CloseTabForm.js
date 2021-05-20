import React, { useContext, useEffect, useState } from "react";
import UserContext from "../auth/UserContext";
import {
  Container,
  Box,
  Button,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  makeStyles,
  TableBody,
} from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import BambooApi from "../../api";
import TableContext from "./TableContext";
import useLocalStorage from "../../hooks/useLocalStorage";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "25ch",
  },
}));

const CloseTab = () => {
  const [apitoken, setToken] = useLocalStorage("bamboo-token");
  const classes = useStyles();
  const {
    customersStorage,
    handleCustomerStorage,
    cartsStorage,
    handleCartsStorage,
  } = useContext(TableContext);
  const { cust_id } = useParams();

  console.log(cartsStorage);
  console.log(cust_id);
  console.log(apitoken);

  const cartTotal = () => {
    let total = 0.0;
    for (let c of cartsStorage[cust_id]) {
      total += +c.price * c.amount;
    }
    return total.toFixed(2);
  };

  const product = {
    name: "Cart Total",
    price: cartTotal(),
  };

  const makePayment = (token) => {
    const body = {
      token,
      product,
    };
    BambooApi.token = apitoken;
    try {
      let res = BambooApi.payment(body);
      return { success: true };
    } catch (errors) {
      console.log("payment failed", errors);
      return { success: false, errors };
    }
    console.log("res", res);
    const { status } = res;
    console.log("status", status);
  };

  return cartsStorage && cartsStorage[cust_id] ? (
    <Container maxWidth="md" fixed>
      <Box mt={2}>
        <TableContainer component={Paper} className="cart">
          <Table className={classes.table} aria-label="cart">
            <TableHead>
              <TableRow>
                <TableCell align="left">Item Name</TableCell>
                <TableCell align="right">Item Price</TableCell>
                <TableCell align="right">Item Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartsStorage[cust_id].map(({ id, name, price, amount }) => (
                <TableRow key={id}>
                  <TableCell align="left">{name}</TableCell>
                  <TableCell align="right">
                    ${Number(price).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container justify="flex-end">
          <Typography variant="h6">${cartTotal()}</Typography>
        </Grid>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <Box mt={2}>
            <StripeCheckout
              stripeKey={process.env.REACT_APP_KEY}
              token={makePayment}
              name="Place Order"
              amount={cartTotal() * 100}
              shippingAddress
              billingAddress
            >
              <Button variant="contained">Place Order</Button>
            </StripeCheckout>
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Box mt={2}>
            <Link to={`/table/menu/${cust_id}`}>
              <Button variant="contained" color="secondary">
                Back
              </Button>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Container>
  ) : (
    <Container maxWidth="md" fixed>
      <Box mt={4}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h5">No items in the cart yet!</Typography>
          </Grid>
          <Grid item xs={1}>
            <Link to={`/table/menu/${cust_id}`}>
              <Button size="small" variant="contained" color="secondary">
                Back
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CloseTab;
