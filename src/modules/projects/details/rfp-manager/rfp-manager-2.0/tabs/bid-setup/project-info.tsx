import { Grid, IconButton, Paper, Typography } from "@mui/material";
import Button from "components/button";
import BaseTextField from "components/text-field";
import FileUpload from "components/upload-files-new";
import { find } from "lodash";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import loaderProgress from "../../../../../../../assets/icons/blink-loader.gif";
import Badge from "../../../../../../../assets/icons/badge.svg";
import { IFileDetails } from "stores/projects/file-utility/file-utility-models";

interface ProjectInfoProps {
    activeStep: any;
    setActiveStep: any;
    projectDetails: any;
    organization: any;
    allUsers: any;
    projectImageFiles: any[];
    setIsBidSetup: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectInfo = ({
    activeStep,
    setActiveStep,
    projectDetails,
    organization,
    allUsers,
    projectImageFiles,
    setIsBidSetup,
}: ProjectInfoProps) => {
    const [projectData, setProjectData] = useState<any>();
    const [projectCoverPhoto, setProjectCoverPhoto] = useState<any[]>([]);
    const [otherProjectPhotos, setOtherProjectPhotos] = useState<any[]>([]);

    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state: any) => {
        return {
            loading: state?.fileUtility?.loading,
        };
    });

    const [coverPhotoLoader, setCoverPhotoLoader] = useState<boolean>(loading);
    const [otherPhotosLoader, setOtherPhotosLoader] = useState<boolean>(loading);

    useEffect(() => {
        const coverImageIdx = projectImageFiles?.findIndex((image) => image?.tags?.is_cover_image);

        if (coverImageIdx > -1)
            setProjectCoverPhoto([{ ...projectImageFiles[coverImageIdx], index: coverImageIdx }]);
        setCoverPhotoLoader(false);

        const otherImages = projectImageFiles?.filter((image) => !image?.tags?.is_cover_image);

        setOtherProjectPhotos(otherImages ?? []);
        setOtherPhotosLoader(false);
    }, [projectImageFiles]);

    const { projectId } = useParams();
    const user_id = localStorage.getItem("user_id");
    const uploadToS3 = (files: any, isCoverPhoto = false) => {
        const images = [...files]?.map((file: { name: string }) => ({
            file_name: file.name,
            file_type: "PROJECT_IMAGE",
            tags: {
                is_cover_image: isCoverPhoto,
                projectId,
            },
        }));
        dispatch(
            actions.fileUtility.createProjectFilesStart({
                input: {
                    project_id: projectId,
                    user_id: "",
                    files: images,
                },
                files: [...files],
            }),
        );
    };

    const DeleteFile = async (file: IFileDetails) => {
        try {
            dispatch(
                actions.fileUtility.DeleteFilesStart({
                    project_id: projectId,
                    files: [file],
                    user_id: user_id,
                }),
            );
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setProjectData(projectDetails);
    }, [projectDetails]);

    useEffect(() => {
        if (projectImageFiles?.length === 0) {
            setIsBidSetup(false);
        }
        // eslint-disable-next-line
    }, [projectImageFiles]);

    return (
        <Paper elevation={3} sx={{ padding: "24px" }}>
            <Grid container rowSpacing={3} columnSpacing={4}>
                <Grid item xs={4}>
                    <BaseTextField
                        fullWidth
                        label={"Ownership Group"}
                        variant={"outlined"}
                        value={
                            find(organization, {
                                id: projectData?.ownershipGroupId,
                            })?.name ?? null
                        }
                        disabled
                        classes="disabled"
                        size="small"
                    />
                </Grid>
                <Grid item xs={4}>
                    <BaseTextField
                        fullWidth
                        label={"Project Name"}
                        variant={"outlined"}
                        value={projectData?.name}
                        size="small"
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <BaseTextField
                        fullWidth
                        label={"Project Type"}
                        variant={"outlined"}
                        value={projectData?.projectType}
                        size="small"
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={12}>
                    <BaseTextField
                        fullWidth
                        label={"Street Address"}
                        variant={"outlined"}
                        value={projectData?.streetAddress}
                        size="small"
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={3}>
                    <BaseTextField
                        fullWidth
                        label={"City"}
                        variant={"outlined"}
                        value={projectData?.city}
                        size="small"
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={3}>
                    <BaseTextField
                        fullWidth
                        label={"State"}
                        variant={"outlined"}
                        value={projectData?.state}
                        size="small"
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={3}>
                    <BaseTextField
                        fullWidth
                        label={"Zip Code"}
                        variant={"outlined"}
                        value={projectData?.zipcode}
                        size="small"
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={3}>
                    <BaseTextField
                        fullWidth
                        label={"Property URL"}
                        variant={"outlined"}
                        value={projectData?.propertyUrl}
                        size="small"
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={6}>
                    <BaseTextField
                        fullWidth
                        label={"Property Type"}
                        variant={"outlined"}
                        value={projectData?.propertyType}
                        size="small"
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={6}>
                    <BaseTextField
                        fullWidth
                        label={"User"}
                        variant={"outlined"}
                        value={
                            find(allUsers, {
                                id: projectData?.userId,
                            })?.name ?? null
                        }
                        size="small"
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="text_16_semibold" sx={{ color: "#232323" }}>
                        Project cover photo
                    </Typography>
                </Grid>
                {projectCoverPhoto?.length === 0 && (
                    <Grid item xs={12} sx={{ paddingBottom: 0 }}>
                        <FileUpload
                            uploaderId="cover"
                            accept=".jpg, .jpeg, .png"
                            onFileChange={(file: any) => {
                                setCoverPhotoLoader(true);
                                uploadToS3(file, true);
                            }}
                            helperText="Accepts .jpg and .png only"
                        />
                    </Grid>
                )}
                <Grid item xs={12}>
                    {coverPhotoLoader ? (
                        <img
                            src={loaderProgress}
                            alt="file-status"
                            style={{
                                width: "44px",
                                height: "44px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        />
                    ) : (
                        <Grid container gap={4}>
                            {projectCoverPhoto?.map((file: any, index: number) => {
                                let url = file?.cdn_path?.filter((path: string) =>
                                    path?.includes("AUTOx80"),
                                )?.[0];
                                return (
                                    <Grid item key={index}>
                                        <IconButton
                                            sx={{
                                                position: "absolute",
                                                zIndex: 1,
                                                paddingLeft: "57px",
                                                "&:hover": {
                                                    backgroundColor: "transparent",
                                                },
                                            }}
                                            onClick={async () => {
                                                await DeleteFile(file);
                                                setProjectCoverPhoto([]);
                                            }}
                                        >
                                            <img src={Badge} alt="badge" />
                                        </IconButton>
                                        <img
                                            src={url}
                                            alt={"project"}
                                            width={80}
                                            height={80}
                                            style={{
                                                position: "relative",
                                                borderRadius: "8px",
                                                marginTop: "25px",
                                            }}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="text_16_semibold" sx={{ color: "#232323" }}>
                        {`Other project photos (${otherProjectPhotos?.length}) (optional)`}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ paddingBottom: 0 }}>
                    <FileUpload
                        uploaderId="other"
                        isMultiple={true}
                        accept=".jpg, .jpeg, .png"
                        onFileChange={(files: any) => {
                            setOtherPhotosLoader(true);
                            uploadToS3(files);
                        }}
                        helperText="Accepts .jpg and .png only"
                    />
                </Grid>
                <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="text_12_regular" color="#757575">
                        Upload at least one overall building photo
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {otherPhotosLoader ? (
                        <img
                            src={loaderProgress}
                            alt="file-status"
                            style={{
                                width: "44px",
                                height: "44px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        />
                    ) : (
                        <Grid container gap={4}>
                            {otherProjectPhotos?.map((file: any, index: number) => {
                                let url = file?.cdn_path?.filter((path: string) =>
                                    path?.includes("AUTOx80"),
                                )?.[0];
                                return (
                                    <Grid item key={index}>
                                        <IconButton
                                            sx={{
                                                position: "absolute",
                                                zIndex: 1,
                                                paddingLeft: "57px",
                                                "&:hover": {
                                                    backgroundColor: "transparent",
                                                },
                                            }}
                                            onClick={() => DeleteFile(file)}
                                        >
                                            <img src={Badge} alt="badge" />
                                        </IconButton>
                                        <img
                                            src={url}
                                            alt="project"
                                            width={80}
                                            height={80}
                                            style={{
                                                position: "relative",
                                                borderRadius: "8px",
                                                marginTop: "25px",
                                            }}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Button
                        classes={
                            projectCoverPhoto?.length > 0 ? "primary default" : "primary disabled"
                        }
                        onClick={() => setActiveStep(activeStep + 1)}
                        label="Next"
                        disabled={projectCoverPhoto?.length === 0}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ProjectInfo;
