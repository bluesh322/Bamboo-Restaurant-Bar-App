import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Container, makeStyles, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { WrapperTextField } from "../form-ui/WrapperTextField";
import WrapperButton from "../form-ui/WrapperButton";

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
}));

const LoginForm = ({ login }) => {
  const [error, setError] = useState(false);
  const classes = useStyles();
  const INITIAL_STATE = {
    username: "",
    password: "",
  };
  const history = useHistory();

  const validate = Yup.object({
    username: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Username Required"),
    password: Yup.string()
      .min(6, "Must be 6 characters or more")
      .required("Password is Required"),
  });

  const errorMsg = () => {
    return <Alert severity="error">Username/Password Incorrect</Alert>;
  };

  return (
    <Container justifycontent="center" maxWidth="md" fixed>
      <Typography variant="h3">Login to Bamboo</Typography>
      {error ? errorMsg() : <div></div>}
      <div className={classes.formWrapper}>
        <Formik
          initialValues={{
            ...INITIAL_STATE,
          }}
          validationSchema={validate}
          onSubmit={async (values) => {
            setError(false);
            const { username, password } = values;
            const { id, success } = await login({ username, password });
            if (success) history.push(`/menus`);
            else setError((e) => !e);
          }}
        >
          {(formik) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <WrapperTextField
                    variant="outlined"
                    label="username"
                    name="username"
                  ></WrapperTextField>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <WrapperTextField
                    variant="outlined"
                    label="password"
                    name="password"
                  ></WrapperTextField>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <WrapperButton>Submit</WrapperButton>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default LoginForm;
