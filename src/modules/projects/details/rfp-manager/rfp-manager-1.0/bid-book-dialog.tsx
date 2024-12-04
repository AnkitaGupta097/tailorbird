import { Dialog, DialogContent, Paper, Stack, Typography } from "@mui/material";
import BaseButton from "components/button";
import React, { useEffect, useState } from "react";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import BaseTextField from "components/text-field";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import CommonDialog from "modules/admin-portal/common/dialog";
import { BID_BOOK_DIALOG } from "modules/projects/constant";

interface IBidBookDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    projectId: string | undefined;
    enableNewGcCopyOption: boolean;
}

const BidBookDialog = ({
    open,
    setOpen,
    projectId,
    enableNewGcCopyOption,
}: IBidBookDialogProps) => {
    const [field, setField] = useState<string>("");
    let [loader, setLoader] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();

    const { loading, error } = useAppSelector((state) => {
        return {
            loading: projectId ? state.rfpProjectManager.details?.[projectId]?.loading : false,
            error: projectId ? state.rfpProjectManager.details?.[projectId]?.error : false,
        };
    });

    const handleProceed = () => {
        if (enableNewGcCopyOption)
            dispatch(
                actions.rfpProjectManager.createBidBookStart({
                    project_id: projectId,
                    generate_copies_for_new_gcs: true,
                    regenerate_copies_of_existing_gcs: true,
                }),
            );
        else
            dispatch(
                actions.rfpProjectManager.createBidBookStart({
                    project_id: projectId,
                    generate_copies_for_new_gcs: false,
                    regenerate_copies_of_existing_gcs: true,
                }),
            );
        setOpen(false);
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
                loaderText={BID_BOOK_DIALOG.GC_COPIES_LOADING}
                errorText={BID_BOOK_DIALOG.GC_COPIES_FAILED}
                saved={!loading && !error}
                savedText={BID_BOOK_DIALOG.GC_COPIES_SAVED}
                width="40rem"
                minHeight="26rem"
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <Stack height="100%" justifyContent="center" alignItems="center">
                        <Paper elevation={3} sx={{ padding: "1rem", marginBottom: "1rem" }}>
                            <WarningAmberOutlinedIcon htmlColor="#D90000" fontSize="large" />
                        </Paper>
                        <Typography variant={"text_18_regular"} sx={{ marginBottom: "20px" }}>
                            {BID_BOOK_DIALOG.GC_COPIES_WARNING}
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
                            label={BID_BOOK_DIALOG.CANCEL}
                            classes="grey default"
                            variant={"text_14_regular"}
                        />
                        <BaseButton
                            onClick={handleProceed}
                            label={BID_BOOK_DIALOG.PROCEED}
                            classes={
                                field === BID_BOOK_DIALOG.ERASE ? "error default" : "error disabled"
                            }
                            variant={"text_16_semibold"}
                        />
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BidBookDialog;
