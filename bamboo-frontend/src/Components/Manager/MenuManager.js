import React, { useContext, useState, useEffect } from "react";
import UserContext from "../auth/UserContext";
import { Container, Box, Button, Grid, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@material-ui/core";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import BambooApi from "../../api";

const MenuManager = () => {
  const { currentUser } = useContext(UserContext);
  const [date, setDate] = useState(new Date());
  const [menus, setMenus] = useState([]);
  const { id, title } = currentUser;
  const [selectedMenu, setSelectedMenu] = useState()

  useEffect(() => {
    search(id);
  }, [id]);
  const search = async (id) => {
    let menus = await BambooApi.getMenus(id);
    setMenus((m) => [...menus]);
  };

  const datePicker = (value) => {
    console.log(value);
    setDate()
  }


  return (
    <Container maxWidth="md">
      <h2 data-testid="resolved">Menu Manager for {title}</h2>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Calendar onChange={datePicker} selectRange={true} value={date}></Calendar>
        </Grid>
        <Grid item xs={3}>
          <Link to="/menus/new_menu" key="New Menu">
            <Button variant="contained" color="primary">
              Add a Menu
            </Button>
          </Link>
          <Box mt={2}>
            <Typography variant="h4">Edit Menus</Typography>
          </Box>
          {menus.map(({ id, title }) => {
            return (
              <Box key={title} mt={2}>
                <Link to={`/menus/${id}`}>
                  <Button variant="contained" color="secondary">
                    {title}
                  </Button>
                </Link>
              </Box>
            );
          })}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MenuManager;
