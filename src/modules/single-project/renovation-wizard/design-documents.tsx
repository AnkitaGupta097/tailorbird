/* eslint-disable no-unused-vars */
import React, { Fragment, useState } from "react";
import {
    Accordion,
    AccordionSummary,
    Stack,
    Typography,
    AccordionDetails,
    Box,
    Divider,
    ListItem,
    ListItemText,
    Button,
    IconButton,
    ListItemAvatar,
} from "@mui/material";
import FileUpload from "components/upload-files-new";

import { IFileDetails, IRenovationWizard } from "stores/single-project/interfaces";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress from "@mui/material/LinearProgress";
import { ReactComponent as FileIcon } from "assets/icons/file-icon.svg";
import { ReactComponent as PdfIcon } from "assets/icons/pdf.svg";
import { ReactComponent as DocxIcon } from "assets/icons/docx.svg";
import DescriptionIcon from "@mui/icons-material/Description";
import { useAppDispatch } from "stores/hooks";
import actions from "stores/actions";
import { useParams } from "react-router-dom";
import CommonDialog from "modules/admin-portal/common/dialog";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { ReactComponent as DownLoadIcon } from "assets/icons/download-property.svg";
import moment from "moment";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";

interface IDesignDocument extends IRenovationWizard {
    loading: boolean;
    getUploaderName?: any;
}

const DesignDocument = (renovationWizard: IDesignDocument) => {
    const { enqueueSnackbar } = useSnackbar();
    const { projectId } = useParams();
    const [open, setOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<IFileDetails | null>(null);
    const [isRemoveAll, setIsRemoveAll] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const uploadToS3 = (files: any, isCoverPhoto = false) => {
        const images = [...files]?.map((file: { name: string }) => ({
            file_name: file.name,
            file_type: "DESIGN_DOCUMENTS",
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
            }),
        );
        //MIXPANEL : Event tracking for  Design Documents uploaded
        mixpanel.track(`PROJECT DETAILS :Design Document uploaded`, {
            eventId: `project_design_document_uploaded`,
            ...getUserDetails(),
            ...getUserOrgDetails(),
            files: JSON.stringify([...files]),
            project_id: projectId,
        });
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
            //MIXPANEL : Event tracking for Design Document Downloaded
            mixpanel.track(`PROJECT DETAILS :Design Document Downloaded`, {
                eventId: `project_design_document_downloaded`,
                ...getUserDetails(),
                ...getUserOrgDetails(),
                file_id: fileId,
                project_id: projectId,
            });
        } catch (error) {
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant={status} title={"Something went wrong."} />,
            });
        }
    };
    const downloadAllFiles = async () => {
        try {
            renovationWizard.uploadDetails?.map((file: any) =>
                dispatch(
                    actions.singleProject.getFileDownloadStart({
                        input: {
                            fileId: file.id,
                        },
                    }),
                ),
            );
            //MIXPANEL : Event tracking for all Design Documents Downloaded
            mixpanel.track(`PROJECT DETAILS :All Design Documents Downloaded`, {
                eventId: `project_all_design_documents_downloaded`,
                ...getUserDetails(),
                ...getUserOrgDetails(),
                project_id: projectId,
            });
        } catch (error) {
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant={status} title={"Something went wrong."} />,
            });
        }
    };

    const DeleteFile = async (file: IFileDetails | undefined) => {
        const filestoRemove = isRemoveAll ? [...renovationWizard.uploadDetails] : [file];

        try {
            dispatch(
                actions.singleProject.DeleteDesignDocumentsStart({
                    project_id: projectId,
                    files: filestoRemove,
                    user_id: localStorage.getItem("user_id"),
                    file_type: "DESIGN_DOCUMENTS",
                }),
            );
            //MIXPANEL : Event tracking for  Design Documents deleted
            mixpanel.track(`PROJECT DETAILS :Design Document deleted`, {
                eventId: `project_design_document_deleted`,
                ...getUserDetails(),
                ...getUserOrgDetails(),
                project_id: projectId,
            });
            setIsRemoveAll(false);
            setItemToRemove(null);
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };
    const getFileIcon = (filename: any) => {
        const fileExtension = filename.split(".").pop().toLowerCase();

        switch (fileExtension) {
            case "pdf":
                return <PdfIcon />;
            case "xlsx":
            case "xls":
            case "csv":
                return <FileIcon />;
            case "doc":
            case "docx":
                return <DocxIcon />;
            default:
                return <DescriptionIcon />;
        }
    };
    const handleOpenDailog = (isFromAllDelete: boolean) => {
        isFromAllDelete && setIsRemoveAll(true);
        setOpen(true);
    };

    return (
        <Box sx={Styles.rectangleCard}>
            <CommonDialog
                open={open}
                title={`Are you sure to want delete ${isRemoveAll ? "all files?" : "?"}`}
                onClose={() => {
                    setOpen(false), setIsRemoveAll(false);
                }}
                onDelete={async () =>
                    isRemoveAll
                        ? await DeleteFile(undefined)
                        : itemToRemove && (await DeleteFile(itemToRemove))
                }
                deleteText={`Are you sure to want delete ${isRemoveAll ? "all files?" : "?"}`}
                deleteDialog={true}
                width="40rem"
            />
            <Box>
                <FileUpload
                    isMultiple={true}
                    accept=".doc,.docm,.docx,.pdf,.xlsx,.xlsm,.xls"
                    onFileChange={(file: any) => uploadToS3(file, false)}
                    helperText="Accepts .doc,.docm,.docx,.pdf,.xlsx,.xlsm and .xls only"
                    sizeLimitText="Maximum size: Excel - 100 KB, PDF or Doc - 20MB."
                    showsizeLimit={true}
                />
                {renovationWizard.loading && <LinearProgress />}
                {renovationWizard.uploadDetails?.length > 0 && (
                    <>
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            sx={{ margin: "8px 15px 8px 0px" }}
                        >
                            <Typography
                                variant="text_14_semibold"
                                color="#232323"
                                style={{ lineHeight: "20px" }}
                            >
                                Uploaded Files
                            </Typography>
                            <Box>
                                <Button
                                    variant="outlined"
                                    style={{ height: "40px" }}
                                    endIcon={<DownLoadIcon />}
                                    onClick={() => downloadAllFiles()}
                                >
                                    <Typography variant="text_16_semibold">Download all</Typography>
                                </Button>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleOpenDailog(true)}
                                >
                                    <CloseIcon style={{ color: "#8C9196", cursor: "pointer" }} />
                                </IconButton>
                            </Box>
                        </Stack>
                        <Divider />
                        {renovationWizard.uploadDetails?.map((uploadedItem: IFileDetails) => {
                            return (
                                <ListItem
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => {
                                                handleOpenDailog(false),
                                                    setItemToRemove(uploadedItem);
                                            }}
                                        >
                                            <CloseIcon
                                                style={{ color: "#8C9196", cursor: "pointer" }}
                                            />
                                        </IconButton>
                                    }
                                    key={uploadedItem.id}
                                    sx={{ marginBottom: "8px" }}
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
                                                )} by ${renovationWizard.getUploaderName(
                                                    uploadedItem.created_by,
                                                )}`}
                                            </Typography>
                                        }
                                        sx={{ display: "flex", flexDirection: "column" }}
                                    />

                                    <Button
                                        variant="outlined"
                                        style={{ height: "40px" }}
                                        endIcon={<DownLoadIcon />}
                                        onClick={() => downloadFile(uploadedItem.id)}
                                    >
                                        <Typography variant="text_16_semibold">Download</Typography>
                                    </Button>
                                </ListItem>
                            );
                        })}
                    </>
                )}
            </Box>
        </Box>
    );
};
export default DesignDocument;
const Styles = {
    rectangleCard: {
        padding: "16px 20px",
        gap: "10px",
        borderRadius: "4px",
        border: "1px solid #C9CCCF",
        background: "#FFF",
    },
};
