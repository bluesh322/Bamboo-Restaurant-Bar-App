import React, { useState, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import jwt from "jsonwebtoken";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./Components/auth/UserContext";
import TableContext from "./Components/Table/TableContext";
import NavBar from "./Components/routes-nav/Navbar";
import Routes from "./Components/routes-nav/Routes";
import { Grid } from "@material-ui/core";
import BambooApi from "./api";

export const TOKEN_STORAGE_ID = "bamboo-token";
export const TABLE_STORAGE_ID = "bamboo-table";
export const CUSTOMERS_STORAGE_ID = "bamboo-customers";
export const CARTS_STORAGE_ID = "bamboo-carts";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [table, setTable] = useState(false);
  const [tableStorage, setTableStorage] = useLocalStorage(TABLE_STORAGE_ID);
  const [customersStorage, setCustomersStorage] = useLocalStorage(CUSTOMERS_STORAGE_ID);
  const [cartsStorage, setCartsStorage] = useLocalStorage(CARTS_STORAGE_ID)



  useEffect(() => {
    const getCurrentUser = async () => {
      if (!token) {
        setCurrentUser(null);
      } else {
        try {
          let { username } = jwt.decode(token);
          BambooApi.token = token;
          let currentUser = await BambooApi.getCurrentUser(username);
          setCurrentUser(currentUser);
        } catch (errors) {
          console.error("App loadUserInfo: problem loading", errors);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    };
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  const register = async (registerData) => {
    try {
      let token = await BambooApi.register(registerData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.log("signup failed", errors);
      return { success: false, errors };
    }
  };

  const login = async (loginData) => {
    try {
      let token = await BambooApi.login(loginData);
      setToken(token);
      let { id } = jwt.decode(token);
      return {'id': id, success: true };
    } catch (errors) {
      console.log("login failed", errors);
      return { success: false, errors };
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    setToken(null);
    setTableStorage(null);
  };

  const toggleTable = () => {
    setTableStorage(table);
    setTable((t) => !t);
  }

  const handleCustomerStorage = (customers) => {
    setCustomersStorage(customers);
  }

  const handleCartsStorage = (carts) => {
    setCartsStorage(carts);
  }

  if (!infoLoaded) return <span data-testid="loading">Loading ...</span>;

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currentUser, setCurrentUser}}>
        <TableContext.Provider value={{ table, toggleTable, customersStorage, handleCustomerStorage, cartsStorage, handleCartsStorage }}>
        <div className="App">
          <NavBar logout={logout} />
          <Grid item xs={12}>
            <Routes login={login} register={register} />
          </Grid>
        </div>
        </TableContext.Provider>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

export default App;
