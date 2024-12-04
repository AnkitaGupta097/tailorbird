import { Dialog, DialogContent, Paper, Stack, Typography } from "@mui/material";
import BaseButton from "components/button";
import React from "react";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { BID_BOOK_DIALOG } from "modules/projects/constant";
import { useAppDispatch } from "stores/hooks";
import actions from "stores/actions";

interface IUnLockBidBookDialogProps {
    open: boolean;
    setOpen: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            contractor_id: string;
            name: string;
        }>
    >;
    projectId: string | undefined;
    organization_id: string;
    contractor_name: string;
}

const UnLockBidBookDialog = ({
    open,
    setOpen,
    organization_id,
    projectId,
    contractor_name,
}: IUnLockBidBookDialogProps) => {
    const dispatch = useAppDispatch();
    const handleUnlockBidbook = () => {
        dispatch(
            actions.rfpProjectManager.updateBidStatusStart({
                organization_id: organization_id,
                project_id: projectId,
                status: "requested_revised_pricing",
                rfp_project_version: "2.0",
            }),
        );
        setOpen({
            open: false,
            contractor_id: "",
            name: "",
        });
    };
    return (
        <>
            <Dialog
                open={open}
                onClose={() => {
                    setOpen({
                        open: false,
                        contractor_id: "",
                        name: "",
                    });
                }}
            >
                <DialogContent>
                    <Stack height="100%" alignItems={"center"}>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "1rem",
                                marginBottom: "1rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "70px",
                            }}
                        >
                            <WarningAmberOutlinedIcon htmlColor="#D90000" fontSize="large" />
                        </Paper>
                        <Typography variant={"text_18_regular"}>
                            {`Are you sure you want to unlock the bidbook for`}
                        </Typography>
                        <Typography
                            sx={{ marginBottom: "20px" }}
                        >{`${contractor_name}?`}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="center" gap={"15px"}>
                        <BaseButton
                            onClick={() => {
                                setOpen({
                                    open: false,
                                    contractor_id: "",
                                    name: "",
                                });
                            }}
                            label={BID_BOOK_DIALOG.CANCEL}
                            classes="grey default"
                            variant={"text_14_regular"}
                        />
                        <BaseButton
                            onClick={handleUnlockBidbook}
                            label={"Unlock"}
                            classes={"error default"}
                            variant={"text_16_semibold"}
                        />
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UnLockBidBookDialog;
