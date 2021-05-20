import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Container,
} from "@material-ui/core";
import { Home } from "@material-ui/icons";
import UserContext from "../auth/UserContext";
import TableContext from "../Table/TableContext";
import "./Navbar.css";

const useStyles = makeStyles({
  navDisplayFlex: {
    display: "flex",
    justifyContent: "space-between",
  },
  linkText: {
    textDecoration: "none",
    color: "white",
  },
});

const NavBar = ({ logout }) => {
  const { currentUser } = useContext(UserContext);
  const { table, toggleTable } = useContext(TableContext);
  const loggedInNav = () => {
    return (
      <Container maxWidth="md" className={classes.navDisplayFlex}>
        <Link to="/menus">
          <IconButton edge="start" color="inherit" aria-label="home">
            <Home fontSize="large"></Home>
          </IconButton>
        </Link>
        <List
          className={classes.navDisplayFlex}
          component="nav"
          aria-labelledby="main navigation"
        >
          <Link
            className={classes.linkText}
            to="/table"
            key="table"
            onClick={toggleTable}
          >
            <ListItem button>
              <ListItemText primary="Enable Table"></ListItemText>
            </ListItem>
          </Link>
          <Link
            className={classes.linkText}
            onClick={logout}
            to="/logout"
            key="Log Out"
          >
            <ListItem button>
              <ListItemText primary="Log Out"></ListItemText>
            </ListItem>
          </Link>
        </List>
      </Container>
    );
  };

  const loggedOutNav = () => {
    return (
      <Container maxWidth="md" className={classes.navDisplayFlex}>
        <Link to="/">
          <IconButton edge="start" color="inherit" aria-label="home">
            <Home fontSize="large"></Home>
          </IconButton>
        </Link>

        <List
          className={classes.navDisplayFlex}
          component="nav"
          aria-labelledby="main navigation"
        >
          <Link className={classes.linkText} to="/register" key="Sign Up">
            <ListItem button>
              <ListItemText primary="Register"></ListItemText>
            </ListItem>
          </Link>
          <Link className={classes.linkText} to="/login" key="Login">
            <ListItem button>
              <ListItemText primary="Login"></ListItemText>
            </ListItem>
          </Link>
        </List>
      </Container>
    );
  };

  const tableNav = () => {
    return (
      <Container maxWidth="md" className={classes.navDisplayFlex}>
        <Link to="/menus">
          <IconButton
            onClick={toggleTable}
            edge="start"
            color="inherit"
            aria-label="home"
          >
            <ListItemText primary="Exit Table"></ListItemText>
          </IconButton>
        </Link>

        <List
          className={classes.navDisplayFlex}
          component="nav"
          aria-labelledby="main navigation"
        ></List>
      </Container>
    );
  };

  const showNav = () => {
    if (currentUser && table) {
      return loggedInNav();
    } else if (currentUser && !table) {
      return tableNav();
    } else {
      return loggedOutNav();
    }
  };

  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>{showNav()}</Toolbar>
    </AppBar>
  );
};

export default NavBar;
