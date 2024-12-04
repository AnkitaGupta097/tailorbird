import React, { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CommonDialog from "modules/admin-portal/common/dialog";
import { graphQLClient } from "utils/gql-client";
import { UPDATE_PROJECT } from "stores/projects/details/index/index-queries";
import { useParams } from "react-router-dom";
interface IMaximumBidderspopup {
    oldMaxBidders: number;
    OldIsRestrictedMaxBidders: boolean;
    setMaxBidders: any;
    setIsRestrictedMaxBidders: any;
    contractors: any | undefined;
}
const MaximumBidderspopup = ({
    oldMaxBidders,
    OldIsRestrictedMaxBidders,
    setMaxBidders,
    setIsRestrictedMaxBidders,
    contractors,
}: IMaximumBidderspopup) => {
    const bidStatusIfContractorAccepted = [
        "submitted",
        "pending_submission",
        "requested_revised_pricing",
    ];
    const [updateMaxBidders, setUpdateMaxBidders] = useState<boolean>(false);
    const [initialStateChange, setInitialStateChange] = useState<boolean>(false);
    const [newMaxBidders, setNewMaxBidders] = useState<number>();
    const [newIsRestrictedMaxBidders, setNewIsRestrictedMaxBidders] = useState<boolean>(false);
    let [open, setOpen] = React.useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isloading, setIsLoading] = useState<boolean>(false);
    const [saved, setSaved] = useState<boolean>(false);
    const [contractorsAcceptedBid, setContractorsAcceptedBid] = React.useState<number>();

    const { projectId } = useParams();
    const handleMaxBiddersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e?.target?.value;
        setNewMaxBidders(input !== "" ? +input : undefined);
    };

    const handleRestrictedMode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewIsRestrictedMaxBidders(e?.target?.checked);
    };

    const handleSave = () => {
        setOpen(!open);
        setIsLoading(!isloading);
        graphQLClient
            .mutate("UpdateProject", UPDATE_PROJECT, {
                project_id: projectId,
                input: {
                    max_bidders:
                        contractorsAcceptedBid &&
                        newMaxBidders &&
                        contractorsAcceptedBid > newMaxBidders
                            ? contractorsAcceptedBid
                            : newMaxBidders,
                    is_restricted_max_bidders: newIsRestrictedMaxBidders,
                },
            })
            .then(() => {
                setIsLoading(false);
                setSaved(true);
                setTimeout(() => {
                    setOpen(false);
                    setSaved(false);
                    setUpdateMaxBidders(!updateMaxBidders);
                    setMaxBidders(newMaxBidders);
                    setIsRestrictedMaxBidders(newIsRestrictedMaxBidders);
                }, 1000);
            })
            .catch((error: any) => {
                setIsLoading(false);
                setIsError(true);
                setTimeout(() => {
                    setOpen(false);
                    setIsError(false);
                }, 2000);
                setUpdateMaxBidders(!updateMaxBidders);

                console.error(error);
            });
    };

    useEffect(() => {
        setNewMaxBidders(oldMaxBidders);
        setNewIsRestrictedMaxBidders(OldIsRestrictedMaxBidders);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setInitialStateChange(
            (newMaxBidders != oldMaxBidders ||
                newIsRestrictedMaxBidders != OldIsRestrictedMaxBidders) &&
                Number.isInteger(newMaxBidders)
                ? true
                : false,
        );
    }, [newMaxBidders, newIsRestrictedMaxBidders, oldMaxBidders, OldIsRestrictedMaxBidders]);

    useEffect(() => {
        if (contractors) {
            setContractorsAcceptedBid(
                () =>
                    contractors.filter((contractor: any) =>
                        bidStatusIfContractorAccepted.includes(contractor?.bid_status),
                    )?.length,
            );
        }
        //eslint-disable-next-line
    }, [contractors]);
    if (open) {
        return (
            <CommonDialog
                open={open}
                loading={isloading}
                //@ts-ignore
                loaderText={"Updating Maximum Bidders"}
                saved={saved}
                savedText={"Saved"}
                error={isError}
                errorName={"Error!"}
                errorText={"Failed to update maximum bidders"}
                width="40rem"
                minHeight="26rem"
            />
        );
    }
    return (
        <>
            <IconButton
                onClick={() => {
                    setUpdateMaxBidders(!updateMaxBidders);
                }}
            >
                <EditIcon fontSize="small" />
            </IconButton>
            <Dialog open={updateMaxBidders} fullWidth maxWidth={"xs"}>
                <DialogTitle>
                    <Typography variant="text_18_bold">{"Add Maximum Bidders"}</Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container marginTop={"1.25rem"}>
                        <Grid item width="100%">
                            <Typography>{"Maximum Bidders"}</Typography>
                            <TextField
                                defaultValue={
                                    contractorsAcceptedBid && contractorsAcceptedBid > oldMaxBidders
                                        ? contractorsAcceptedBid
                                        : oldMaxBidders
                                }
                                variant="outlined"
                                type="number"
                                inputProps={{ min: 0 }}
                                sx={{ width: "100%" }}
                                onChange={handleMaxBiddersChange}
                            />
                            <Stack direction={"row"} alignItems={"center"} marginLeft={"0rem"}>
                                <Checkbox
                                    color="primary"
                                    sx={{
                                        color: "#C9CCCF",
                                    }}
                                    onChange={handleRestrictedMode}
                                    defaultChecked={OldIsRestrictedMaxBidders}
                                />
                                <Typography variant="text_14_regular">
                                    Turn on Maximum Bidders
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} marginTop={"1.25rem"}>
                        <Grid item>
                            <Button
                                onClick={() => {
                                    setUpdateMaxBidders(!updateMaxBidders);
                                }}
                                sx={{
                                    backgroundColor: "#909090",
                                    color: "#ffff",
                                    "&:hover": {
                                        backgroundColor: "#787878",
                                    },
                                }}
                            >
                                {"Cancel"}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                onClick={handleSave}
                                sx={{
                                    backgroundColor: "#004D71",

                                    "&:hover": {
                                        backgroundColor: "#004D71",
                                    },
                                }}
                                disabled={!initialStateChange}
                                variant="contained"
                            >
                                {"Save"}
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MaximumBidderspopup;
