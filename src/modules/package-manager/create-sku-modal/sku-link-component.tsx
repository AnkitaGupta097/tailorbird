import { Grid, Stack, TextField, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { AddNewSKUModalConstants } from "../constants";
import { PrimaryButton } from "../common";
import { ISKULinkInputComponent } from "../interfaces";
import { ThumbnailUploaderDialog } from "../create-edit-package/package-selection/helper";
import BaseButton from "components/button";
import CloseIcon from "@mui/icons-material/Close";

const SKUlinkInputComponent: FC<ISKULinkInputComponent> = ({
    setInputs,
    dataFromLink,
    validation,
    link,
    setLink,
    handleLinkSubmit,
}) => {
    const helperTextstyles = {
        helper: {
            marginTop: "10px",
            marginLeft: "0px",
        },
    };
    const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
    const [manualThumbnailUrl, setManualThumbnailUrl] = useState<string>("");

    useEffect(() => {
        setInputs((prevInput) => ({
            ...prevInput,
            primary_thumbnail: manualThumbnailUrl,
        }));
        // eslint-disable-next-line
    }, [manualThumbnailUrl]);
    const thumbnailUploaderProps = {
        isImageUploaderOpen,
        setIsImageUploaderOpen,
        setManualThumbnailUrl,
    };
    return (
        <React.Fragment>
            <Grid item style={{ marginBottom: "1.875rem" }}>
                <Typography variant="subtitle2">{AddNewSKUModalConstants.CREATE_SKU}</Typography>
            </Grid>
            <Grid
                item
                style={{
                    marginBottom: "1.875rem",
                }}
            >
                <Typography>{AddNewSKUModalConstants.SCRAPE_FROM_LINK}</Typography>
            </Grid>
            <Grid item>
                <Grid
                    container
                    style={{
                        minHeight: "50px",
                        marginBottom: "1.875rem",
                    }}
                    direction="row"
                >
                    <Grid item xs>
                        <TextField
                            variant="outlined"
                            fullWidth
                            color={"primary"}
                            error={!!dataFromLink?.error || !!validation?.error}
                            helperText={
                                (!!dataFromLink?.error && dataFromLink?.errMsg) ||
                                (!!validation?.error && validation?.errorMsg)
                            }
                            FormHelperTextProps={{ style: helperTextstyles.helper }}
                            value={link}
                            onChange={(e) => setLink?.(e.target.value)}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        style={{
                            marginLeft: "1.5625rem",
                        }}
                    >
                        <PrimaryButton
                            variant="contained"
                            onClick={handleLinkSubmit}
                            disabled={manualThumbnailUrl?.length > 0}
                            sx={{
                                maxHeight: "56px",
                            }}
                        >
                            {AddNewSKUModalConstants.SCRAPE}
                        </PrimaryButton>
                    </Grid>
                </Grid>
            </Grid>
            {manualThumbnailUrl && manualThumbnailUrl?.length > 0 ? (
                <Grid item>
                    <Stack sx={{ display: "inline-block", position: "relative" }}>
                        <CloseIcon
                            fontSize="small"
                            onClick={() => {
                                setManualThumbnailUrl("");
                            }}
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                borderRadius: "50%",
                                backgroundColor: "rgba(100, 100, 100, 0.4)",
                                color: "#ffff",
                                ":hover": {
                                    cursor: "pointer",
                                    backgroundColor: "rgba(175, 175, 175, 0.8)",
                                },
                            }}
                        />
                        <img
                            src={manualThumbnailUrl}
                            alt="preview"
                            style={{ maxWidth: 100 }}
                            height="auto"
                        />
                    </Stack>
                </Grid>
            ) : (
                []
            )}
            <Grid item marginTop={"0.2rem"}>
                <BaseButton
                    classes={link?.length > 0 ? "primary disabled" : "primary default"}
                    disabled={link?.length > 0}
                    label={AddNewSKUModalConstants.UPLOAD_IMAGE_MANUALLY}
                    onClick={() => setIsImageUploaderOpen(true)}
                />
            </Grid>
            <ThumbnailUploaderDialog {...thumbnailUploaderProps} />
        </React.Fragment>
    );
};

export default SKUlinkInputComponent;
