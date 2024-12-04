import React, { useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import FileUpload from "components/upload-files";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import {
    CREATE_PROJECT_FILES,
    GET_PROJECT_FILE,
    MARK_FILE_UPLOADED,
    TRANSLATE_REVIT_FILE,
} from "stores/projects/tpsm/tpsm-queries";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import loaderProgress from "../../../../../assets/icons/blink-loader.gif";
import FileUploadStatus from "../../projects-overview/file-upload-status";

interface IFileUploadModalProps {
    isModal: boolean;
    handleClose: () => void;
    helperText: string;
    floorPlanId: string;
    revitData?: Record<string, string | boolean | null> | null;
}

const FileUploadModal = ({
    isModal,
    handleClose,
    helperText,
    floorPlanId,
}: IFileUploadModalProps) => {
    const [createProjectFiles] = useMutation(CREATE_PROJECT_FILES);
    const [markFileUploaded] = useMutation(MARK_FILE_UPLOADED);
    const [translateRevitFile] = useMutation(TRANSLATE_REVIT_FILE);
    const [, setFiles] = useState<FileList | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [fileId, setFileId] = useState<number | null>(null);
    useQuery(GET_PROJECT_FILE, {
        variables: { fileId },
        skip: !fileId,
    });
    const { projectId } = useParams();
    const user_id = localStorage.getItem("user_id");
    const { enqueueSnackbar } = useSnackbar();
    const client = useApolloClient();

    const uploadFile = async (file: File, signedUrl: string) => {
        const options = {
            method: "PUT",
            body: file,
        };
        const uploadResponse = await fetch(signedUrl, options);
        if (!uploadResponse.ok) {
            enqueueSnackbar("", {
                variant: "error",
                action: (
                    <BaseSnackbar
                        variant="error"
                        title={`Upload failed: ${uploadResponse.statusText}`}
                    />
                ),
            });
        }
        setFiles(null);
    };

    const onFileUpload = async (files: FileList): Promise<void> => {
        try {
            if (files) {
                setLoading(true);
                setFiles(files);
                const input = {
                    files: Array.from(files).map((file: { name: any }) => ({
                        file_name: file.name,
                        file_type: "RVT_FILE_DOCUMENT",
                        tags: null,
                    })),
                    project_id: projectId,
                    user_id,
                    prefix: `project_spec/revit-files/${projectId}/${floorPlanId}`,
                };
                const { data } = await createProjectFiles({ variables: { input } });
                const { signed_url, id: fileId } = data.createProjectFiles[0];

                await uploadFile(files[0], signed_url);
                await markFileUploaded({ variables: { fileId } });
                enqueueSnackbar("", {
                    variant: "success",
                    action: <BaseSnackbar variant="success" title={`Upload Successful`} />,
                });
                setLoading(false);
                if (fileId) {
                    setFileId(fileId);
                    const { data: projectFileData } = await client.query({
                        query: GET_PROJECT_FILE,
                        variables: { fileId },
                    });

                    const fileName = projectFileData.getProjectFile.file_name;
                    const filePath = projectFileData.getProjectFile.s3_file_path;
                    const input = {
                        floorplan_id: floorPlanId,
                        file_path: filePath,
                        file_name: fileName,
                        project_id: projectId,
                    };
                    if (fileName && filePath) {
                        await translateRevitFile({ variables: { input } });
                    }
                }
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title={`Upload failed: ${error}`} />,
            });
        } finally {
            setLoading(false);
            handleClose();
        }
    };

    return (
        <Dialog
            open={isModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="file-upload-modal"
        >
            <DialogTitle mb={1} align="center">
                <Typography variant="text_18_semibold">Upload Revit File</Typography>
            </DialogTitle>
            <DialogContent>
                <FileUpload
                    acceptedFileTypes={[".rvt"]}
                    isMultiple
                    helperText={helperText}
                    onFileChange={onFileUpload}
                />
                {isLoading ? (
                    <Box height={150} alignItems="center" display={"flex"} justifyContent="center">
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
                    <FileUploadStatus />
                )}
                <Box pb={1} pt={6} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ height: "41px", marginRight: "15px", width: "117px" }}
                        onClick={handleClose}
                    >
                        <Typography variant="text_14_regular">Close</Typography>
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default FileUploadModal;
