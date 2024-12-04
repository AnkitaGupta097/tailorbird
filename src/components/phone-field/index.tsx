import { Stack, SxProps, Theme, Typography } from "@mui/material";
import React from "react";
import MuiPhoneNumber, { MuiPhoneNumberProps } from "material-ui-phone-number";

type IPhoneField = {
    label?: string;
    containerStyle?: SxProps<Theme>;
    labelStyle?: SxProps<Theme>;
    value?: string;
    //eslint-disable-next-line
    onChange: (e: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    phoneNumberFieldSx?: SxProps<Theme>;
    size?: "small" | "medium";
    variant?: "outlined" | "filled" | "standard";
    containerSpacing?: string | number;
} & MuiPhoneNumberProps;

const PhoneNumberField: React.FC<IPhoneField> = ({
    label,
    labelStyle,
    value,
    onChange,
    phoneNumberFieldSx,
    size,
    variant,
    containerStyle,
    containerSpacing,
    ...rest
}) => {
    return (
        <>
            <Stack
                direction="column"
                alignItems="left"
                sx={containerStyle}
                spacing={containerSpacing}
            >
                <Typography sx={labelStyle} variant="text_14_regular">
                    {label}
                </Typography>
                <MuiPhoneNumber
                    sx={phoneNumberFieldSx}
                    value={value}
                    defaultCountry="us"
                    variant={variant}
                    size={size}
                    onChange={onChange}
                    disableAreaCodes
                    {...rest}
                />
            </Stack>
        </>
    );
};

export default PhoneNumberField;
