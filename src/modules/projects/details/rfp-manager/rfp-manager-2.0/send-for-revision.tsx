import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Typography,
    Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import IconResend from "assets/icons/icon_resend";
import BaseDataGrid from "components/data-grid";
import BaseButton from "components/button";
import BaseCheckbox from "components/checkbox";
import BaseTextArea from "components/text-area";
import CommonDialog from "modules/admin-portal/common/dialog";
import ContentPlaceholder from "components/content-placeholder";

interface ISendForRevision {
    columns: any[];

    contractors: {
        id: string;
        bid_status: string;

        name: string;
        email: string;
    }[];
    openRevisionModal: boolean;
    setOpenRevisionModal: React.Dispatch<React.SetStateAction<boolean>>;
    project_id: string | undefined;
    latestRenovationVersion: number;
    rfpProjectVersion: string;
}

const SendForRevision = ({
    columns,
    contractors,
    openRevisionModal,
    setOpenRevisionModal,
    project_id,
    latestRenovationVersion,
    rfpProjectVersion,
}: ISendForRevision) => {
    const [contractorsList, setContractorsList] = useState<any>([]);
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [description, setDescription] = useState("");
    let [loader, setLoader] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();
    const user_id = localStorage.getItem("user_id");

    const { loading, error } = useAppSelector((state) => {
        return {
            loading: project_id ? state.rfpProjectManager.details?.[project_id]?.loading : false,
            error: project_id ? state.rfpProjectManager.details?.[project_id]?.error : false,
        };
    });

    const onSend = () => {
        if (selectedIds.length > 0) {
            dispatch(
                actions.rfpProjectManager.createBidRequestStart({
                    input: {
                        project_id: project_id,
                        contractor_org_ids: selectedIds,
                        created_by: user_id,
                        reno_item_version:
                            latestRenovationVersion > 0 ? latestRenovationVersion : 1,
                        description: description,
                        type: "revision_request",
                    },
                    rfpProjectVersion,
                }),
            );
            setOpenRevisionModal(false);
            setDescription("");
            setSelectedIds([]);
            setContractorsList([]);
            setLoader(true);
        }
        //eslint-disable-next-line
    };

    const handleChange = (event: { target: { value: string } }) => {
        setDescription(event?.target?.value);
    };

    useEffect(() => {
        setContractorsList(contractors);
    }, [contractors]);

    useEffect(() => {
        //eslint-disable-next-line
    }, []);

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
            <Dialog
                open={openRevisionModal}
                onClose={() => setOpenRevisionModal(false)}
                fullWidth
                maxWidth={"lg"}
            >
                <DialogTitle>
                    <Grid container>
                        <Grid item sx={{ display: "flex", alignItems: "center" }} xs={11}>
                            <IconResend fill={"#000"} />
                            <Typography variant="text_16_semibold" marginLeft={"13px"}>
                                {"Send for Revision: Select Contractors"}
                            </Typography>
                        </Grid>
                        <Grid item sx={{ display: "flex", justifyContent: "flex-end" }} xs>
                            <IconButton
                                sx={{ padding: 0 }}
                                onClick={() => {
                                    setOpenRevisionModal(false);
                                }}
                            >
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
                    {contractorsList?.length == 0 ? (
                        <ContentPlaceholder
                            onLinkClick={() => {}}
                            text={"No contractors found."}
                            aText={""}
                            height="300px"
                        />
                    ) : (
                        <Grid container gap={2}>
                            <Grid item md={12} sx={{ marginTop: "25px" }}>
                                {contractorsList.length > 0 && (
                                    <BaseDataGrid
                                        columns={columns}
                                        rows={contractorsList ?? []}
                                        rowsPerPageOptions={[10, 20, 30]}
                                        getRowHeight={() => "auto"}
                                        rowHeight={125}
                                        components={{
                                            BaseCheckbox: BaseCheckbox,
                                        }}
                                        onSelectionModelChange={(ids: string[]) => {
                                            setSelectedIds(ids);
                                        }}
                                        checkboxSelection={true}
                                        getRowId={(row: any) => row?.organization_id}
                                    />
                                )}
                            </Grid>
                            <Grid item md={12} marginTop="1rem">
                                <Typography variant="text_14_bold" color="#757575">
                                    Bidbook Revision Summary *
                                </Typography>
                            </Grid>
                            <Grid item md={12}>
                                <BaseTextArea
                                    style={{ width: "100%", minHeight: "6em" }}
                                    onChange={handleChange}
                                    value={description}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Grid
                        container
                        sx={{ display: "flex", alignItems: "flex-end", marginRight: "16px" }}
                        justifyContent="flex-end"
                    >
                        <Stack
                            direction="row"
                            sx={{ display: "flex", alignItems: "flex-end" }}
                            justifyContent="flex-end"
                            gap={"15px"}
                        >
                            <BaseButton
                                onClick={() => {
                                    setOpenRevisionModal(false);
                                }}
                                label={"Cancel"}
                                classes="grey default"
                                variant={"text_14_regular"}
                            />
                            <BaseButton
                                disabled={
                                    selectedIds?.length > 0 && description?.length > 0
                                        ? false
                                        : true
                                }
                                onClick={onSend} //MIXPANEL : Project updated or revised
                                label={"Send"}
                                classes={
                                    selectedIds?.length > 0 && description?.length
                                        ? "primary default"
                                        : "primary disabled"
                                }
                                variant={"text_16_semibold"}
                            />
                        </Stack>
                    </Grid>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SendForRevision;
