/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { DragEvent } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { StyledBox } from "./style";
import { ReactComponent as UploadIcon } from "../../assets/icons/upload-icon-new.svg";

interface IFileUpload {
    /* eslint-disable-next-line */
    isMultiple?: boolean;
    onFileChange: any;
    helperText?: string;
    [v: string]: any;
    accept?: string;
    sizeLimitText?: string;
    showsizeLimit?: boolean;
    uploaderId?: string;
    showAsGrid?: boolean;
    lable?: string;
}

const FileUpload = ({
    isMultiple,
    onFileChange,
    helperText,
    accept,
    showsizeLimit,
    sizeLimitText,
    uploaderId,
    showAsGrid,
    lable,
}: IFileUpload) => {
    const onDrop = (e: DragEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            onFileChange(e.dataTransfer.files);
        }
    };
    const onDragOver = (e: DragEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const onDragEnter = (e: DragEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
    };
    return (
        <Box>
            <input
                multiple={isMultiple ? true : false}
                id={uploaderId ?? "imageFileUpload"}
                type={"file"}
                style={{ display: "none" }}
                onChange={(e) => onFileChange(e.target.files)}
                accept={accept && accept?.length > 0 ? accept : "*"}
            />
            <label htmlFor={uploaderId ?? "imageFileUpload"} style={{ cursor: "pointer" }}>
                {showAsGrid ? (
                    <StyledBox
                        p={3}
                        display={"grid"}
                        alignItems="center"
                        gridAutoFlow="column"
                        justifyContent={"center"}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragEnter={onDragEnter}
                        rowGap={"1rem"}
                    >
                        <Box>
                            <UploadIcon size={40} />
                        </Box>
                        <Grid display="grid" gridAutoFlow="row">
                            <Box>
                                <Typography variant="text_14_medium" color={"#757575"}>
                                    {lable ?? "Drop into or click area to upload"}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="center">
                                <Typography variant="text_12_regular" color={"#757575"}>
                                    {helperText}
                                </Typography>
                            </Box>
                        </Grid>
                    </StyledBox>
                ) : (
                    <StyledBox
                        p={3}
                        display={"flex"}
                        alignItems="center"
                        flexDirection="column"
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragEnter={onDragEnter}
                    >
                        <Box mt={6}>
                            <UploadIcon />
                        </Box>
                        <Box>
                            <Typography variant="text_14_medium" color={"#757575"}>
                                {lable ?? "Drop into or click area to upload"}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="center">
                            <Typography variant="text_12_regular" color={"#757575"}>
                                {helperText}
                            </Typography>
                        </Box>
                    </StyledBox>
                )}
            </label>
            {showsizeLimit && (
                <Typography
                    variant="text_12_regular"
                    color={"#757575"}
                    style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}
                >
                    {sizeLimitText}
                </Typography>
            )}
        </Box>
    );
};

export default FileUpload;
