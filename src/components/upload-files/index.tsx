/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { DragEvent } from "react";
import {
    DialogContentText,
    Box,
    Typography,
    // CircularProgress as Loader,
} from "@mui/material";
import AppTheme from "../../styles/theme";
import { StyledBox } from "./style";
import { ReactComponent as UploasIcon } from "../../assets/icons/upload-icon.svg";

interface IFileUpload {
    /* eslint-disable-next-line */
    isMultiple?: boolean;
    helperText?: String;
    onFileChange: any;
    acceptedFileTypes?: string[];
    containerWidth?: string;
    inputId?: string;
}

const FileUpload = ({
    isMultiple,
    helperText,
    onFileChange,
    acceptedFileTypes,
    containerWidth,
    inputId = "csvFileUpload",
}: IFileUpload) => {
    const onDrop = (e: DragEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            const validFiles = Array.from(e.dataTransfer.files).filter((file) =>
                acceptedFileTypes ? acceptedFileTypes.includes(file.type) : true,
            );
            onFileChange(validFiles);
        }
    };
    console.log("Accepted type-", acceptedFileTypes);
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
                id={inputId}
                type={"file"}
                style={{ display: "none" }}
                onChange={(e) => onFileChange(e.target.files)}
                accept={acceptedFileTypes?.join(",")}
            />
            <label htmlFor={inputId} style={{ cursor: "pointer" }}>
                <StyledBox
                    p={3}
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragEnter={onDragEnter}
                    style={{ width: containerWidth || "600px" }}
                >
                    <Box mt={6}>
                        <UploasIcon />
                    </Box>
                    <Box mt={4}>
                        <Typography variant="text_14_medium">
                            {`Drop your ${
                                isMultiple ? "files" : "file"
                            } here or click here to upload!`}
                        </Typography>
                        {helperText && (
                            <Box display="flex" justifyContent="center">
                                <Typography variant="text_14_regular" color={AppTheme.text.medium}>
                                    {helperText}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Box mt={3}>
                        <DialogContentText id="alert-dialog-description">
                            Upload only {acceptedFileTypes || "CSV"} Files*
                        </DialogContentText>
                    </Box>
                </StyledBox>
            </label>
        </Box>
    );
};

export default FileUpload;
