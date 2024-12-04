import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import BaseDialog from "components/base-dialog";
import CloseIcon from "../../../../../assets/icons/cross-icon.svg";
import FileUpload from "components/upload-files";
import { useMutation } from "@apollo/client";
import {
    CREATE_PROJECT_FILES,
    GET_PROJECT_FILE,
    MARK_FILE_UPLOADED,
} from "stores/projects/tpsm/tpsm-queries";
import { DELETE_FILE } from "components/production/constants";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { graphQLClient } from "utils/gql-client";
import CustomListItems from "./list-items";

interface IUploadProjectDocPopupProps {
    isOpen: boolean;
    toggle: () => void;
    projectId: string;
}

const UploadProjectDocPopup = ({ isOpen, toggle, projectId }: IUploadProjectDocPopupProps) => {
    const [createProjectFiles] = useMutation(CREATE_PROJECT_FILES);
    const [markFileUploaded] = useMutation(MARK_FILE_UPLOADED);
    const [deleteProjectFile] = useMutation(DELETE_FILE);
    const [uploadedFiles, setUploadedFiles] = useState<Array<any>>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const user_id = localStorage.getItem("user_id");
    const { enqueueSnackbar } = useSnackbar();

    const uploadFile = async (file: File, signedUrl: string) => {
        const options = {
            method: "PUT",
            body: file,
        };
        return fetch(signedUrl, options).then((uploadResponse) => {
            if (!uploadResponse.ok) {
                throw new Error(`Upload failed: ${uploadResponse.statusText}`);
            }
        });
    };
    useEffect(() => {
        if (!isOpen) {
            setUploadedFiles([]);
        }
    }, [isOpen]);
    const maxFileSize = 1024 * 1024 * 10; // 10MB in bytes
    const allowedFileTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
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
    const onFileUpload = async (selectedFiles: FileList) => {
        try {
            if (selectedFiles?.length > 0) {
                setLoading(true);
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
                        file_type: "EXHIBIT_A_DOCUMENT",
                        tags: {
                            is_cover_image: false,
                            projectId,
                        },
                    })),
                    project_id: projectId,
                    user_id,
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
                        });
                    });
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
        }
    };
    const onSave = () => {
        toggle();
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
        <BaseDialog
            button={<Button variant="contained">Upload</Button>}
            content={
                <Box sx={{ display: "flex" }} flexDirection={"column"} width={"50rem"} p={1.25}>
                    <Box
                        sx={{ display: "flex" }}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Typography variant="text_16_medium">Upload SOW (Ex A)</Typography>
                        <Button onClick={toggle} sx={{ marginLeft: "auto" }}>
                            <img height={20} width={20} src={CloseIcon} alt="Close button" />
                        </Button>
                    </Box>
                    <Divider
                        flexItem
                        sx={{
                            width: "100%",
                            border: "1px solid #DEDEDE",
                            marginTop: ".5rem",
                        }}
                    />
                    <Box
                        sx={{ display: "flex" }}
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        py={"2.1rem"}
                    >
                        <FileUpload
                            acceptedFileTypes={[".docx", ".pdf"]}
                            isMultiple
                            helperText={"Upload only Docx or PDF Files*"}
                            onFileChange={onFileUpload}
                        />
                        {Boolean(uploadedFiles.length) && (
                            <Box width={"630px"} py={"1.2rem"}>
                                <Typography variant="text_14_semibold">
                                    {"Upload Process"}
                                </Typography>

                                <CustomListItems
                                    uploadedFiles={uploadedFiles}
                                    onDeleteUploadedFile={onDeleteUploadedFile}
                                />
                            </Box>
                        )}
                    </Box>
                    <Grid container justifyContent="flex-end" gap="1rem" py="1rem">
                        <Button onClick={toggle} variant="outlined">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={onSave} variant="contained">
                            Save
                        </Button>
                    </Grid>
                </Box>
            }
            open={isOpen}
            setOpen={toggle}
        />
    );
};

export default UploadProjectDocPopup;
