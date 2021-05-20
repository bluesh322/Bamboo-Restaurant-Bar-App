import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Typography, Container, makeStyles, Grid } from "@material-ui/core";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { WrapperTextField } from "../form-ui/WrapperTextField";
import WrapperButton from "../form-ui/WrapperButton";
import WrapperCheckbox from "../form-ui/WrapperCheckbox";
import BambooApi from "../../api";
import UserContext from "../auth/UserContext";

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
}));

const EditMenuForm = () => {
  const { currentUser } = useContext(UserContext);
  const user_id = currentUser.id;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [title, setTitle] = useState("");
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const getItemsForEdit = async () => {
      let cartItems = await BambooApi.getItemsFromMenuId(id);
      console.log(cartItems);
      setTitle((c) => `${cartItems[0].title}`)
      setCart((c) => [...cartItems]);
      let menuItems = await BambooApi.getItems();
      setItems((i) => [...menuItems]);
    };

    if (loading) {
      getItemsForEdit();
      setLoading((e) => !e);
    }
  }, [id]);

  console.log(cart);

  const item = Yup.object({
    id: Yup.number().nullable(),
    name: Yup.string().nullable(),
  });

  const validate = Yup.object({
    title: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Menu Title Required"),
    cart: Yup.array().of(item).min(5, "Your menu must have 5 items"),
  });

  return (
    <Container justifycontent="center" maxWidth="md" fixed>
      <Typography variant="h3">Edit items in your menu</Typography>
      <div className={classes.formWrapper}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            title: title || "",
            cart: cart
          }}
          validationSchema={validate}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            const { title, cart } = values;
            setCart((c) => [...c, ...cart]);
            const menuData = { restaurant_id: user_id, title: title };
            await BambooApi.deleteMenuItems(id);
            await BambooApi.deleteMenu(id);
            await BambooApi.createMenu(menuData, cart);
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
                    Edit Menu
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

export default EditMenuForm;
