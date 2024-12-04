import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../stores/hooks";
import actions from "../../../stores/actions";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";

const PkgSnackBar = () => {
    const dispatch = useAppDispatch();
    const { snackbar } = useAppSelector((state) => ({
        snackbar: state.common.snackbar,
    }));
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const { open, variant, message } = snackbar;
        open &&
            enqueueSnackbar("", {
                variant: variant,
                action: <BaseSnackbar variant={variant} title={message?.toString() ?? ""} />,
                onClose: () => {
                    dispatch(actions.common.closeSnack());
                },
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snackbar.open]);

    return <></>;
};

export default PkgSnackBar;
