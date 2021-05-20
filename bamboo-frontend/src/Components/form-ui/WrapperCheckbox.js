import React from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@material-ui/core";
import { useField, useFormikContext } from "formik";

const WrapperCheckbox = ({ arrayHelpers, cart,id, name, label, legend, ...props }) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const handleChange = (e) => {
    const { checked } = e.target;
    if(checked) {
        arrayHelpers.push({id, name})
    } else {
        const idx = cart.indexOf(name);
        arrayHelpers.remove(idx);
    }
  };

  const handleChecked = () => {
    if(cart.includes(name)) {
      return true;
    }
    return false;
  }

  const configCheckbox = {
    ...field,
    onChange: handleChange,
  };

  const configFormControl = {};
  if (meta && meta.touched && meta.error) {
    configFormControl.error = true;
  }

  return (
    <FormControl {...configFormControl}>
      <FormLabel component="legend">{legend}</FormLabel>
      <FormGroup>
      <FormControlLabel
        control={<Checkbox {...configCheckbox} />}
        label={label}
      ></FormControlLabel>
      </FormGroup>
    </FormControl>
  );
};

export default WrapperCheckbox;
