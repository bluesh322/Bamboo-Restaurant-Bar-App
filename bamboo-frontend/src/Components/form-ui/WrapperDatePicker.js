import React from "react";
import { TextField } from "@material-ui/core";
import { useField} from "formik";

const WrapperDatePicker = ({
    name,
    ...props
}) => {
    const [field, meta] = useField(name);
    


    const configDatePicker = {
        type: 'date',
        variant: 'outlined',
        fullWidth: true,
        InputLabelProps: {
            shrink: true
        },
        ...field,
        ...props
    };

    if(meta && meta.touched && meta.error) {
        configDatePicker.error = true;
        configDatePicker.helperText = meta.error;
    }

    return (
        <TextField
            {...configDatePicker}
        ></TextField>
    )
}

export default WrapperDatePicker;