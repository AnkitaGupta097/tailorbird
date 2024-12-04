import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Divider,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import FileUpload from "components/upload-files-new";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { IFileDetails } from "stores/single-project/interfaces";
import moment from "moment";
import { useSnackbar } from "notistack";
import actions from "stores/actions";
import mixpanel from "mixpanel-browser";
import CloseIcon from "@mui/icons-material/Close";
import { ReactComponent as FileIcon } from "assets/icons/file-icon.svg";
import { ReactComponent as PdfIcon } from "assets/icons/pdf.svg";
import { ReactComponent as DocxIcon } from "assets/icons/docx.svg";
import { ReactComponent as DownLoadIcon } from "assets/icons/download-property.svg";
import DescriptionIcon from "@mui/icons-material/Description";
import { useParams } from "react-router-dom";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import BaseSnackbar from "components/base-snackbar";
import ConfirmationDialog from "../common/confirmation-dialog";

const RenoWizardV2Uploads = () => {
    const { projectId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
    const [isDeleteAll, setIsDeleteAll] = useState<boolean>(false);
    const [itemToRemove, setItemToRemove] = useState<IFileDetails | null>(null);

    useEffect(() => {
        dispatch(
            actions.singleProject.getProjectScopeDocumentStart({
                project_id: projectId,
                file_type: "PROJECT_SCOPE_DOCUMENT",
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { uploadedFiles, allUsers } = useAppSelector((state) => ({
        uploadedFiles: state.singleProject.renovationWizardV2.uploadedFiles.data,
        allUsers: state.tpsm.all_User?.users || [],
        notes: state.singleProject.renovationWizardV2.notes,
    }));
    const deleteFiles = (deleteAll: boolean) => {
        deleteAll && setIsDeleteAll(true);
        setShowDeleteConfirmationDialog(true);
    };
    const getUploaderName = (userId: any) => {
        return allUsers.find((item: any) => item.id == userId)?.name || "NA";
    };

    const onFileUpload = (files: any) => {
        const images = [...files]?.map((file) => ({
            file_name: file.name,
            file_type: "PROJECT_SCOPE_DOCUMENT",
            tags: {
                content_type: file.type,
            },
        }));
        dispatch(
            actions.singleProject.createProjectScopeDocumentStart({
                input: {
                    project_id: projectId,
                    user_id: localStorage.getItem("user_id"),
                    files: images,
                },
                files: [...files],
                isProjectScopeDocument: true,
            }),
        );
        //MIXPANEL : Event tracking for  Project Scope Documents uploaded
        mixpanel.track(`RENO _WIZARD :Project Scope Document uploaded`, {
            eventId: `project_scope_document_uploaded`,
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
            //MIXPANEL : Event tracking for Project Scope Document Downloaded
            mixpanel.track(`RENO _WIZARD :Project Scope Document Downloaded`, {
                eventId: `project_scope_document_downloaded`,
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
            uploadedFiles?.map((file: any) =>
                dispatch(
                    actions.singleProject.getFileDownloadStart({
                        input: {
                            fileId: file.id,
                        },
                    }),
                ),
            );
            //MIXPANEL : Event tracking for all Project Scope Documents Downloaded
            mixpanel.track(`RENO WIZARD V2 :All Project Scope Documents Downloaded`, {
                eventId: `all_project_scope_documents_downloaded`,
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
        const filestoRemove = isDeleteAll ? [...uploadedFiles] : [file];

        try {
            dispatch(
                actions.singleProject.DeleteDesignDocumentsStart({
                    project_id: projectId,
                    files: filestoRemove,
                    user_id: localStorage.getItem("user_id"),
                    file_type: "PROJECT_SCOPE_DOCUMENT",
                }),
            );
            //MIXPANEL : Event tracking for  Project Scope Documents deleted
            mixpanel.track(`RENO WIZARD V2 :Project Scope Document deleted`, {
                eventId: `project_scope_document_deleted`,
                ...getUserDetails(),
                ...getUserOrgDetails(),
                project_id: projectId,
            });
            setIsDeleteAll(false);
            setItemToRemove(null);
            setShowDeleteConfirmationDialog(false);
        } catch (error) {
            console.error(error);
        }
    };
    const getFileIcon = (filename: any) => {
        const fileExtension = filename.split(".").pop().toLowerCase();

        switch (fileExtension) {
            case "pdf":
                return <PdfIcon />;
            case "xls":
            case "xlsx":
            case "csv":
                return <FileIcon />;
            case "doc":
            case "docx":
                return <DocxIcon />;
            default:
                return <DescriptionIcon />;
        }
    };

    return (
        <Box pb={4}>
            <FileUpload
                isMultiple
                helperText="Accepts most file type"
                onFileChange={onFileUpload}
            />
            {uploadedFiles?.length > 0 && (
                <>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
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
                                variant="text"
                                style={{ height: "40px" }}
                                endIcon={<DownLoadIcon />}
                                onClick={() => downloadAllFiles()}
                            >
                                <Typography variant="text_16_semibold">Download all</Typography>
                            </Button>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => deleteFiles(true)}
                            >
                                <CloseIcon style={{ color: "#8C9196", cursor: "pointer" }} />
                            </IconButton>
                        </Box>
                    </Stack>
                    <Divider />
                    {uploadedFiles?.map((uploadedItem: IFileDetails) => {
                        return (
                            <ListItem
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => {
                                            deleteFiles(false), setItemToRemove(uploadedItem);
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
                                            )} by ${getUploaderName(uploadedItem.created_by)}`}
                                        </Typography>
                                    }
                                    sx={{ display: "flex", flexDirection: "column" }}
                                />

                                <Button
                                    variant="text"
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

            <ConfirmationDialog
                title={`Delete ${isDeleteAll ? "files?" : "file?"}`}
                content={`Are you sure to want delete ${isDeleteAll ? "all files?" : "this file?"}`}
                open={showDeleteConfirmationDialog}
                onCancel={() => {
                    setShowDeleteConfirmationDialog(false), setIsDeleteAll(false);
                }}
                onDone={async () =>
                    isDeleteAll
                        ? await DeleteFile(undefined)
                        : itemToRemove && (await DeleteFile(itemToRemove))
                }
            />
        </Box>
    );
};

export default RenoWizardV2Uploads;
