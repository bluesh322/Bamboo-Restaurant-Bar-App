import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import UserContext from "../auth/UserContext";
import { Container, Box, Button } from "@material-ui/core";

const Homepage = () => {
  const history = useHistory();
  const { currentUser } = useContext(UserContext);
  //if(currentUser) history.push(`/menus`)
  return (
    <Container maxWidth="md">
      <h2 data-testid="resolved">Bamboo</h2>
      <p>Restaurant/Bar Manager App</p>
      {currentUser ? (
        <h2 data-testid="loggedInResolved" >Welcome Back {currentUser.username}</h2>
      ) : (
          <Box>
          <Link to="/register" key="Sign Up">
          <Button variant="contained" color="primary">Register Restaurant</Button>
          </Link>
          <Link to="/login" key="Login">
            <Button variant="contained" color="secondary">Login</Button>
          </Link>              
          </Box>
      )}
    </Container>
  );
};

export default Homepage;
