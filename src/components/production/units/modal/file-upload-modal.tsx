import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import FileUpload from "components/upload-files";
import { useMutation } from "@apollo/client";

import {
    CREATE_PROJECT_FILES,
    GET_PROJECT_FILE,
    MARK_FILE_UPLOADED,
} from "stores/projects/tpsm/tpsm-queries";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import loaderProgress from "assets/icons/blink-loader.gif";
import FileUploadStatus from "../file-upload-status";
import BaseTextArea from "components/text-area";
import theme from "styles/theme";
import { graphQLClient } from "utils/gql-client";
import { DELETE_FILE } from "components/production/constants";
import TrackerUtil from "utils/tracker";
import mixpanel from "mixpanel-browser";

interface IFileUploadModalProps {
    isModal: boolean;
    projectId: string;
    projectName: string;
    renoUnitId?: string;
    scopeId?: number;
    itemOrPricingGroupId?: number;
    handleClose: () => void;
    // eslint-disable-next-line no-unused-vars
    onAttachFilesAndNote: (fileIds: Array<string>, note: string) => void;
}

const FileUploadModal = ({
    isModal,
    handleClose,
    projectId,
    projectName,
    onAttachFilesAndNote,
}: IFileUploadModalProps) => {
    const [createProjectFiles] = useMutation(CREATE_PROJECT_FILES);
    const [markFileUploaded] = useMutation(MARK_FILE_UPLOADED);
    const [deleteProjectFile] = useMutation(DELETE_FILE);
    const [uploadedFiles, setUploadedFiles] = useState<Array<any>>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [note, setNote] = useState("");

    const user_id = localStorage.getItem("user_id");
    const { enqueueSnackbar } = useSnackbar();

    const uploadFile = (file: File, signedUrl: string) => {
        const options = {
            method: "PUT",
            body: file,
        };
        mixpanel.time_event("FILE_UPLOAD");
        return fetch(signedUrl, options).then((uploadResponse) => {
            if (!uploadResponse.ok) {
                throw new Error(`Upload failed: ${uploadResponse.statusText}`);
            } else {
                mixpanel.track("FILE_UPLOAD", {
                    fileSizeInMB: (file?.size / (1024 * 1024)).toFixed(3),
                    extension: file?.name,
                    projectName,
                });
            }
        });
    };

    useEffect(() => {
        if (!isModal) {
            setUploadedFiles([]);
            setNote("");
        }
    }, [isModal]);

    const allowedFileTypes = [
        "image/jpeg",
        "image/png",
        "text/csv",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const maxFileSize = 1024 * 1024 * 5; // 5MB in bytes

    const getErrorMsg = (file: File) => {
        let errorMsg = "";
        if (!allowedFileTypes.includes(file.type)) {
            errorMsg = "Invalid file type";
        } else if (file.size > maxFileSize) {
            errorMsg = "File size is too large (Max: 5MB)";
        }
        return errorMsg;
    };

    const fetchFileById = (fileId: string) => {
        return graphQLClient.query("GetProjectFile", GET_PROJECT_FILE, {
            fileId,
        });
    };

    const getFileObject = (file: any, files: Array<any>): any => {
        const resultFile = files?.find((f) => f.fileObject.name == file.file_name);
        return resultFile?.fileObject;
    };

    const onFileUpload = async (selectedFiles: FileList): Promise<void> => {
        TrackerUtil.event("FILE_PICKED", { projectName });
        try {
            if (selectedFiles?.length > 0) {
                setLoading(true);
                // setFiles(files);
                const files = Array.from(selectedFiles).map((file, index) => ({
                    uploadedFileDetail: undefined,
                    fileObject: file,
                    index: uploadedFiles?.length + index,
                    error: getErrorMsg(file),
                }));

                const nonErroredFiles = files.filter((f) => !f.error);
                const input = {
                    files: nonErroredFiles.map((file: any) => ({
                        file_name: file.fileObject?.name,
                        file_type: "TBP_CHANGE_REQUEST",
                        tags: null,
                    })),
                    project_id: projectId,
                    user_id,
                    // prefix: itemOrPricingGroupId
                    //     ? `project_spec/approval-request-files/${projectId}/${renoUnitId}/${scopeId}/${itemOrPricingGroupId}`
                    //     : `project_spec/approval-request-files/${projectId}/${renoUnitId}/${scopeId}`,
                };
                const { data } = await createProjectFiles({ variables: { input } });

                const alreadyUploadedFiles = uploadedFiles || [];
                const errorFiles = files.filter((f) => f.error) || [];
                const filesToUpload = data.createProjectFiles?.map((f: any) => ({
                    uploadedFileDetail: { ...f },
                    loading: true,
                    fileObject: getFileObject(f, nonErroredFiles),
                }));

                setUploadedFiles([...alreadyUploadedFiles, ...errorFiles, ...filesToUpload]);
                setLoading(false);

                const promises = filesToUpload?.map((fileToUpload: any) => {
                    const { fileObject, uploadedFileDetail } = fileToUpload;
                    return uploadFile(fileObject, uploadedFileDetail?.signed_url);
                });

                if (promises && promises.length > 0) {
                    Promise.allSettled(promises).then((responses) => {
                        const updatedListAfterUpload = filesToUpload?.map(
                            async (file: any, index: number) => {
                                const updatedFile = { ...file, loading: false };
                                if (responses[index].status === "fulfilled") {
                                    await markFileUploaded({
                                        variables: { fileId: file?.uploadedFileDetail?.id },
                                    });
                                    const result = await fetchFileById(
                                        file?.uploadedFileDetail?.id,
                                    );
                                    updatedFile.uploadedFileDetail = { ...result?.getProjectFile };
                                } else {
                                    //@ts-ignore
                                    const value = responses[index].reason;
                                    updatedFile.error = `Upload failed: ${value}`;
                                }
                                return updatedFile;
                            },
                        );

                        Promise.allSettled(updatedListAfterUpload).then((responses) => {
                            //@ts-ignore
                            const fileList = responses?.map((response) => response?.value);
                            setUploadedFiles([...alreadyUploadedFiles, ...errorFiles, ...fileList]);

                            const filesWithErrorOnUpload = fileList?.filter((file) => !!file.error);
                            const successfullyUploadedFiles = fileList?.filter(
                                (file) => !file.error,
                            );
                            if (filesWithErrorOnUpload?.length > 0) {
                                TrackerUtil.event("FILE_UPLOAD_FAILED", { projectName });
                            }
                            if (successfullyUploadedFiles?.length > 0) {
                                TrackerUtil.event("FILE_UPLOAD_SUCCESS", { projectName });
                            }
                        });
                    });
                }
            }
        } catch (error) {
            console.log(error);
            TrackerUtil.error(
                error,
                {
                    projectName,
                },
                "FILE_UPLOAD_FAILED",
            );
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title={`Upload failed: ${error}`} />,
            });
        } finally {
            setLoading(false);
        }
    };

    const shouldSaveDisable = (): boolean => {
        const isErrorOrLoading = uploadedFiles?.filter((f) => f.error || f.loading)?.length > 0;
        return isErrorOrLoading;
    };

    const onDeleteUploadedFile = (index: number, fileId: string) => {
        if (fileId) {
            setLoading(true);
            deleteProjectFile({
                variables: {
                    input: {
                        file_id: fileId,
                        user_id,
                    },
                },
            })
                .then(() =>
                    setUploadedFiles(
                        uploadedFiles?.filter((f) => f.uploadedFileDetail?.id !== fileId),
                    ),
                )
                .finally(() => setLoading(false));
        } else if (index) {
            setUploadedFiles(uploadedFiles?.filter((f) => f.index !== index));
        }
    };

    return (
        <Dialog
            open={isModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="file-upload-modal"
        >
            <DialogTitle mb={1}>
                <Typography variant="text_18_semibold">Add Notes / Attachments</Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container flexDirection="column" gap={5}>
                    <Grid item>
                        <Typography variant="text_14_medium">Add Notes</Typography>
                        <BaseTextArea
                            style={{ width: "100%", minHeight: "6em" }}
                            onChange={(e: any) => setNote(e.target.value)}
                            value={note}
                        />
                    </Grid>
                    <Grid item>
                        <Typography variant="text_14_medium" style={{ display: "block" }}>
                            Upload Files or Photos
                        </Typography>
                        <Typography
                            variant="text_14_regular"
                            color={theme.text.medium}
                            marginTop={2}
                            marginBottom={2}
                            style={{ display: "block" }}
                        >
                            Add photos or files to track your progress over time and share it with
                            other stakeholders
                        </Typography>
                        <FileUpload
                            acceptedFileTypes={[".jpg", ".png", ".jpeg", ".csv", ".pdf", ".xlsx"]}
                            isMultiple
                            helperText="Accepts .csv, .xlsx, .jpg, .jpeg, .png and .pdf only"
                            onFileChange={onFileUpload}
                            containerWidth="auto"
                        />
                        {isLoading ? (
                            <Box
                                height={150}
                                alignItems="center"
                                display={"flex"}
                                justifyContent="center"
                            >
                                <img
                                    src={loaderProgress}
                                    alt="file-status"
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                    }}
                                />
                            </Box>
                        ) : (
                            <FileUploadStatus
                                files={uploadedFiles}
                                onDeleteUploadedFile={onDeleteUploadedFile}
                                titleText="Uploaded Files"
                                containerMargin
                                projectName={projectName}
                            />
                        )}
                    </Grid>
                    <Grid item container display="flex" justifyContent="flex-end" gap={4}>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={handleClose}>
                                <Typography variant="text_14_regular">Cancel</Typography>
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isLoading || shouldSaveDisable()}
                                onClick={() =>
                                    onAttachFilesAndNote(
                                        uploadedFiles.map((f) => f?.uploadedFileDetail?.id),
                                        note,
                                    )
                                }
                            >
                                <Typography variant="text_14_regular">Apply</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default FileUploadModal;
