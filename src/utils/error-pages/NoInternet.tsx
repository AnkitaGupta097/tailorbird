import React from "react";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";

interface NoInternetProps {
    children?: any;
}

const NoInternet: React.FC<NoInternetProps> = (props) => {
    const { enqueueSnackbar } = useSnackbar();

    window.addEventListener("online", () => {
        // setOnline(true);
        enqueueSnackbar("", {
            variant: "success",
            action: <BaseSnackbar variant="success" title={"Back online"} />,
        });
    });

    window.addEventListener("offline", () => {
        // setOnline(false);
        enqueueSnackbar("", {
            variant: "error",
            action: (
                <BaseSnackbar variant="error" title={"You're offline. Check your connection."} />
            ),
        });
    });

    return props.children;
};

export default NoInternet;
