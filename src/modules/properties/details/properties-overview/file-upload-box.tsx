import React, { useEffect, useState } from "react";
import { Box, Grid, CircularProgress, Paper, Typography } from "@mui/material";
import "./projects-overview.css";
import { useSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "../../../../stores/hooks";
import actions from "../../../../stores/actions";
import { filter, find, isEmpty, includes } from "lodash";
// import { useParams } from "react-router-dom";
// import { FILE_TYPE } from "../../../projects/constant";
import FileUpload from "../../../../components/upload-files";
import BaseSnackbar from "../../../../components/base-snackbar";
import { graphQLClient } from "../../../../utils/gql-client";
import { GET_CDN_PROJECT_FILES } from "stores/single-project/queries";
// import { useMutation } from "@apollo/client/react/hooks/useMutation";
import {
    CREATE_PROJECT_FILES,
    MARK_FILE_UPLOADED,
} from "stores/projects/file-utility/file-utility-queries";
interface IFileUploadModal {
    /* eslint-disable-next-line */
    file_type: string;
    projectId: string;
}

const FileUploadBox = ({ file_type, projectId }: IFileUploadModal) => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [, setFiles] = useState<FileList | null>(null);
    const { uploadedFiles } = useAppSelector((state) => {
        return {
            uploadedFiles: state.projectOverview.uploadFileDetails.uploadDetails,
        };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchCoverPhotos = async () => {
        const res = await graphQLClient.query("GetProjectFile", GET_CDN_PROJECT_FILES, {
            project_id: projectId,
            file_type: file_type,
        });
        setCoverImages(res.getProjectFiles);
        return;
    };
    const [cover_images, setCoverImages] = useState<any[]>([]);
    const user_id = localStorage.getItem("user_id");
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        console.log("dsahdjkas");
        fetchCoverPhotos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const uploadToS3 = (files: any) => {
        let filesToBeUpload;
        let parseFileType = true;
        let fileTypeCloned = ["image/jpg", "image/png", "image/jpeg", "image/webp"];
        filesToBeUpload = filter(files, (file) => {
            const fileType = includes(fileTypeCloned, file.type);
            if (!fileType) {
                parseFileType = fileType;
            }
            return !find(uploadedFiles, { name: file.name });
        });
        if (!parseFileType) {
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title="Unpported file Type" />,
            });

            return false;
        }

        if (!isEmpty(uploadedFiles)) {
            if (isEmpty(filesToBeUpload)) {
                return false;
            }
        }
        createDataSource(filesToBeUpload);
    };

    const onFileUpload = (files: any) => {
        uploadToS3(files);
    };

    const uploadFile = async (file: File, signedUrl: string) => {
        console.log("upload files", file);
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
    const createDataSource = async (files: any) => {
        setLoading(true);
        try {
            const input = {
                files: files.map((file: any) => ({
                    file_name: file.name,
                    file_type: file_type,
                    tags: { content_type: file.type },
                })),
                project_id: projectId,
                prefix: "cover_image",
                user_id,
            };
            const res = await graphQLClient.mutate("createProjectFiles", CREATE_PROJECT_FILES, {
                input: input,
            });

            const { signed_url, id: fileId } = res[0];
            await uploadFile(files[0], signed_url);
            const data = { file_id: fileId };
            console.log("data", data);
            await graphQLClient.mutate("markFileUploaded", MARK_FILE_UPLOADED, data);
            await fetchCoverPhotos();
            setLoading(false);
        } catch (error) {
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title="Could not upload files." />,
            });
            dispatch(actions.projectOverview.createDataSourceFail(error));
            setLoading(false);
        }
    };
    const CirCularLoader = () => {
        return (
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress color="primary" />
            </div>
        );
    };
    console.log("isLoading", isLoading);

    return (
        <Box mx={6} my={3} className="Projects-overview">
            <Paper elevation={3} style={{ padding: "10px" }}>
                <Typography
                    variant="text_18_semibold"
                    style={{ marginTop: "2rem", marginLeft: "1.5rem" }}
                >
                    Upload Cover Picture
                </Typography>
                <Box mx={6} mt={4} className="Projects-overview" mb={"1rem"}>
                    <Grid container spacing={3} rowGap={20} columnGap={20}></Grid>
                    <Box mt={3} id="upload-area" style={{ position: "relative" }}>
                        {isLoading && CirCularLoader()}
                        <FileUpload
                            isMultiple={false}
                            acceptedFileTypes={[".jpg", ".png", ".jpeg", ".webp"]}
                            helperText="Accepts .png, .jpg, .jpeg and .webp only"
                            onFileChange={onFileUpload}
                            containerWidth="auto"
                        />
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: "20px",
                                gridAutoRows: "200px",
                                marginTop: "1rem",
                            }}
                        >
                            {cover_images &&
                                cover_images.length > 0 &&
                                cover_images.map((cover_image) => (
                                    <img
                                        key={cover_image.id}
                                        src={cover_image.cdn_path[4]}
                                        alt="property-asset"
                                        style={{ width: "100%", height: "100%", borderRadius: 15 }}
                                    />
                                ))}
                        </div>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default FileUploadBox;
