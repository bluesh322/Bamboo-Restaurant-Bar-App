import React from "react";
import { useHistory } from "react-router-dom";
import {
  Typography,
  Container,
  makeStyles,
  Grid,
} from "@material-ui/core";
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

const RegisterForm = ({ register }) => {
  const INITIAL_STATE = {
    username: "",
    password: "",
    confirmPassword: "",
    title: "",
  };
  const history = useHistory();
  const classes = useStyles();

  const validate = Yup.object({
    username: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Username Required"),
    title: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Restaurant Title Required"),
    password: Yup.string()
      .min(6, "Must be 6 characters or more")
      .required("Password is Required"),
    confirm: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password must match")
      .required("Repeat Password"),
  });

  return (
    <Container fullwidth="md">
      <Typography variant="h3">Add Restaurant Manager to Bamboo</Typography>

      <div className={classes.formWrapper}>
        <Formik
          initialValues={{
            ...INITIAL_STATE,
          }}
          validationSchema={validate}
          onSubmit={(values) => {
            const { username, password, title } = values;
            register({ username, password, title });
            history.push("/");
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
                    label="title"
                    name="title"
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
                <Grid item xs={6}>
                  <WrapperTextField
                    variant="outlined"
                    label="confirm"
                    name="confirm"
                  ></WrapperTextField>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <WrapperButton >
                    Submit
                  </WrapperButton>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default RegisterForm;
