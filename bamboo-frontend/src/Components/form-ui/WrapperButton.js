import React from "react";
import { Button } from "@material-ui/core";
import { useFormikContext } from 'formik';

const WrapperButton = ({children, ...props}) => {
    const { submitForm } = useFormikContext();

    const handleSubmit = () => {
        submitForm();
    }

    const configButton = {
        variant: 'contained',
        color: 'primary',
        fullWidth: true,
        onClick: handleSubmit,
    }

    return (
        <Button 
        {...configButton}>
            {children}
        </Button>
    );
};

export default WrapperButton;