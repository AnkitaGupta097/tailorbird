import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, Typography, Button, Box } from "@mui/material";
import "./projects-overview.css";
import { useSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "../../../../stores/hooks";
import actions from "../../../../stores/actions";
import { map, filter, find, isEmpty, includes, cloneDeep } from "lodash";
import FileUploadStatus from "./file-upload-status";
import { useParams } from "react-router-dom";
import { PHASE_TYPE, FILE_TYPE, PROJECT_TYPE } from "../../constant";
import loaderProgress from "../../../../assets/icons/blink-loader.gif";
import FileUpload from "../../../../components/upload-files";
import BaseRadio from "../../../../components/base-radio";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";
import BaseSnackbar from "../../../../components/base-snackbar";
import { graphQLClient } from "../../../../utils/gql-client";
import { CREATE_DATASOURCE_FILE } from "../../../../stores/projects/details/overview/overview-queries";

interface IFileUploadModal {
    /* eslint-disable-next-line */
    isModal: boolean;
    handleClose: any;
}

const FileUploadModal = ({ isModal, handleClose }: IFileUploadModal) => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { projectId } = useParams();
    const { projectDetails, uploadedFiles, isS3Upload } = useAppSelector((state) => {
        return {
            projectDetails: state.projectDetails.data,
            uploadedFiles: state.projectOverview.uploadFileDetails.uploadDetails,
            isS3Upload: state.projectOverview.uploadFileDetails.loading,
        };
    });

    const rentRoll_enabled = useFeature(FeatureFlagConstants.RENT_ROLL).on;
    const container_2_enabled = useFeature(FeatureFlagConstants.CONTAINER_2).on;
    const isSummaryUpload =
        rentRoll_enabled &&
        container_2_enabled &&
        projectDetails?.projectType == PROJECT_TYPE[0].value;
    const [phase, setPhase] = useState(PHASE_TYPE[0].value);
    const [isLoading, setLoading] = useState(false);

    const uploadToS3 = (files: any) => {
        let filesToBeUpload;
        let parseFileType = true;
        let fileTypeCloned = cloneDeep(FILE_TYPE);
        if (isSummaryUpload) {
            fileTypeCloned = fileTypeCloned.filter((type: any) => type !== "text/csv");
        }
        filesToBeUpload = filter(files, (file) => {
            const fileType = includes(fileTypeCloned, file.type);
            if (!fileType) {
                parseFileType = fileType;
            }
            return !find(uploadedFiles, { name: file.name });
        });

        if (!parseFileType) {
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title="Unpported file Type" />,
            });

            return false;
        }

        if (!isEmpty(uploadedFiles)) {
            if (isEmpty(filesToBeUpload)) {
                return false;
            }
        }
        let highestPosition = 0;
        highestPosition =
            !isEmpty(uploadedFiles) && uploadedFiles[uploadedFiles.length - 1]?.position;
        dispatch(
            actions.projectOverview.fileNameValidationStart({
                fileContent: map(isEmpty(uploadedFiles) ? files : filesToBeUpload, (file, i) => ({
                    // @ts-ignore
                    position: highestPosition + 1 + i,
                    name: file.name, // @ts-ignore
                    remote_file_reference: null,
                    remark: null,
                    loading: true,
                    validateFileName: null,
                })),
                filePath: `project_spec/datasource_files/${projectDetails?.id}`,
                files: isEmpty(uploadedFiles) ? files : filesToBeUpload,
                isReupload: false,
                projectId,
            }),
        );
    };

    useEffect(() => {
        dispatch(actions.projectOverview.initStateForTakeOffs(""));
        //eslint-disable-next-line
    }, []);

    const onFileUpload = (files: any) => {
        uploadToS3(files);
    };

    const createDataSource = async () => {
        let urls = map(
            filter(uploadedFiles, (f) => f.remote_file_reference),
            (file) => {
                return {
                    remote_file_reference: file.remote_file_reference,
                    user_remark: file.remark,
                };
            },
        );
        setLoading(true);
        try {
            const res = await graphQLClient.mutate(
                "createDataSourceFiles",
                CREATE_DATASOURCE_FILE,
                {
                    input: {
                        project_id: projectId,
                        remote_file_references: urls,
                        upload_phase: phase,
                        uploaded_by: projectDetails.userId,
                    },
                },
            );
            dispatch(actions.projectOverview.createDataSourceSuccess(res));
            handleClose();
            setLoading(false);
        } catch (error) {
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title="Could not upload files." />,
            });
            dispatch(actions.projectOverview.createDataSourceFail(error));
            setLoading(false);
            handleClose();
        }
    };

    const onPhaseChange = (val: string) => {
        setPhase(val);
    };

    const isSaveDisable = () => {
        if (isS3Upload) {
            return true;
        }
        const invalidFile = filter(uploadedFiles, (file) => {
            return file?.validateFileName;
        });
        if (invalidFile.length > 0) {
            return true;
        }
        return false;
    };
    return (
        <Dialog
            open={isModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="file-upload-modal"
        >
            <DialogTitle style={{ paddingBottom: "4px" }}>
                <Typography variant="text_18_semibold">Upload Files</Typography>
            </DialogTitle>
            <DialogContent>
                <Box display={"flex"} alignItems="center" mb={2}>
                    <Box mr={4}>
                        <span className="label">Select Phase Type : </span>
                    </Box>
                    <BaseRadio
                        options={PHASE_TYPE}
                        alignment="row"
                        onValChange={onPhaseChange}
                        value={phase}
                    />
                </Box>
                <FileUpload
                    isMultiple
                    helperText={`Upload only ${isSummaryUpload ? "ZIP" : "CSV and ZIP"} Files*`}
                    onFileChange={onFileUpload}
                />
                {isLoading ? (
                    <Box height={150} alignItems="center" display={"flex"} justifyContent="center">
                        <img
                            src={loaderProgress}
                            alt="file-status"
                            style={{
                                width: "44px",
                                height: "44px",
                            }}
                        />
                    </Box>
                ) : (
                    <FileUploadStatus />
                )}
                <Box pb={1} pt={6} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ height: "41px", marginRight: "15px", width: "117px" }}
                        onClick={handleClose}
                    >
                        <Typography variant="text_14_regular"> Cancel</Typography>
                    </Button>
                    <Button
                        variant="contained"
                        style={{ height: "41px", width: "117px" }}
                        onClick={createDataSource}
                        disabled={isSaveDisable()}
                    >
                        <Typography variant="text_14_regular"> Save</Typography>
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default FileUploadModal;
