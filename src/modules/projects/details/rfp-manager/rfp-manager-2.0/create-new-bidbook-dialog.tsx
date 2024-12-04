import FileCopyIcon from "@mui/icons-material/FileCopy";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import BaseButton from "components/button";
import BaseTextArea from "components/text-area";

import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import CommonDialog from "modules/admin-portal/common/dialog";
import React, { useEffect, useState } from "react";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { useParams } from "react-router-dom";

type CreateNewBidbookDialogProps = {
    open: boolean;
    contractor: null | {
        organization_id: string;
        bid_status: string;
        CONTRACTOR_ADMIN: any[];
        ESTIMATOR: any[];
        name: string;
        [x: string]: any;
    };
    onClose: () => void;
};

const CreateNewBidbookDialog: React.FC<CreateNewBidbookDialogProps> = ({
    open,
    contractor,
    onClose,
}) => {
    const { projectId } = useParams();
    const [description, setDescription] = useState("");
    let [loader, setLoader] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();
    const user_id = localStorage.getItem("user_id");
    const { loading, error } = useAppSelector((state) => {
        return {
            loading: projectId ? state.rfpProjectManager.details?.[projectId]?.loading : false,
            error: projectId ? state.rfpProjectManager.details?.[projectId]?.error : false,
        };
    });

    const onSend = () => {
        dispatch(
            actions.rfpProjectManager.createBidRequestStart({
                input: {
                    project_id: projectId,
                    contractor_org_ids: [contractor!.organization_id],
                    created_by: user_id,
                    reno_item_version:
                        contractor?.bid_requests?.[contractor?.bid_requests?.length - 1]
                            .reno_item_version,
                    description: description,
                    type: "bid_copy_request",
                },
                rfpProjectVersion: "2.0",
            }),
        );
        onClose();
        setDescription("");
        setLoader(true);

        //eslint-disable-next-line
    };

    const handleChange = (event: { target: { value: string } }) => {
        setDescription(event?.target?.value);
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
                loaderText={"Sending revision."}
                errorText={"Failed to send revision."}
                saved={!loading && !error}
                savedText={"Revision sent."}
                width="40rem"
                minHeight="26rem"
            />
            <Dialog open={open} onClose={onClose} fullWidth maxWidth={"lg"}>
                <DialogTitle>
                    <Grid container>
                        <Grid item sx={{ display: "flex", alignItems: "center" }} xs={11}>
                            <FileCopyIcon />
                            <Typography variant="text_16_semibold" marginLeft={"13px"}>
                                New BidBook Copy: {`${contractor?.name}`}
                            </Typography>
                        </Grid>
                        <Grid item sx={{ display: "flex", justifyContent: "flex-end" }} xs>
                            <IconButton sx={{ padding: 0 }} onClick={onClose}>
                                <DisabledByDefaultRoundedIcon
                                    htmlColor="#004D71"
                                    fontSize="large"
                                />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: "0.5rem" }} />
                </DialogTitle>
                <DialogContent>
                    <Grid container gap={6}>
                        <Grid item md={12} marginTop="1rem">
                            <Typography variant="text_14_semibold">
                                Note: this will allow the contractor to re-price the bidbook while
                                saving their previous pricing as a different version.
                            </Typography>
                        </Grid>
                        <Grid item md={12}>
                            <Stack direction="column" gap={2}>
                                <Typography variant="text_12_regular" color="#757575">
                                    Reason for creating the bidbook copy:*
                                </Typography>
                                <BaseTextArea
                                    style={{
                                        width: "100%",
                                        minHeight: "6rem",
                                        "::placeholder": {
                                            fontFamily: "IBM Plex Sans",
                                            fontSize: "500",
                                        },
                                        resize: "none",
                                    }}
                                    onChange={handleChange}
                                    value={description}
                                    placeholder="Briefly describe for the bidder what needs to be changed in this new copy of the bidbook..."
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        gap="15px"
                        mb="1rem"
                        mr=".75rem"
                    >
                        <BaseButton
                            onClick={onClose}
                            label="Cancel"
                            classes="grey default"
                            variant="text_14_regular"
                            sx={{
                                padding: ".75rem",
                            }}
                        />
                        <BaseButton
                            disabled={description?.length > 0 ? false : true}
                            onClick={onSend}
                            label="Send"
                            sx={{
                                padding: "0.75rem",
                            }}
                            classes={description?.length ? "primary default" : "primary disabled"}
                            variant="text_16_semibold"
                        />
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default CreateNewBidbookDialog;
