import React, { useEffect, useState } from "react";
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
import { ReactComponent as GSheet } from "assets/icons/sheets.svg";
import { ReactComponent as FileIcon } from "assets/icons/file-icon.svg";
import LaunchIcon from "@mui/icons-material/Launch";
import { IRFPProps } from "./index";
import moment from "moment";
import { isGoogleSpreadsheetLink } from "modules/projects/details/rfp-manager/rfp-manager-2.0/tabs/leveled-bisheet-upload";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";
import { graphQLClient } from "utils/gql-client";
import { GET_PROJECT_FILE } from "components/production/constants";
import { getFileFromS3AsArrayBuffer } from "stores/projects/details/overview/overview-queries-api";
import BidLevelSheetsViewer from "./bid-level-sheets-viewer";

export const getFileIcon = (filename: any) => {
    const fileExtension = filename.split(".").pop().toLowerCase();
    if (isGoogleSpreadsheetLink(filename)) {
        return <GSheet />;
    } else {
        switch (fileExtension) {
            case "xlsx":
            case "xls":
            case "csv":
                return <FileIcon />;

            default:
                return null;
        }
    }
};
function BidLevelSheets(RFP: IRFPProps) {
    const [openDocumentModal, setOpenDocumentModal]: any = useState(false);
    const [file, setFile] = useState<IFileDetails>();
    const [fileBuffer, setFileBuffer]: any = useState(null);
    const [isGoogleSheet, setIsGoogleSheet] = useState<boolean>(false);
    const [useSSOUrl, setUseSSOUrl] = useState<boolean>(false);

    const closeDocumentModal = () => {
        setIsGoogleSheet(false);
        setOpenDocumentModal(false);
    };

    const fetchFileById = (fileId: number) => {
        return graphQLClient.query("GetProjectFile", GET_PROJECT_FILE, {
            fileId,
        });
    };

    useEffect(() => {
        const user: any = JSON.parse(localStorage.getItem("user_details") || "{}");

        const user_metadata_key: string | undefined = Object.keys(user).find(
            (x) => x.indexOf("user_metadata") !== -1,
        );
        // Fot TB Admin users who dont have google workspace email, SSO will not work
        // As its interim solution, we will try showing it as it is
        if (user_metadata_key) {
            const user_metadata: any = user[user_metadata_key];
            if (user_metadata?.google_workspace_email) {
                setUseSSOUrl(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openDocument = async (file: IFileDetails) => {
        if (file) {
            setFile(file);
            let fileName = file.file_name;
            let fileId = file.id;
            if (isGoogleSpreadsheetLink(fileName)) {
                setIsGoogleSheet(true);
                // MIXPANEL : Event tracking for Bid Google Sheet Opened
                mixpanel.track(`PROJECT DETAILS :Bid Google Sheet Opened`, {
                    eventId: `bid_leveled_sheet_opened`,
                    ...getUserDetails(),
                    ...getUserOrgDetails(),
                    file_link: fileName,
                });
                // setOpenDocumentModal(true);
                window.open(useSSOUrl ? file.gdoc_sso_url : file.file_name, "_blank");
            } else {
                // fetch downloadable link of project-file
                const result = await fetchFileById(fileId);
                let fileArrayBuffer = await getFileFromS3AsArrayBuffer(
                    result?.getProjectFile?.download_link,
                );
                setFileBuffer(fileArrayBuffer);
                setOpenDocumentModal(true);
            }
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
                        Leveled Bid Sheet
                    </Typography>
                    <BaseChip
                        label={`${RFP.leveledBidSheets?.length} Versions`}
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
                {RFP.leveledBidSheets?.length > 0 ? (
                    <>
                        {RFP.leveledBidSheets?.map((uploadedItem: IFileDetails) => {
                            return (
                                <ListItem
                                    secondaryAction={
                                        <Button
                                            classes="primary default"
                                            onClick={() => openDocument(uploadedItem)}
                                            label={""}
                                            endIcon={<LaunchIcon />}
                                            style={{ width: "fit-content" }}
                                        >
                                            <Typography variant="text_16_semibold">Open</Typography>
                                        </Button>
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
                                                {isGoogleSpreadsheetLink(uploadedItem.file_name)
                                                    ? `Leveled Bid sheet - ${moment(
                                                          uploadedItem?.created_at,
                                                      ).format("MM/DD/YYYY")}`
                                                    : uploadedItem.file_name}
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
                <BidLevelSheetsViewer
                    open={openDocumentModal}
                    file={file}
                    isGoogleSheet={isGoogleSheet}
                    onClose={closeDocumentModal}
                    fileBuffer={fileBuffer}
                />
            </AccordionDetails>
        </Accordion>
    );
}
export default BidLevelSheets;
