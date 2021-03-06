import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Typography,
  Container,
  makeStyles,
  Grid,
  Box,
} from "@material-ui/core";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { WrapperTextField } from "../form-ui/WrapperTextField";
import WrapperButton from "../form-ui/WrapperButton";
import WrapperCheckbox from "../form-ui/WrapperCheckbox";
import BambooApi from "../../api";
import UserContext from "../auth/UserContext";
import WrapperDatePicker from "../form-ui/WrapperDatePicker";

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
}));

const CreateMenuForm = () => {
  const { currentUser } = useContext(UserContext);
  const user_id = currentUser.id;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const INITIAL_STATE = {
    title: "",
    cart: [],
    startDate: "",
    endDate: "",
  };
  const history = useHistory();

  useEffect(() => {
    const getItemsForCreate = async () => {
      let menuItems = await BambooApi.getItems();
      setItems((i) => [...i, ...menuItems]);
    };

    if (loading) {
      getItemsForCreate();
      setLoading((e) => !e);
    }
  }, [loading]);

  const item = Yup.object({
    id: Yup.number().nullable(),
    name: Yup.string().nullable(),
  });

  const validate = Yup.object({
    title: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Menu Title Required"),
    cart: Yup.array().of(item).min(5, "Your menu must have 5 items"),
    startDate: Yup.date().required(),
    endDate: Yup.date().required(),
  });

  return (
    <Container justifycontent="center" maxWidth="md" fixed>
      <Typography variant="h3">Add items to your menu</Typography>
      <div className={classes.formWrapper}>
        <Formik
          initialValues={{
            ...INITIAL_STATE,
          }}
          validationSchema={validate}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            const { title, cart, startDate, endDate } = values;
            setCart((c) => [...c, ...cart]);
            const menuData = { restaurant_id: user_id, title: title };
            const calendarData = { startDate: startDate, endDate: endDate };
            await BambooApi.createMenu(menuData, cart, calendarData);
            history.push(`/menus`);
            setSubmitting(false);
          }}
        >
          {(formik) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <WrapperTextField
                    variant="outlined"
                    label="title"
                    name="title"
                  ></WrapperTextField>
                </Grid>
              </Grid>
              <Box mt={2} mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <WrapperDatePicker
                      variant="outlined"
                      label="start date"
                      name="startDate"
                    ></WrapperDatePicker>
                  </Grid>
                  <Grid item xs={6}>
                    <WrapperDatePicker
                      variant="outlined"
                      label="end date"
                      name="endDate"
                    ></WrapperDatePicker>
                  </Grid>
                </Grid>
              </Box>
              <FieldArray
                name="cart"
                render={(arrayHelpers) => (
                  <>
                    <Grid container>
                      {items.map(({ id, name }) => {
                        return (
                          <Grid key={name} item xs={3}>
                            <WrapperCheckbox
                              key={id}
                              name={`${name}`}
                              legend={name}
                              label={name}
                              cart={cart}
                              arrayHelpers={arrayHelpers}
                              id={id}
                            ></WrapperCheckbox>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </>
                )}
              />

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <WrapperButton disabled={formik.isSubmitting}>
                    Create Menu
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

export default CreateMenuForm;
