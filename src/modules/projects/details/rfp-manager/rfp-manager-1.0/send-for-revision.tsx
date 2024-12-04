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
import { useAppDispatch } from "stores/hooks";
import actions from "stores/actions";
import IconResend from "assets/icons/icon_resend";
import BaseDataGrid from "components/data-grid";
import BaseButton from "components/button";
import BaseCheckbox from "components/checkbox";

interface ISendForRevision {
    columns: any[];

    contractors: {
        id: string;
        bid_status: string;

        name: string;
        email: string;
    }[];
    openRevisionModal: boolean;
    // eslint-disable-next-line no-unused-vars
    setLoader: (val: any) => void;
    setOpenRevisionModal: React.Dispatch<React.SetStateAction<boolean>>;
    project_id: string | undefined;
    rfp_project_version: string | undefined;
}

const SendForRevision = ({
    columns,
    setLoader,
    contractors,
    openRevisionModal,
    setOpenRevisionModal,
    project_id,
    rfp_project_version,
}: ISendForRevision) => {
    const [contractorsList, setContractorsList] = useState<any>([]);
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const dispatch = useAppDispatch();

    const onSend = () => {
        if (selectedIds.length > 0) {
            setLoader({
                open: true,
                loaderText: "Sending for revision.",
                errorText: "",
                saveText: "Revision sent.",
            });
            dispatch(
                actions.rfpProjectManager.sendForRevisionStart({
                    organization_ids: selectedIds,
                    project_id: project_id,
                    rfp_project_version: rfp_project_version,
                }),
            );

            setOpenRevisionModal(false);
        }
        //eslint-disable-next-line
    };

    useEffect(() => {
        const data = contractors.filter((item) => item.bid_status == "submitted");
        setContractorsList(data);
    }, [contractors]);

    useEffect(() => {
        //eslint-disable-next-line
    }, []);

    return (
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
                            <DisabledByDefaultRoundedIcon htmlColor="#004D71" fontSize="large" />
                        </IconButton>
                    </Grid>
                </Grid>
                <Divider sx={{ marginTop: "0.5rem" }} />
            </DialogTitle>
            <DialogContent>
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
                            disabled={selectedIds?.length > 0 ? false : true}
                            onClick={onSend}
                            label={"Send"}
                            classes={
                                selectedIds?.length > 0 ? "primary default" : "primary disabled"
                            }
                            variant={"text_16_semibold"}
                        />
                    </Stack>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default SendForRevision;
