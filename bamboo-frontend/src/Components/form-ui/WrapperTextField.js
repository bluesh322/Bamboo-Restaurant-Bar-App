import React from "react";
import { useField } from "formik";
import { Box, TextField } from "@material-ui/core";

export const WrapperTextField = ({ name, ...props }) => {
  const [field, meta] = useField(name);

  const configTextField = {
    fullWidth: true,
    variant: "outlined",
    ...props,
    ...field,
  };

  if(meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return (
    <Box mb={2}>
      <TextField {...configTextField}></TextField>
    </Box>
  );
};
