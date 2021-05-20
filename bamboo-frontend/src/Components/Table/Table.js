import React, { useContext, useState, useEffect } from "react";
import UserContext from "../auth/UserContext";
import TableContext from "./TableContext";
import { Container, Box, Button, Card, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import AddCustomerForm from "./AddCustomerForm";

const Table = () => {
  const { currentUser } = useContext(UserContext);
  const { table, customersStorage, handleCustomerStorage } =
    useContext(TableContext);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const getCustomers = async () => {
      if (customers.length === 0) {
        if (customersStorage !== null) {
          setCustomers((c) => [...customersStorage]);
        }
      } else {
        handleCustomerStorage(customers);
      }
    };
    getCustomers();
  }, [customers]);

  const addCustomer = (customer_name) => {
    setCustomers((c) => [...c, customer_name]);
  };

  return (
    <Container maxWidth="md">
      <h2 data-testid="resolved">Add Name and Click Name to View Menu</h2>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          {customers.map(({ id, customer_name }) => {
            return (
              <Grid key={id} item xs={5}>
                <Box key={id} mt={2}>
                  <Link key={id} to={`/table/menu/${id}`}>
                    <Button key={id} variant="contained" color="primary">
                      {customer_name}
                    </Button>
                  </Link>
                </Box>
              </Grid>
            );
          })}
        </Grid>
        <Grid item xs={4}>
          <AddCustomerForm addCustomer={addCustomer}></AddCustomerForm>
        </Grid>
        <Grid item xs={8}></Grid>
      </Grid>
    </Container>
  );
};

export default Table;
