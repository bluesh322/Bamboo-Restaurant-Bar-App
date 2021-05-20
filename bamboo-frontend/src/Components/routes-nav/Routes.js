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
import CloseTabForm from "../Table/CloseTabForm";

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
      <PrivateRoute exact path="/menus">
        <MenuManager></MenuManager>
      </PrivateRoute>
      <PrivateRoute exact path="/table">
        <Table></Table>
      </PrivateRoute>
      <PrivateRoute exact path="/table/menu/:cust_id">
        <CustomerMenu></CustomerMenu>
      </PrivateRoute>
      <PrivateRoute exact path="/table/checkout/:cust_id">
        <CloseTabForm></CloseTabForm>
      </PrivateRoute>
      <PrivateRoute exact path="/menus/new_menu">
        <CreateMenuForm></CreateMenuForm>
      </PrivateRoute>
      <PrivateRoute exact path="/menus/:id">
        <EditMenuForm></EditMenuForm>
      </PrivateRoute>
      {/* <Route exact path="/query">
          <Query></Query>
      </Route> */}
      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
