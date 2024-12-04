import React from "react";
import {
    Accordion,
    AccordionSummary,
    Stack,
    Typography,
    Divider,
    AccordionDetails,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import BaseChip from "components/chip";
import Button from "components/button";
import { IFileDetails } from "stores/single-project/interfaces";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { ReactComponent as GSheet } from "assets/icons/sheets.svg";
import { ReactComponent as FileIcon } from "assets/icons/file-icon.svg";
import LaunchIcon from "@mui/icons-material/Launch";
import { IRFPProps } from "./index";
import moment from "moment";

import { isGoogleDocumentLink } from "modules/projects/details/rfp-manager/rfp-manager-2.0/tabs/contract-upload";

import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";
import { useAppDispatch } from "stores/hooks";
import actions from "stores/actions";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";

export const getFileIcon = (filename: any) => {
    const fileExtension = filename.split(".").pop().toLowerCase();
    if (isGoogleDocumentLink(filename)) {
        return <GSheet />;
    } else {
        switch (fileExtension) {
            case "xlsx":
            case "csv":
                return <FileIcon />;

            default:
                return null;
        }
    }
};

function Contract(RFP: IRFPProps) {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const downloadFile = async (fileId: any) => {
        try {
            dispatch(
                actions.singleProject.getFileDownloadStart({
                    input: {
                        fileId: fileId,
                    },
                }),
            );
        } catch (error) {
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant={"error"} title={"Something went wrong."} />,
            });
        }
    };
    return (
        <Accordion elevation={0}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-level-bid-content"
                id="panel-level-bid-header"
            >
                <Stack direction={"row"} gap={"1.5rem"} alignItems={"center"}>
                    <Typography variant="text_18_semibold" color={"#232323"}>
                        Contracts
                    </Typography>
                    <BaseChip
                        label={`${RFP.contracts.data?.length} Versions`}
                        bgcolor={"#AEE9D1"}
                        textColor={"#0E845C"}
                        sx={{
                            width: "fit-content",
                            fontSize: "14px",
                            fontWeight: 400,
                            fontFamily: "Roboto",
                            lineHeight: "20px",
                            borderRadius: "4px",
                            border: "1px solid  #AEE9D1",
                        }}
                    />
                </Stack>
            </AccordionSummary>
            <Divider sx={{ color: "#232323", marginBottom: "1.5rem" }} />
            <AccordionDetails>
                {RFP.contracts.data?.length > 0 ? (
                    <>
                        {RFP.contracts.data?.map((uploadedItem: IFileDetails) => {
                            console.log("uploadedItem?.file_name", uploadedItem?.file_name);

                            return (
                                <ListItem
                                    secondaryAction={
                                        isGoogleDocumentLink(uploadedItem?.file_name) ? (
                                            <Button
                                                classes="primary default"
                                                onClick={() => {
                                                    //MIXPANEL : Event tracking for Bid Google Doc Opened
                                                    mixpanel.track(
                                                        `PROJECT DETAILS :Bid Google Doc Opened`,
                                                        {
                                                            eventId: `bid_leveled_sheet_opened`,
                                                            ...getUserDetails(),
                                                            ...getUserOrgDetails(),
                                                            file_link: uploadedItem?.file_name,
                                                        },
                                                    ),
                                                        window.open(
                                                            uploadedItem?.file_name,
                                                            "_blank",
                                                        );
                                                }}
                                                label={""}
                                                endIcon={<LaunchIcon />}
                                                style={{ width: "fit-content" }}
                                            >
                                                <Typography variant="text_16_semibold">
                                                    Open in Google Docs
                                                </Typography>
                                            </Button>
                                        ) : (
                                            <Button
                                                classes="primary outlined"
                                                onClick={() => downloadFile(uploadedItem.id)}
                                                label={""}
                                                endIcon={<DownloadOutlinedIcon />}
                                                style={{
                                                    width: "fit-content",
                                                    borderRadius: "4px",
                                                    border: "1px solid var(--v-3-colors-action-primary-default, #004D71)",
                                                }}
                                            >
                                                <Typography variant="text_16_semibold">
                                                    Download
                                                </Typography>
                                            </Button>
                                        )
                                    }
                                    key={uploadedItem.id}
                                    sx={{
                                        marginBottom: "8px",
                                        borderRadius: "4px",
                                        border: "1px solid  #C9CCCF",
                                    }}
                                >
                                    <ListItemAvatar>
                                        {getFileIcon(uploadedItem.file_name)}
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="text_12_semibold"
                                                color={"#232323"}
                                                sx={{ lineHeight: "16px" }}
                                            >
                                                {uploadedItem.file_name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                variant="text_12_regular"
                                                color={"#757575"}
                                                sx={{ lineHeight: "16px" }}
                                            >
                                                {`${moment(uploadedItem.created_at).format(
                                                    "l [at] LT",
                                                )} by ${RFP.getUploaderName(
                                                    uploadedItem.created_by,
                                                )}`}
                                            </Typography>
                                        }
                                        sx={{ display: "flex", flexDirection: "column" }}
                                    />
                                </ListItem>
                            );
                        })}
                    </>
                ) : (
                    <Typography
                        variant="text_14_light"
                        color={"#757575"}
                        textAlign={"center"}
                        sx={{ display: "block" }}
                    >
                        No data available
                    </Typography>
                )}
            </AccordionDetails>
        </Accordion>
    );
}
export default Contract;
