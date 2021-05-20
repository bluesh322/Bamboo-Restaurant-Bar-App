import React, { useContext } from "react"; 
import { Route, Redirect } from "react-router-dom";
import UserContext from "../auth/UserContext";

/** "HOC" for private routes --- I wish this kind of thing was explained for auth */

const PrivateRoute = ({exact, path, children}) => {
    const { currentUser } = useContext(UserContext);

    if (!currentUser) {
        return <Redirect to="/login"></Redirect>;
    }

    return (
        <Route exact={exact} path={path}>
            {children}
        </Route>
    )
}

export default PrivateRoute;