import React from "react";
import {
    Box,
    Divider,
    Grid,
    Link,
    Menu,
    Button,
    Typography,
    styled,
    IconButton,
} from "@mui/material";
import AppTheme from "../../../../styles/theme";
import { useAppSelector, useAppDispatch } from "../../../../stores/hooks";
import { ReactComponent as UploadFile } from "../../../../assets/icons/upload-file.svg";
import { ReactComponent as CommentFilled } from "../../../../assets/icons/comment-filled.svg";
import { ReactComponent as Comment } from "../../../../assets/icons/comment.svg";
import { ReactComponent as Revert } from "../../../../assets/icons/revert-icon.svg";
import { ReactComponent as CommentEmpty } from "../../../../assets/icons/empty-comment.svg";
import { ReactComponent as Delete } from "../../../../assets/icons/delete.svg";
import loaderProgress from "../../../../assets/icons/blink-loader.gif";
import { isEmpty, map, findIndex } from "lodash";
import Badge from "../../../../components/badge";
import BaseTextField from "../../../../components/text-field";
import actions from "../../../../stores/actions";
import { useParams } from "react-router-dom";
import "./projects-overview.css";
import ZipIcon from "@mui/icons-material/FolderZip";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const SInput = styled(BaseTextField)(({ theme }) => ({
    "& .MuiInputBase-input": {
        borderRadius: 5,
        border: "1px solid #CCCCCC",
        fontSize: 16,
        padding: "10px 14px",
        transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    },
}));

interface IFileDetails {
    position: number;
    name: string;
    remote_file_reference?: string;
    remark: any;
}

interface IProps {
    title?: string;
    isZip?: boolean;
    isRemark?: boolean;
}

const FileUploadStatus = ({ title, isZip, isRemark = true }: IProps) => {
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    // @ts-ignore
    const [fileDetails, setFileDetails] = React.useState<IFileDetails>({});
    const [commentText, setCommentText] = React.useState("");
    const { uploadedFiles } = useAppSelector((state) => {
        return {
            uploadedFiles: state.projectOverview.uploadFileDetails.uploadDetails,
            isUploaded: state.projectOverview.uploadFileDetails.loading,
        };
    });

    const handleMenuClick = (event: any, file: IFileDetails) => {
        setFileDetails(file);
        setAnchorEl(event.currentTarget);
    };

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
                filePath: `project_spec/datasource_files/${projectId}`,
                files: [file.data],
                isReupload: true,
            }),
        );
    };

    const onFileDelete = (index: string) => {
        dispatch(actions.projectOverview.deleteWrongFile(index));
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    const addRemark = () => {
        const fileIndex = findIndex(uploadedFiles, {
            remote_file_reference: fileDetails.remote_file_reference,
        });
        dispatch(actions.projectOverview.updateRemark({ fileIndex, remark: commentText }));
        handleMenuClose();
    };
    console.log(" iam in", uploadedFiles);
    if (isEmpty(uploadedFiles)) {
        return null;
    } else {
        return (
            <Box>
                <Box pt={6}>
                    <Typography variant="text_18_semibold">
                        {title ? title : "Upload Files"}
                    </Typography>
                </Box>
                <Box style={{ overflowY: "auto", maxHeight: "320px" }} mt={2}>
                    {map(uploadedFiles, (file, index) => {
                        console.log(" iam in");

                        const { name, remark, loading, error, validateFileName } = file;
                        let errorText;
                        if (validateFileName?.error) {
                            errorText = validateFileName?.error.split(" ").slice(0, 5);
                            errorText = errorText.join(" ");
                        }
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
                                            {isZip ? (
                                                <ZipIcon
                                                    fontSize="large"
                                                    sx={{ color: "#57B6B2" }}
                                                />
                                            ) : (
                                                <UploadFile />
                                            )}
                                        </Box>

                                        <Box pl={2}>
                                            <span className="input-label">{name}</span>

                                            {validateFileName?.error && (
                                                <Typography
                                                    data-title={validateFileName?.error}
                                                    sx={{
                                                        color: AppTheme.jobStatus.error.textColor,
                                                    }}
                                                    className="label-error"
                                                >
                                                    {errorText}...
                                                </Typography>
                                            )}
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
                                                            paddingTop: "20px",
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
                                                        {isRemark && (
                                                            <Link
                                                                color="inherit"
                                                                onClick={(e) =>
                                                                    handleMenuClick(e, file)
                                                                }
                                                            >
                                                                {remark ? (
                                                                    <CommentFilled
                                                                        style={{
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <CommentEmpty
                                                                        style={{
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                )}
                                                            </Link>
                                                        )}
                                                        {!isRemark && (
                                                            <IconButton
                                                                onClick={() => {
                                                                    onFileDelete(index);
                                                                }}
                                                            >
                                                                <DeleteOutlinedIcon />
                                                            </IconButton>
                                                        )}
                                                        <Menu
                                                            id="basic-menu"
                                                            anchorEl={anchorEl}
                                                            open={open}
                                                            onClose={handleMenuClose}
                                                            anchorOrigin={{
                                                                vertical: "top",
                                                                horizontal: "left",
                                                            }}
                                                            transformOrigin={{
                                                                vertical: "bottom",
                                                                horizontal: "right",
                                                            }}
                                                        >
                                                            <Grid
                                                                container
                                                                style={{
                                                                    alignItems: "center",
                                                                    padding: "20px",
                                                                    width: "500px",
                                                                }}
                                                            >
                                                                <Grid item md={1}>
                                                                    <Comment />
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    md={8}
                                                                    paddingLeft="10px"
                                                                >
                                                                    <SInput
                                                                        fullWidth
                                                                        value={fileDetails?.remark}
                                                                        inputProps={{
                                                                            "aria-label": "search",
                                                                        }}
                                                                        onChange={(e: any) => {
                                                                            e.stopPropagation();
                                                                            setFileDetails({
                                                                                ...fileDetails,
                                                                                remark: e.target
                                                                                    .value,
                                                                            });
                                                                            setCommentText(
                                                                                e.target.value,
                                                                            );
                                                                        }}
                                                                        placeholder="Add a comment"
                                                                    />
                                                                </Grid>
                                                                <Grid item md={3} paddingLeft={2}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            height: "43px",
                                                                            width: "100%",
                                                                        }}
                                                                        onClick={addRemark}
                                                                    >
                                                                        Save
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Menu>
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
