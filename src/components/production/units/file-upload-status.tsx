import React, { ReactNode } from "react";
import { Box, Divider, Grid, Typography, IconButton } from "@mui/material";
import AppTheme from "styles/theme";
import { ReactComponent as UploadFile } from "assets/icons/upload-file.svg";
import { ReactComponent as FileError } from "assets/icons/file-error.svg";
import { ReactComponent as FileImage } from "assets/icons/file-image.svg";
import { ReactComponent as FileXLS } from "assets/icons/file-xls.svg";
import { ReactComponent as FilePDF } from "assets/icons/file-pdf.svg";

import loaderProgress from "assets/icons/blink-loader.gif";
import { isEmpty, map } from "lodash";
import ClearIcon from "@mui/icons-material/Clear";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import HumanReadableData from "components/human-readable-date";
import { downloadFile } from "stores/single-project/operation";
import TrackerUtil from "utils/tracker";
import mixpanel from "mixpanel-browser";

interface IFileUploadStatusProps {
    files: Array<any>;
    readOnly?: boolean;
    titleText?: string;
    // eslint-disable-next-line no-unused-vars
    onDeleteUploadedFile?: (arg1: number, arg2: string) => void;
    containerMargin?: boolean;
    showBorder?: boolean;
    showDivider?: boolean;
    projectName?: string;
    containerStyle?: any;
}

const onDownloadUploadedFile = (
    downloadLink: string,
    name: string,
    fileId: string,
    projectName?: string,
) => {
    TrackerUtil.event("CLICKED_DOWNLOAD_FILE", {
        fileId,
        projectName,
    });
    mixpanel.time_event("FILE_DOWNLOAD");
    downloadFile(downloadLink, name, fileId, projectName).then(() =>
        mixpanel.track("FILE_DOWNLOAD", {
            fileId,
            projectName,
        }),
    );
};

const getIcon = (fileName: string, error: string): ReactNode => {
    if (error) {
        return <FileError />;
    }

    const parts = fileName.split(".");

    // Get the last part, which should be the file extension
    const extension = parts[parts.length - 1];

    switch (extension) {
        case "jpeg":
        case "jpg":
        case "png":
            return <FileImage />;
        case "csv":
            return <UploadFile />;
        case "xlsx":
            return <FileXLS />;
        case "pdf":
            return <FilePDF />;
    }
};

const FileUploadStatus = ({
    files,
    readOnly,
    onDeleteUploadedFile,
    titleText,
    containerMargin,
    showBorder,
    showDivider = true,
    projectName,
    containerStyle = {},
}: IFileUploadStatusProps) => {
    if (isEmpty(files)) {
        return null;
    } else {
        return (
            <Box>
                {titleText && (
                    <Box pt={6}>
                        <Typography variant="text_18_semibold">{titleText}</Typography>
                    </Box>
                )}
                <Box
                    style={{ overflowY: "auto", maxHeight: "200px", ...containerStyle }}
                    mt={containerMargin ? 2 : 0}
                >
                    {map(files, (file) => {
                        const { uploadedFileDetail, loading, error, index, fileObject } = file;
                        let errorText;
                        if (error) {
                            errorText = error.split(" ").slice(0, 5);
                            errorText = errorText.join(" ");
                        }

                        return (
                            <React.Fragment>
                                <Grid
                                    container
                                    alignItems="center"
                                    padding={3}
                                    justifyContent="space-between"
                                    style={
                                        showBorder
                                            ? {
                                                  border: `1px solid ${AppTheme.border.textarea}`,
                                                  background: AppTheme.common.white,
                                                  borderRadius: "4px",
                                              }
                                            : {}
                                    }
                                >
                                    <Grid
                                        item
                                        md={7}
                                        sx={{
                                            alignItems: "centre",
                                            display: "flex",
                                        }}
                                    >
                                        <Box style={{ width: "36px", height: "36px" }}>
                                            {getIcon(uploadedFileDetail?.file_name, error)}
                                        </Box>

                                        <Box pl={2}>
                                            <Typography variant="text_14_semibold" color="black">
                                                {uploadedFileDetail?.file_name || fileObject?.name}
                                            </Typography>

                                            {error ? (
                                                <Typography
                                                    data-title={error}
                                                    sx={{
                                                        color: AppTheme.jobStatus.error.textColor,
                                                    }}
                                                    className="label-error"
                                                >
                                                    {errorText}...
                                                </Typography>
                                            ) : (
                                                !loading && (
                                                    <Typography
                                                        variant="text_14_regular"
                                                        sx={{
                                                            display: "block",
                                                            width: "max-content",
                                                            color: AppTheme.icon.subdued,
                                                        }}
                                                    >
                                                        Uploaded on{" "}
                                                        <HumanReadableData
                                                            style={{ display: "inline" }}
                                                            dateString={
                                                                uploadedFileDetail?.uploaded_at
                                                            }
                                                        />
                                                    </Typography>
                                                )
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        sx={{
                                            alignItems: "center",
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        {loading ? (
                                            <img
                                                src={loaderProgress}
                                                alt="file-status"
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                }}
                                            />
                                        ) : (
                                            <Grid container gap={1} justifyContent="flex-end">
                                                {uploadedFileDetail?.download_link && (
                                                    <Grid item>
                                                        <IconButton
                                                            onClick={() =>
                                                                onDownloadUploadedFile(
                                                                    uploadedFileDetail?.download_link,
                                                                    uploadedFileDetail?.file_name,
                                                                    uploadedFileDetail?.id,
                                                                    projectName,
                                                                )
                                                            }
                                                        >
                                                            <FileDownloadIcon color="primary" />
                                                        </IconButton>
                                                    </Grid>
                                                )}
                                                {!readOnly && (
                                                    <Grid item>
                                                        <IconButton
                                                            onClick={() =>
                                                                onDeleteUploadedFile &&
                                                                onDeleteUploadedFile(
                                                                    index,
                                                                    uploadedFileDetail?.id,
                                                                )
                                                            }
                                                        >
                                                            <ClearIcon color="primary" />
                                                        </IconButton>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                                {showDivider && <Divider />}
                            </React.Fragment>
                        );
                    })}
                </Box>
            </Box>
        );
    }
};

export default FileUploadStatus;
