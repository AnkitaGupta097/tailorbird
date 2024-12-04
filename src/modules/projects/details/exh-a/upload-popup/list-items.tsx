import {
    Box,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
} from "@mui/material";
import React from "react";
import { getFileIcon } from "../helper";
import AppTheme from "styles/theme";
import HumanReadableData from "components/human-readable-date";
import loaderProgress from "assets/icons/blink-loader.gif";
import deleteOutlined from "assets/icons/delete-outlined.svg";

interface ICustomListItems {
    uploadedFiles: any[];
    // eslint-disable-next-line no-unused-vars
    onDeleteUploadedFile: (index: number, fileId: string) => void;
}
export default function CustomListItems({ uploadedFiles, onDeleteUploadedFile }: ICustomListItems) {
    return (
        <Box height={"100px"} sx={{ overflowY: "scroll" }}>
            {uploadedFiles.map((file) => {
                const { uploadedFileDetail, index, loading, error, fileObject } = file;

                let errorText;
                if (error) {
                    errorText = error.split(" ").slice(0, 5);
                    errorText = errorText.join(" ");
                }
                return (
                    <ListItem
                        key={fileObject.name}
                        sx={{
                            marginBottom: "8px",
                            borderRadius: "8px",
                            padding: "0.75rem",
                        }}
                    >
                        <ListItemAvatar>{getFileIcon(fileObject.name)}</ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography
                                    variant="text_12_medium"
                                    color={"#232323"}
                                    sx={{ lineHeight: "16px" }}
                                >
                                    {fileObject.name}
                                </Typography>
                            }
                            secondary={
                                <>
                                    {!loading && !errorText ? (
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
                                                style={{
                                                    display: "inline",
                                                }}
                                                dateString={uploadedFileDetail?.uploaded_at}
                                            />
                                        </Typography>
                                    ) : (
                                        <Typography
                                            data-title={error}
                                            sx={{
                                                color: AppTheme.jobStatus.error.textColor,
                                            }}
                                            className="label-error"
                                        >
                                            {errorText}...
                                        </Typography>
                                    )}
                                </>
                            }
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        />
                        <ListItemSecondaryAction>
                            {!errorText && (
                                <>
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
                                        <Box sx={{ display: "flex" }} gap={"1rem"}>
                                            <p
                                                style={{
                                                    fontSize: "14px",
                                                    backgroundColor: "#DDF0F0",
                                                    color: "#57B6B2",
                                                    padding: "2px 8px",
                                                    borderRadius: "3.125rem",
                                                }}
                                            >
                                                Successfully uploaded
                                            </p>
                                            <IconButton
                                                onClick={() => {
                                                    onDeleteUploadedFile(
                                                        index,
                                                        uploadedFileDetail?.id,
                                                    );
                                                }}
                                            >
                                                <img alt="deleteOutlined" src={deleteOutlined} />
                                            </IconButton>
                                        </Box>
                                    )}
                                </>
                            )}
                        </ListItemSecondaryAction>
                    </ListItem>
                );
            })}
        </Box>
    );
}
