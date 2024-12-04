import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import BaseButton from "components/base-button";
import FileUpload from "components/upload-files-new";
import { useAppDispatch } from "stores/hooks";
import actions from "stores/actions";
import { useParams } from "react-router";
import UploadedFilesList from "./uploadedFilesList";
import { graphQLClient } from "utils/gql-client";
import {
    DELETE_PROJECT_FILES,
    GET_PROJECT_FILES,
} from "stores/projects/file-utility/file-utility-queries";
import CommonDialog from "modules/admin-portal/common/dialog";
import moment from "moment";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";

interface IUploadInfoPopup {
    IsFileLoading: boolean;
    IsSubmitted?: boolean;
}
const UploadInfoPopup: React.FC<IUploadInfoPopup> = ({ IsFileLoading, IsSubmitted }) => {
    const { projectId } = useParams();
    const organization_id = localStorage.getItem("organization_id");
    const user_id = localStorage.getItem("user_id");
    const [open, setOpen] = useState<boolean>(false);
    const [uploadedFiles, setUploadedFiles] = useState<any>([]);
    const [newFilesToUpload, setNewFilesToUpload] = useState<any>();
    const [docs, setDocs] = useState<any>();
    const [isFileSizeOver, setIsFileSizeOver] = useState<boolean>(false);
    const [errorDescription, setErrorDescription] = useState<string>();
    const [isFileDeleted, setIsFileDeleted] = useState<boolean>();
    const dispatch = useAppDispatch();
    useEffect(() => {
        graphQLClient
            .query("getProjectFiles", GET_PROJECT_FILES, {
                project_id: projectId,
            })
            .then((data: any) => {
                const res = data?.getProjectFiles?.filter(
                    (file: any) =>
                        file?.file_type == "CONTRACTOR_COMPANY_DOCS" &&
                        file?.tags?.org_id == organization_id,
                );
                setUploadedFiles(res);
            })
            .catch((error: any) => {
                console.error(error);
                setErrorDescription("System is failed to fetch uploaded files Please try again");
            });
    }, [projectId, open, organization_id]);
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        if (errorDescription) {
            enqueueSnackbar("", {
                action: (
                    <BaseSnackbar variant="error" title="error" description={errorDescription} />
                ),
            });
            setTimeout(() => {
                setErrorDescription(undefined);
            }, 2000);
        }
        //eslint-disable-next-line
    }, [errorDescription]);
    const onFileUpload = (files: any) => {
        if (files?.length > 0) {
            const newFiles: any = [...files]?.map((obj: any) => {
                return {
                    file_name: obj?.name,
                    file_type: "CONTRACTOR_COMPANY_DOCS",
                    tags: {
                        org_id: organization_id,
                        uploaded_on: moment(new Date()).format("MM/DD/YYYY hh:mm a"),
                        fileSize: obj?.size,
                    },
                };
            });
            setNewFilesToUpload(newFilesToUpload ? [...newFilesToUpload, ...newFiles] : newFiles);
            setDocs(docs ? [...docs, [...files]] : [...files]);
            const allFiles = uploadedFiles?.length > 0 ? [...uploadedFiles, ...newFiles] : newFiles;

            setUploadedFiles(allFiles);

            let uploadedFilesSize = allFiles.reduce((total: any, obj: any) => {
                return total + obj?.tags?.fileSize / 1e6;
            }, 0);
            setIsFileSizeOver(uploadedFilesSize > 5);
        }
    };
    const mngDelete = (file: any) => {
        if (file?.id) {
            graphQLClient
                .mutate("deleteProjectFile", DELETE_PROJECT_FILES, {
                    input: {
                        file_id: file?.id,
                        user_id,
                    },
                })
                .then(() => {
                    setIsFileDeleted(true);
                })
                .catch((error: any) => {
                    setIsFileDeleted(false);
                    setErrorDescription("Server is unable to delete the file");
                    console.error(error);
                });
        }
        if ((uploadedFiles?.length > 0 && isFileDeleted) || file.file_name) {
            const availableFiles = uploadedFiles.filter((obj: any) => {
                if (file?.id && obj.id != file?.id) {
                    return obj;
                } else if (file?.file_name && obj.file_name != file?.file_name) {
                    return obj;
                }
            });
            const fileSize = [...availableFiles].reduce((total: any, file: any) => {
                return total + file?.tags?.fileSize / 1e6;
            }, 0);
            setUploadedFiles(availableFiles);
            setIsFileSizeOver(fileSize > 5);
            if (file?.file_name) {
                const filesLeft = newFilesToUpload.filter(
                    (newFl: any) => newFl?.file_name !== file?.file_name,
                );
                const docsLeft = docs.filter((doc: any) => doc?.name !== file?.file_name);
                setNewFilesToUpload(filesLeft);
                setDocs(docsLeft);
            }
            setIsFileDeleted(false);
        }
    };

    const handleOnSave = () => {
        try {
            if (!isFileSizeOver && newFilesToUpload?.length > 0) {
                dispatch(
                    actions.fileUtility.createProjectFilesStart({
                        input: {
                            project_id: projectId,
                            files: newFilesToUpload,
                            user_id: user_id ?? "",
                        },
                        files: docs,
                    }),
                );
                setNewFilesToUpload(null);
                setDocs(null);
            }
            setOpen(false);
        } catch (error) {
            console.log(error);
        }
    };
    const uploadedFilesDetails = {
        uploadedFiles,
        mngDelete,
        IsSubmitted,
    };
    if (IsFileLoading) {
        return (
            <CommonDialog
                open={IsFileLoading}
                onClose={() => {}}
                loading={IsFileLoading}
                loaderText={"Saving..."}
                width="40rem"
                minHeight="26rem"
            />
        );
    }
    return (
        <>
            <BaseButton
                label={IsSubmitted ? "Company info" : "Upload Company info"}
                onClick={() => {
                    setOpen(true);
                }}
                sx={{
                    color: "#004D71",
                    border: "1px solid #004D71",
                    "&:hover": {
                        backgroundColor: "#909090",
                        color: "#FFF",
                        border: "none",
                    },
                    width: "12rem",
                    height: "2.5rem",
                    // display: projectFiles?.length === 0 && "none",
                    display: "flex",
                }}
            />
            <Dialog open={open} fullWidth maxWidth={"md"}>
                <DialogTitle>
                    <Grid container>
                        <Grid item sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                                variant="text_18_medium"
                                fontFamily={"roboto"}
                                marginLeft={"1.5rem"}
                            >
                                Tell us about your company
                            </Typography>
                        </Grid>
                        <Grid item sx={{ display: "flex", justifyContent: "flex-end" }} xs>
                            <IconButton
                                sx={{ padding: 0, borderRadius: "0 0 0 0" }}
                                onClick={() => {
                                    setIsFileSizeOver(false);
                                    setNewFilesToUpload(null);
                                    setDocs(null);
                                    setOpen(false);
                                }}
                            >
                                <CloseIcon fontSize="large" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container sx={{ padding: "0rem 1.5rem 0rem 1.5rem" }}>
                        <Grid item>
                            <Typography variant="text_14_medium">Upload Files</Typography>
                        </Grid>
                        <Grid item sx={{ marginTop: "9px", marginBottom: "28px" }}>
                            <Typography variant="text_14_regular" color={"#757575"}>
                                {`There's more to a bid than just numbers. Please provide information that gives
                    insight into your company's performance and reputation.`}
                            </Typography>
                        </Grid>
                        <Grid item width="100%">
                            {!IsSubmitted && (
                                <FileUpload
                                    isMultiple
                                    onFileChange={onFileUpload}
                                    helperText=""
                                    lable="Click area to upload"
                                />
                            )}
                            <Typography
                                variant="text_12_light"
                                display={"flex"}
                                justifyContent={"flex-end"}
                            >
                                {"Maximum size: 5MB"}
                            </Typography>
                            {uploadedFiles?.length > 0 ? (
                                <UploadedFilesList {...uploadedFilesDetails} />
                            ) : (
                                false
                            )}
                        </Grid>
                        {isFileSizeOver ? (
                            <Grid item>
                                <Typography variant="text_12_medium" color={"red"}>
                                    {"Selected files size is more then 5 MB"}
                                </Typography>
                            </Grid>
                        ) : (
                            false
                        )}
                    </Grid>
                    <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />
                    <Grid container spacing={3} direction={"row"} paddingLeft={"1rem"}>
                        <Grid item>
                            <Button
                                onClick={() => {
                                    setIsFileSizeOver(false);
                                    setNewFilesToUpload(null);
                                    setDocs(null);
                                    setOpen(false);
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
                                onClick={handleOnSave}
                                sx={{
                                    backgroundColor: "#004D71",

                                    "&:hover": {
                                        backgroundColor: "#004D71",
                                        // color: "#ffff",
                                    },
                                }}
                                disabled={Boolean(
                                    isFileSizeOver || uploadedFiles?.length == 0 || IsSubmitted,
                                )}
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
export default UploadInfoPopup;
