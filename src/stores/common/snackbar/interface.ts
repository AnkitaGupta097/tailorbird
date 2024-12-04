import { SnackbarKey } from "notistack";
import React from "react";
export interface ISnackbar {
    open: boolean;
    variant: "info" | "warning" | "error" | "success";
    message: string | React.ReactNode;
    description: string;
    //eslint-disable-next-line
    action?: React.ReactNode | ((key: SnackbarKey) => React.ReactNode);
}
