import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    Grid,
    Button,
    Typography,
    // CircularProgress as Loader,
} from "@mui/material";
// import { useParams } from "react-router-dom";
import FileUpload from "../../../../../components/upload-files";
import BaseButton from "../../../../../components/base-button";
import { ReactComponent as Revert } from "../../../../../assets/icons/revert-icon.svg";
import AppTheme from "../../../../../styles/theme";
import { ReactComponent as UploadFile } from "../../../../../assets/icons/upload-file.svg";
import { Rent_ROLL_FILE_TYPE } from "../../../constant";
import { includes, isEmpty } from "lodash";
import actions from "../../../../../stores/actions";
import moment from "moment";
import loaderProgress from "../../../../../assets/icons/blink-loader.gif";
import { ReactComponent as SuccessIcon } from "../../../../../assets/icons/success-icon.svg";
import { useAppDispatch, useAppSelector } from "../../../../../stores/hooks";
import { ReactComponent as ErrorIcon } from "../../../../../assets/icons/file-error.svg";

interface IRentRollModal {
    /* eslint-disable-next-line */
    isOpen: boolean;
    setColumnMap: any;
    handleClose: any;
}

const RentRollModal = ({ isOpen, handleClose, setColumnMap }: IRentRollModal) => {
    // const { propertyId } = useParams();
    const dispatch = useAppDispatch();

    const { rentRoll, projectDetails } = useAppSelector((state) => {
        return {
            rentRoll: state.projectOverview.rentRoll,
            projectDetails: state.propertyDetails.data,
        };
    });

    const { loading, error, s3Path } = rentRoll;
    const [file, setFile] = useState<any>(null);
    const [fileError, setFileError] = useState<any>({});

    useEffect(() => setFileError({ isBefore: false, msg: error.msg }), [error]);

    const onRentRollChange = (files: any) => {
        if (files.length > 0) {
            const file = files[0];
            setFile(file);
            const fileType = includes(Rent_ROLL_FILE_TYPE, file.type);
            if (!fileType) {
                dispatch(actions.projectOverview.rentRollFileInIt(""));
                setFileError({
                    isBefore: true,
                    msg: "Wrong file type. Upload only CSV / XLSX file.",
                });
                return false;
            } else {
                setFileError({ isBefore: false, msg: "" });
                dispatch(
                    actions.projectOverview.rentRollFileS3UploadStart({
                        file,
                        filePath: `project_spec/rent_rolls/${
                            projectDetails.projects.find((elm: any) => elm.type === "DEFAULT").id
                        }/${file.name}`,
                    }),
                );
            }
        }
    };

    const onSaveClick = () => {
        dispatch(
            actions.projectOverview.rentRollFileDbUploadStart({
                created_by: "",
                project_id: projectDetails.projects.find((elm: any) => elm.type === "DEFAULT").id,
                s3_file_path: s3Path,
            }),
        );
        setColumnMap();
        setFile(null);
        setFileError({});
        handleClose();
    };

    return (
        <Dialog
            open={isOpen}
            aria-labelledby="alert-dialog-title"
            onClose={handleClose}
            aria-describedby="alert-dialog-description"
            className="file-upload-modal"
        >
            <DialogTitle id="alert-dialog-title">
                <Typography variant="text_18_semibold">Upload Files</Typography>
            </DialogTitle>

            <DialogContent>
                <FileUpload
                    helperText="Upload only CSV / XLSX file*"
                    onFileChange={onRentRollChange}
                    acceptedFileTypes={Rent_ROLL_FILE_TYPE}
                    inputId="rent"
                />
                {file && (
                    <Grid container mt={9}>
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
                                {isEmpty(fileError.msg) ? <UploadFile /> : <ErrorIcon />}
                            </Box>

                            <Box pl={2}>
                                <Typography variant="text_14_semibold">{file?.name}</Typography>
                                <Box>
                                    <Typography
                                        // data-title={validateFileName?.error}
                                        sx={{
                                            color: isEmpty(fileError.msg)
                                                ? AppTheme.border.outer
                                                : AppTheme.jobStatus.error.textColor,
                                        }}
                                        variant="text_14_regular"
                                        className="label-error"
                                    >
                                        {isEmpty(fileError?.msg)
                                            ? moment(new Date()).format(`D MMM YYYY, [at] H:m A`)
                                            : fileError.msg}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        {!fileError.isBefore && (
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
                                    <img
                                        src={loaderProgress}
                                        alt="file-status"
                                        style={{
                                            width: "44px",
                                            height: "44px",
                                            paddingTop: "20px",
                                        }}
                                    />
                                ) : !isEmpty(error.msg) ? (
                                    <Button
                                        variant="contained"
                                        startIcon={<Revert />}
                                        style={{
                                            height: "40px",
                                            marginLeft: "10px",
                                            marginRight: "10px",
                                            color: AppTheme.text.dark,
                                            backgroundColor: AppTheme.palette.secondary.main,
                                        }}
                                        onClick={() => ""}
                                    >
                                        Try again
                                    </Button>
                                ) : (
                                    <SuccessIcon width="27" height="27" />
                                )}
                            </Grid>
                        )}
                    </Grid>
                )}
                <Box mb={3} mt={6} display="flex" justifyContent="flex-end">
                    <BaseButton
                        label="Cancel"
                        type="disabled"
                        style={{
                            height: "40px",
                            marginRight: "15px",
                            cursor: "pointer",
                            width: "50%",
                        }}
                        onClick={handleClose}
                    />
                    <BaseButton
                        label="Save"
                        type="active"
                        style={{
                            height: "40px",
                            width: "50%",
                            opacity: isEmpty(s3Path) ? 0.5 : 1,
                            cursor: isEmpty(s3Path) ? "not-allowed" : "pointer",
                        }}
                        onClick={() => onSaveClick()}
                        disabled={isEmpty(s3Path)}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default RentRollModal;
