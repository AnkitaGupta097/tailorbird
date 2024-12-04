import React from "react";
import { Box, Divider, Grid, Button, Typography } from "@mui/material";
import AppTheme from "../../../../../../styles/theme";
import { useAppDispatch } from "../../../../../../stores/hooks";
import { ReactComponent as BlankFile } from "../../../../../../assets/icons/blank-file-thumbs.svg";
import { ReactComponent as Revert } from "../../../../../../assets/icons/revert-icon.svg";
import { ReactComponent as Delete } from "../../../../../../assets/icons/delete.svg";
import loaderProgress from "../../../../../../assets/icons/blink-loader.gif";
import { isEmpty, map } from "lodash";
import Badge from "../../../../../../components/badge";
import actions from "../../../../../../stores/actions";
import { useParams } from "react-router-dom";
import "../../../projects-overview/projects-overview.css";

interface IFileUploadStatus {
    uploadedFiles: any;
}

const FileUploadStatus = ({ uploadedFiles }: IFileUploadStatus) => {
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const onReupload = (file: any) => {
        dispatch(
            actions.projectOverview.reS3UploadStart({
                fileContent: [
                    {
                        // @ts-ignore
                        position: file.position,
                        name: file.name, // @ts-ignore
                        remote_file_reference: null,
                        remark: null,
                        loading: true,
                    },
                ],
                filePath: `project_spec/rfp_package/${projectId}`,
                files: [file.data],
                isReupload: true,
            }),
        );
    };

    const onFileDelete = (index: string) => {
        dispatch(actions.projectOverview.deleteWrongFile(index));
    };

    if (isEmpty(uploadedFiles)) {
        return null;
    } else {
        return (
            <Box>
                <Box pt={6}>
                    <Typography variant="text_18_semibold">Upload Files</Typography>
                </Box>
                <Box style={{ overflowY: "auto", maxHeight: "320px" }} mt={2}>
                    {map(uploadedFiles, (file, index) => {
                        const { file_name, loading, error, validateFileName } = file;
                        return (
                            <React.Fragment>
                                <Grid container>
                                    <Grid
                                        item
                                        md={7}
                                        sx={{
                                            alignItem: "centre",
                                            display: "flex",
                                            paddingTop: "20px",
                                            paddingBottom: "20px",
                                        }}
                                    >
                                        <Box style={{ width: "36px", height: "36px" }}>
                                            <BlankFile />
                                        </Box>

                                        <Box pl={2} sx={{ display: "flex", alignItems: "center" }}>
                                            <span className="input-label">{file_name}</span>
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        md={5}
                                        sx={{
                                            alignItems: "center",
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        {loading ? (
                                            //@ts-ignore
                                            <>
                                                {validateFileName?.error ? (
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<Delete />}
                                                        style={{
                                                            height: "40px",
                                                            marginLeft: "10px",
                                                            marginRight: "10px",
                                                            color: AppTheme.text.dark,
                                                            backgroundColor:
                                                                AppTheme.palette.secondary.main,
                                                        }}
                                                        onClick={() => {
                                                            onFileDelete(index);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                ) : (
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
                                                )}
                                            </>
                                        ) : (
                                            <Box>
                                                {error ? (
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<Revert />}
                                                        style={{
                                                            height: "40px",
                                                            marginLeft: "10px",
                                                            marginRight: "10px",
                                                            color: AppTheme.text.dark,
                                                            backgroundColor:
                                                                AppTheme.palette.secondary.main,
                                                        }}
                                                        onClick={() => {
                                                            onReupload(file);
                                                        }}
                                                    >
                                                        Try again
                                                    </Button>
                                                ) : (
                                                    <Box
                                                        display={"flex"}
                                                        alignItems="center"
                                                        // @ts-ignore
                                                        aria-controls="account-menu"
                                                    >
                                                        <Box pr={2}>
                                                            <Badge label="Successfully uploaded" />
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>
                                        )}
                                    </Grid>
                                </Grid>
                                <Divider />
                            </React.Fragment>
                        );
                    })}
                </Box>
            </Box>
        );
    }
};

export default FileUploadStatus;
