import React, { useContext, useState } from "react";
import UserContext from "../auth/UserContext";
import { Container, Box, Button, Card } from "@material-ui/core";
import { Link } from "react-router-dom";

const CloseTab = ({customer}) => {
    return(
    <Container maxWidth="md" fixed>
        <Typography>Process Payment with square here</Typography>
        <Button>Submit</Button>
    </Container>
    )
}

export default CloseTab;