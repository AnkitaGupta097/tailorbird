import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { Dialog, DialogContent, Paper, Stack, Typography } from "@mui/material";
import BaseButton from "components/button";
import BaseTextField from "components/text-field";
import CommonDialog from "modules/admin-portal/common/dialog";
import { UNAWARD_CONTRACTOR_DIALOG } from "modules/projects/constant";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "stores/hooks";

interface IUnawardDialog {
    open: boolean;
    //eslint-disable-next-line
    setOpen: (val: boolean) => void;
    onProceed?: Function;
    contractorName: string;
    projectId: string;
}

const UnawardDialog: React.FC<IUnawardDialog> = ({
    open,
    setOpen,
    projectId,
    onProceed,
    contractorName,
}) => {
    const [field, setField] = useState<string>("");
    let [loader, setLoader] = React.useState<boolean>(false);

    const { loading, error } = useAppSelector((state) => {
        return {
            loading: projectId ? state.rfpProjectManager.details?.[projectId]?.loading : false,
            error: projectId ? state.rfpProjectManager.details?.[projectId]?.error : false,
        };
    });

    const handleProceed = () => {
        onProceed?.();
        setOpen?.(false);
        setLoader(true);
    };

    useEffect(() => {
        if (!loading || error) {
            setTimeout(() => {
                setLoader(false);
            }, 2000);
        }
        //eslint-disable-next-line
    }, [loading, error]);

    return (
        <>
            <CommonDialog
                open={loader}
                onClose={() => setLoader(false)}
                loading={loading}
                //@ts-ignore
                error={error}
                loaderText={UNAWARD_CONTRACTOR_DIALOG.UNAWARDING}
                errorText={UNAWARD_CONTRACTOR_DIALOG.ERROR}
                saved={!loading && !error}
                savedText={UNAWARD_CONTRACTOR_DIALOG.SAVED}
                width="40rem"
                minHeight="26rem"
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent sx={{ padding: "2rem 4rem" }}>
                    <Stack height="100%" justifyContent="center" alignItems="center">
                        <Paper elevation={3} sx={{ padding: "1rem", marginBottom: "1rem" }}>
                            <WarningAmberOutlinedIcon htmlColor="#D90000" fontSize="large" />
                        </Paper>
                        <Typography variant={"text_18_regular"} sx={{ marginBottom: "20px" }}>
                            {UNAWARD_CONTRACTOR_DIALOG.REMOVE_CONTRACTOR}
                            <br />
                            {UNAWARD_CONTRACTOR_DIALOG.CONTRACTOR_NAME(contractorName)}
                        </Typography>
                        <BaseTextField
                            variant={"outlined"}
                            sx={{ marginBottom: "20px" }}
                            onChange={(event: any) => {
                                setField(event.target.value);
                            }}
                        />
                    </Stack>
                    <Stack direction="row" justifyContent="center" gap={"15px"}>
                        <BaseButton
                            onClick={() => {
                                setOpen(false);
                            }}
                            label={UNAWARD_CONTRACTOR_DIALOG.CANCEL}
                            classes="grey default"
                            variant={"text_14_regular"}
                            style={{ padding: "1rem" }}
                        />
                        <BaseButton
                            onClick={handleProceed}
                            label={UNAWARD_CONTRACTOR_DIALOG.PROCEED}
                            disabled={field !== contractorName}
                            classes={field === contractorName ? "error default" : "error disabled"}
                            variant={"text_16_semibold"}
                            style={{ padding: "1rem" }}
                        />
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UnawardDialog;
