import { TextField } from "@mui/material";
import React, { useState } from "react";

interface IBaseTextField {
    value?: any;
    variant: "filled" | "outlined" | "standard";
    onChangeHandler?: Function;
    name?: string;
    id?: number;
    inputProps?: object;
    fullWidth?: boolean;
    multiline?: boolean;
}

const BaseTextField = (props: IBaseTextField) => {
    const [value, setValue] = useState(props?.value);

    return (
        <TextField
            variant={props?.variant}
            fullWidth={props?.fullWidth}
            multiline={props?.multiline}
            value={value}
            defaultValue={props?.value}
            InputProps={props?.inputProps}
            onChange={(event: any) => {
                setValue(event.target.value);
            }}
            onKeyDown={(event) => {
                if (event.key === "Enter" && props?.onChangeHandler)
                    //@ts-ignore
                    props?.onChangeHandler(props?.name, value, props?.id);
            }}
            onBlur={() => {
                if (props?.onChangeHandler)
                    //@ts-ignore
                    props?.onChangeHandler(props?.name, value, props?.id);
            }}
        />
    );
};

export default BaseTextField;
