import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Homepage from "../homepage/homepage";
import RegisterForm from "../auth/RegisterForm";
import LoginForm from "../auth/LoginForm";
import PrivateRoute from "./PrivateRoute";
import MenuManager from "../Manager/MenuManager";
import Table from "../Table/Table";
import CustomerMenu from "../Table/CustomerMenu";
import CreateMenuForm from "../Manager/CreateMenuForm";
import EditMenuForm from "../Manager/EditMenuForm"
import Query from "../query_api/Query";

const Routes = ({ login, register }) => {
  return (
    <Switch>
      <Route exact path="/">
        <Homepage></Homepage>
      </Route>
      <Route exact path="/register">
        <RegisterForm register={register}></RegisterForm>
      </Route>
      <Route exact path="/login">
        <LoginForm login={login}></LoginForm>
      </Route>
      <Route exact path="/menus">
        <MenuManager></MenuManager>
      </Route>
      <Route exact path="/table">
        <Table></Table>
      </Route>
      <Route exact path="/table/menu/:cust_id">
        <CustomerMenu></CustomerMenu>
      </Route>
      <Route exact path="/table/checkout/:cust_id">
          
      </Route>
      <Route exact path="/menus/new_menu">
        <CreateMenuForm></CreateMenuForm>
      </Route>
      <Route exact path="/menus/:id">
        <EditMenuForm></EditMenuForm>
      </Route>
      {/* <Route exact path="/query">
          <Query></Query>
      </Route> */}
      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
