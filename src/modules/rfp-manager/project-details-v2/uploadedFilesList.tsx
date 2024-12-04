import { Box, Grid, IconButton, Link, Typography } from "@mui/material";
import React from "react";
import { ReactComponent as BlankFile } from "../../../assets/icons/blank-file-thumbs.svg";
import DeleteIcon from "@mui/icons-material/Delete";
import Badge from "components/badge";
import { graphQLClient } from "utils/gql-client";
import { GET_PROJECT_FILE } from "stores/projects/file-utility/file-utility-queries";
import { saveAs } from "file-saver";

// import {delete} from "../../../assets/icons/delete_blue_icon.svg";
const UploadedFilesList: any = ({ uploadedFiles, mngDelete, IsSubmitted }: any) => {
    const handleDelete = (file: any) => {
        mngDelete(file);
    };
    const handleDownload = (fileId: any) => {
        graphQLClient
            .query("GetProjectFile", GET_PROJECT_FILE, {
                fileId,
            })
            .then((file: any) => {
                saveAs(file?.getProjectFile?.download_link);
            })
            .catch((error: any) => {
                console.error(error);
            });
    };
    return (
        <Grid container marginTop={"10px"}>
            {uploadedFiles.map((obj: any, indx: any) => {
                const { file_name, is_active } = obj;

                return (
                    <Grid
                        container
                        key={indx}
                        spacing={3}
                        marginTop={"10px"}
                        alignContent={"center"}
                    >
                        <Grid item xs={1}>
                            <Box style={{ width: "36px", height: "36px" }}>
                                <BlankFile />
                            </Box>
                        </Grid>
                        <Grid item xs={5}>
                            <Box>
                                {obj?.id ? (
                                    <Link
                                        underline="none"
                                        onClick={() => {
                                            handleDownload(obj?.id);
                                        }}
                                        sx={{
                                            marginLeft: "0px",
                                            "&:hover": {
                                                textDecoration: "underline",
                                                cursor: "pointer",
                                            },
                                        }}
                                    >
                                        <Typography variant="text_12_medium">
                                            {file_name}
                                        </Typography>
                                    </Link>
                                ) : (
                                    <Typography variant="text_12_medium">{file_name}</Typography>
                                )}
                            </Box>
                            <Box>
                                <Typography variant="text_12_light" color={"#757575"}>
                                    {obj?.tags?.uploaded_on ?? ""}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={5}>
                            {is_active ? (
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
                            ) : (
                                false
                            )}
                        </Grid>
                        {!IsSubmitted && (
                            <Grid item display={"inline-grid"} alignContent={"center"}>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => {
                                        handleDelete(obj?.id ? { id: obj?.id } : { file_name });
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        )}
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default UploadedFilesList;
