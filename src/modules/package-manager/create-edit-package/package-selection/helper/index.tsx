import React, { FC, useEffect, useState } from "react";
import { ICustomTypographyProps, IImageUploaderDialog, IThumbnailRenderer } from "./interfaces";
import {
    Avatar,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
} from "@mui/material";
import BaseButton from "components/button";
import FileUpload from "components/upload-files-new";
import { Edit } from "@mui/icons-material";
import { graphQLClient } from "utils/gql-client";
import { CREATE_S3_SIGNED_URL } from "stores/common/queries";
import CommonDialog from "modules/admin-portal/common/dialog";
import { UPDATE_MATERIAL_THUMBNAIL } from "../gql";

export const destructureMaterialData = (
    data: Record<string, any>,
): Array<ICustomTypographyProps> => [
    { property: "Category", value: data?.category },
    { property: "Subcategory", value: data?.subcategory },
    { property: "Manufacturer", value: data?.manufacturer },
    { property: "Model No.", value: data?.model_id },
    { property: "Supplier", value: data?.supplier },
    { property: "Supplier No.", value: data?.supplier_id },
    { property: "Description", value: data?.description },
    { property: "Grade", value: data?.grade },
    { property: "Style", value: data?.style },
    { property: "Finish", value: data?.finish },
];

export const OptionalTypographyRender: FC<ICustomTypographyProps> = ({ property, value }) =>
    value ? (
        <Typography variant="text_16_regular">
            <strong>{property}:</strong> {value}
        </Typography>
    ) : (
        <></>
    );

export const ThumbnailRenderer: FC<IThumbnailRenderer> = ({
    params,
    setActiveRow,
    setIsImageUploaderOpen,
}) => {
    const [isPreviewImgHovering, setIsPreviewImgHovering] = useState(false);
    const [thumbnailOpacity, setThumnailOpacity] = useState(1);

    return (
        <Box
            sx={{
                display: "inline-block",
                border: "0.5px solid rgb(223, 224, 235)",
                borderRadius: "4px",
                overflow: "hidden",
            }}
            onClick={() => {
                if (isPreviewImgHovering) {
                    setActiveRow(params?.row);
                    setIsImageUploaderOpen(true);
                }
            }}
        >
            <IconButton
                onMouseOver={() => {
                    setThumnailOpacity(0.5);
                    setIsPreviewImgHovering(true);
                }}
                onMouseLeave={() => {
                    setThumnailOpacity(1);
                    setIsPreviewImgHovering(false);
                }}
                sx={{
                    backgroundColor: "transparent",
                    transition: "transform .2s ease-in-out",
                    "&:hover": {
                        transform: "scale(1.2)",
                    },
                }}
                disableFocusRipple
                disableRipple
            >
                <Avatar
                    alt="thumbnail"
                    src={params?.value || "/image-placeholder.png"}
                    sx={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "4px",
                        opacity: thumbnailOpacity,
                    }}
                />
                {isPreviewImgHovering && <Edit style={{ position: "absolute" }} fontSize="small" />}
            </IconButton>
        </Box>
    );
};

export const ThumbnailUploaderDialog: FC<IImageUploaderDialog> = ({
    isImageUploaderOpen,
    setIsImageUploaderOpen,
    materialData,
    setActiveRow,
    setNewPackageMaterialsData,
    setManualThumbnailUrl,
}) => {
    const [previewImg, setPreviewImg] = useState<string | null>(null);
    const [uploadObj, setUploadObj] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [commonDialogMsg, setCommonDialogMsg] = useState("");

    useEffect(() => {
        return () => {
            setIsUploading(false);
            setPreviewImg(null);
            setUploadObj(null);
            setCommonDialogMsg("");
        };
    }, []);

    const fileChangeHandler = (file: any) => {
        setPreviewImg(URL.createObjectURL(file[0]));
        setUploadObj(file[0]);
    };

    const cancelHandler = () => {
        setIsImageUploaderOpen(false);
        setIsUploading(false);
        if (setActiveRow) setActiveRow({});
        setPreviewImg(null);
        setUploadObj(null);
        setCommonDialogMsg("");
    };

    const updateMaterialThumbnail = (id: string, imgLink: string) => {
        const payload = {
            input: {
                id,
                primary_thumbnail: imgLink,
            },
        };
        graphQLClient
            .mutate("updateMaterialThumbnail", UPDATE_MATERIAL_THUMBNAIL, payload)
            .then(() => {
                if (setNewPackageMaterialsData) {
                    setNewPackageMaterialsData((prevState) =>
                        prevState?.map((item) =>
                            item?.material_id === id || item?.labor_id === id
                                ? { ...item, primary_thumbnail: imgLink }
                                : item,
                        ),
                    );
                }
            })
            .catch((error: any) => {
                setIsError(true);
                setCommonDialogMsg(error?.message);
                console.error(error?.message);
            })
            .finally(() => {
                setTimeout(() => {
                    setIsUploading(false);
                    setIsError(false);
                    setIsImageUploaderOpen(false);
                    if (setActiveRow) setActiveRow({});
                    setPreviewImg(null);
                }, 2000);
            });
    };

    const uploadHandler = () => {
        setCommonDialogMsg("Uploading Image Please wait...");
        setIsUploading(true);

        const payload = {
            input: {
                file_names: uploadObj?.name,
                prefix_path: "images",
            },
        };

        graphQLClient
            .mutate("createS3SignedURL", CREATE_S3_SIGNED_URL, payload)
            .then(
                ({
                    0: { signed_url },
                }: {
                    file_name: string;
                    signed_url: string;
                }[]) =>
                    fetch(signed_url, {
                        method: "PUT",
                        body: uploadObj,
                    }).then((uploadedResponse) => {
                        if (uploadedResponse.ok) {
                            const { url } = uploadedResponse;
                            const imgLink = url?.split("?")[0];
                            if (setManualThumbnailUrl) {
                                setManualThumbnailUrl(imgLink);
                                setIsUploading(false);
                                setIsError(false);
                                setIsImageUploaderOpen(false);
                                setPreviewImg(null);
                            } else {
                                updateMaterialThumbnail(materialData?.id, imgLink);
                            }
                        } else {
                            setIsError(true);
                            throw new Error("image not uploaded");
                        }
                    }),
            )
            .catch((error: any) => {
                setCommonDialogMsg(error?.message);
                setIsError(true);
                console.error(error);
                setTimeout(() => {
                    setIsImageUploaderOpen(false);
                }, 3000);
            });
    };

    if (isUploading || isError)
        return (
            <CommonDialog
                open={isUploading || isError}
                error={isError}
                loading={isUploading}
                loaderText={commonDialogMsg}
                errorText={commonDialogMsg}
            />
        );

    return (
        <Dialog open={isImageUploaderOpen}>
            <DialogTitle>
                <Typography variant="text_18_bold" textAlign="center" mb="1rem">
                    Upload Image
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", minWidth: "30rem" }}>
                <Grid container direction="column" gap={1}>
                    {materialData && (
                        <Grid item sx={{ marginBottom: "1rem" }}>
                            <Typography>Details of Selected Material</Typography>
                        </Grid>
                    )}
                    {materialData &&
                        destructureMaterialData(materialData).map((props, idx) => (
                            <OptionalTypographyRender key={idx} {...props} />
                        ))}
                    <Grid item sx={{ marginTop: "1rem" }}>
                        {previewImg ? (
                            <Grid container direction="column">
                                <Typography variant="text_16_bold">Preview</Typography>
                                <img src={previewImg} alt="preview" width="auto" height={300} />
                            </Grid>
                        ) : (
                            <FileUpload
                                uploaderId="packge-material-thumbnail"
                                isMultiple={false}
                                onFileChange={fileChangeHandler}
                                helperText="Accepts .jpg and .png only"
                                accept=".jpg, .jpeg, .png"
                            />
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}>
                {previewImg && (
                    <BaseButton
                        onClick={() => {
                            setUploadObj(null);
                            setPreviewImg(null);
                        }}
                        label="Discard Image"
                        labelStyles={{ paddingY: ".4rem" }}
                        classes="error default"
                        variant="text_16_semibold"
                    />
                )}
                <BaseButton
                    onClick={cancelHandler}
                    label="Cancel"
                    labelStyles={{ paddingY: ".4rem" }}
                    classes="grey default"
                    variant="text_16_semibold"
                />
                {uploadObj && (
                    <BaseButton
                        onClick={uploadHandler}
                        label="Save"
                        labelStyles={{ paddingY: ".4rem" }}
                        classes="primary default"
                        variant="text_16_semibold"
                    />
                )}
            </DialogActions>
        </Dialog>
    );
};
