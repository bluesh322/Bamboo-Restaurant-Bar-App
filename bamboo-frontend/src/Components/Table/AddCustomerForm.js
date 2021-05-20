import React from "react";
import {
  Container,
  Grid,
  makeStyles,
} from "@material-ui/core";
import { WrapperTextField } from "../form-ui/WrapperTextField";
import WrapperButton from "../form-ui/WrapperButton";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
}));

const AddCustomerForm = ({ addCustomer }) => {
  const classes = useStyles();
  const INITIAL_STATE = {
    customer_name: "",
  };

  const validate = Yup.object({
    customer_name: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Customer name Required"),
  });
  return (
    <Container justifycontent="center" maxWidth="md">
      <div className={classes.formWrapper}>
        <Formik
          initialValues={{
            ...INITIAL_STATE,
          }}
          validationSchema={validate}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const { customer_name } = values;
            addCustomer({ id: uuidv4(), customer_name });
            setSubmitting(false);
            resetForm();
          }}
        >
          {(formik) => (
            <Form>
              <Grid container>
                <Grid item xs={9}>
                  <WrapperTextField
                    variant="outlined"
                    label="customer name"
                    name="customer_name"
                  ></WrapperTextField>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={9}>
                  <WrapperButton>Add Customer</WrapperButton>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default AddCustomerForm;
