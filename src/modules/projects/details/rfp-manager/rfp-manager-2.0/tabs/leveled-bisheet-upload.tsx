/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Divider,
    LinearProgress,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { getFileIcon } from "modules/single-project/RFP/bid-level-sheets";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUpload from "components/upload-files-new";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import BaseButton from "components/button";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { IFileDetails } from "stores/single-project/interfaces";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";
import { useParams } from "react-router-dom";
import CommonDialog from "modules/admin-portal/common/dialog";
import actions from "stores/actions";
import moment from "moment";
import LaunchIcon from "@mui/icons-material/Launch";
import { isEmpty } from "lodash";
export const isGoogleSpreadsheetLink = (link: any) => {
    // Example of a Google Spreadsheet URL pattern: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
    const spreadsheetPattern = /https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
    return spreadsheetPattern.test(link);
};
const LeveledBidSheetsUpload = () => {
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const { leveledBidSheets, renovationWizard, allUsers } = useAppSelector((state) => {
        return {
            contractorWithUsers: projectId,
            allUsers: state.tpsm.all_User?.users || [],
            leveledBidSheets: state.singleProject.RFP.leveledBidSheets,
            renovationWizard: state.singleProject,
        };
    });
    const [open, setOpen] = useState(false);
    const [sheetLink, setSheetLink]: any = useState(null);
    const [itemToRemove, setItemToRemove] = useState<IFileDetails | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    const [rerenderKey, setRerenderKey] = useState(false); // New state for forcing rerender

    const handleUpload = () => {
        if (!sheetLink) return;

        if (!isGoogleSpreadsheetLink(sheetLink)) {
            invalidLinkAlert();
        } else {
            uploadToS3([{ name: extractFileNameFromUrl(sheetLink) }], false);
            setSheetLink(""); // Clear the sheetLink after upload
            setRerenderKey((prevKey) => !prevKey); // Toggle the rerender key
        }
    };

    const uploadToS3 = (files: any, isCoverPhoto = false) => {
        const images = [...files]?.map((file: { name: string }) => ({
            file_name: file.name,
            file_type: "LEVELED_BID_DOCUMENTS",
            tags: {
                is_cover_image: isCoverPhoto,
                projectId: projectId,
            },
        }));
        dispatch(
            actions.singleProject.createDesignDocumentsStart({
                input: {
                    project_id: projectId,
                    user_id: localStorage.getItem("user_id"),
                    files: images,
                },
                files: [...files],
                isLeveledBid: true,
            }),
        );
        setSheetLink();
    };
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

    const invalidLinkAlert = () => {
        enqueueSnackbar("", {
            variant: "error",
            action: (
                <BaseSnackbar variant={"error"} title={"Please provide valid spreadsheet link."} />
            ),
        });
    };
    const DeleteFile = async (file: IFileDetails | undefined) => {
        const filestoRemove = [file];

        try {
            dispatch(
                actions.singleProject.DeleteDesignDocumentsStart({
                    project_id: projectId,
                    files: filestoRemove,
                    user_id: localStorage.getItem("user_id"),
                    file_type: "LEVELED_BID_DOCUMENTS",
                }),
            );
            setItemToRemove(null);
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    function extractFileNameFromUrl(url: any) {
        // Extract the part after the last '/'
        // Remove "/edit" and anything after it
        const cleanUrl = url?.replace(/\/edit.*$/, "");

        return cleanUrl;
    }
    const getUploaderName = (userId: any) => {
        return allUsers.find((item: any) => item.id == userId)?.name || "NA";
    };

    return (
        <div>
            <CommonDialog
                open={open}
                title={`Are you sure to want delete?`}
                onClose={() => setOpen(false)}
                onDelete={async () => itemToRemove && (await DeleteFile(itemToRemove))}
                deleteText={`Are you sure to want delete?`}
                deleteDialog={true}
                width="40rem"
            />
            <Box
                mt={4}
                mb={7}
                sx={{
                    boxShadow:
                        "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                    padding: "15px",
                }}
            >
                <Typography
                    variant="text_16_semibold"
                    color="#232323"
                    style={{ lineHeight: "26px" }}
                >
                    Upload a leveled bid sheet.
                </Typography>
                <Stack style={{ margin: "1.5rem 0 0.3rem 1.5rem" }}>
                    <FileUpload
                        uploaderId={"leveled-bid"}
                        isMultiple={true}
                        accept=".xlsx"
                        onFileChange={(file: any) => uploadToS3(file, false)}
                        helperText="Accepts .xlsx only"
                        sizeLimitText="Maximum size: Excel - 100 KB"
                        showsizeLimit={true}
                    />
                </Stack>
                <Typography
                    variant="text_14_semibold"
                    color="#232323"
                    style={{ lineHeight: "20px" }}
                >
                    You may also provide a Google Sheets link as another option.
                </Typography>
                <Stack display={"flex"} direction={"row"} gap={2} mt={3} mb={3} ml={"1.5rem"}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder={`Enter Google Sheet link here`}
                        onChange={(e: any) => {
                            setSheetLink(e.target.value);
                        }}
                        sx={{
                            marginRight: "1rem",
                            width: "25rem",
                        }}
                        defaultValue={sheetLink}
                        value={sheetLink}
                    />
                    <BaseButton
                        classes={`primary ${!sheetLink ? "disabled" : "default"}`}
                        onClick={() => handleUpload()}
                        label={"Upload"}
                        disabled={!sheetLink}
                    />
                </Stack>
                {renovationWizard.loading && <LinearProgress />}
                <Divider sx={{ marginBottom: "2rem" }} />
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="text_18_semibold" color={"#232323"}>
                            Previously Uploaded Bid Sheets
                        </Typography>
                        <Divider />
                    </AccordionSummary>
                    <AccordionDetails>
                        {leveledBidSheets?.length > 0 ? (
                            leveledBidSheets?.map((uploadedItem: IFileDetails) => {
                                return (
                                    <ListItem key={uploadedItem.id} sx={{ marginBottom: "8px" }}>
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
                                                    )}  by ${getUploaderName(
                                                        uploadedItem.created_by,
                                                    )}`}
                                                </Typography>
                                            }
                                            sx={{ display: "flex", flexDirection: "column" }}
                                        />
                                        <Stack display={"flex"} flexDirection={"row"} gap={2}>
                                            {isGoogleSpreadsheetLink(uploadedItem?.file_name) ? (
                                                <BaseButton
                                                    classes={`primary default`}
                                                    endIcon={<LaunchIcon />}
                                                    onClick={() =>
                                                        window.open(
                                                            uploadedItem?.file_name,
                                                            "_blank",
                                                        )
                                                    }
                                                    label={""}
                                                    sx={{
                                                        padding: "10px 20px",
                                                    }}
                                                >
                                                    <Typography variant="text_16_semibold">
                                                        Open in Google Sheets
                                                    </Typography>
                                                </BaseButton>
                                            ) : (
                                                <BaseButton
                                                    classes={`primary default`}
                                                    endIcon={<SaveAltOutlinedIcon />}
                                                    onClick={() => downloadFile(uploadedItem.id)}
                                                    label={""}
                                                    sx={{
                                                        padding: "10px 20px",
                                                    }}
                                                >
                                                    <Typography variant="text_16_semibold">
                                                        Download
                                                    </Typography>
                                                </BaseButton>
                                            )}
                                            <BaseButton
                                                classes={"outlined"}
                                                onClick={() => {
                                                    setOpen(true), setItemToRemove(uploadedItem);
                                                }}
                                                label={""}
                                                endIcon={
                                                    <DeleteIcon
                                                        style={{
                                                            color: "#004D71",
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                }
                                                sx={{
                                                    border: "1px solid #004D71",
                                                    borderRadius: "4px",
                                                    padding: "10px 20px",
                                                }}
                                            >
                                                <Typography variant="text_16_semibold">
                                                    Delete
                                                </Typography>
                                            </BaseButton>
                                        </Stack>
                                    </ListItem>
                                );
                            })
                        ) : (
                            <Typography
                                variant="text_14_light"
                                color={"#757575"}
                                textAlign={"center"}
                                sx={{ display: "block" }}
                                mb={10}
                            >
                                No data available
                            </Typography>
                        )}
                    </AccordionDetails>
                </Accordion>
            </Box>
        </div>
    );
};
export default LeveledBidSheetsUpload;
