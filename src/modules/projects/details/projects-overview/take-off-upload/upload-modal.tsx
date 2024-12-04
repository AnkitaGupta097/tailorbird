import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    Typography,
    DialogContent,
    Box,
    Button,
    Divider,
    IconButton,
} from "@mui/material";
import BaseRadio from "components/base-radio";
import { PHASE_TYPE } from "modules/properties/constant";
import FileUpload from "components/upload-files";
import { filter, find, isEmpty, map } from "lodash";
import actions from "stores/actions";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import loaderProgress from "assets/icons/blink-loader.gif";
import DatasourceFilesTable from "./files-table";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";
import { useMutation } from "@apollo/client/react/hooks/useMutation";
import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client";
import FileUploadStatus from "./upload-status";
import CloseIcon from "@mui/icons-material/Close";
import InfoModal from "./InfoModal";

interface IModalProps {
    open: boolean;
    /* eslint-disable-next-line no-unused-vars */
    setPhase: (val: string) => void;
    phase: string;
    onClose: () => void;
    take_off_type: string;
    // eslint-disable-next-line no-unused-vars
    setDisabled: (val: boolean) => void;
}

export const CREATE_DATASOURCE_FILE = gql`
    mutation createDataSourceFilesForProperty($input: DataSourceFilePropertyCreationInput) {
        createDataSourceFilesForProperty(input: $input) {
            id
            status
            remote_file_reference
        }
    }
`;

export const GET_USER_PROFILE = gql`
    query GetUserProfile {
        getUserProfile {
            id
            auth0_id
            organization_id
            email
            name
            metadata {
                user_id
                name
                organization_id
                google_workspace_email
                is_billing_manager_access
                is_approval_workflow
                persona
            }
            auth0_connection_type
            is_first_time_login
            status
            contact_number
            is_deleted

            roles
            street_address
            city
            state
            zip_code
            is_billing_manager_access
            is_approval_workflow
            persona
        }
    }
`;

export default function UploadModal({
    open,
    phase,
    setPhase,
    onClose,
    take_off_type,
    setDisabled,
}: IModalProps) {
    const [openMessage, setOpenMessage] = useState(false);
    const { propertyId } = useParams();
    const dispatch = useAppDispatch();
    const { uploadedFiles, propertyDetails, isUploading } = useAppSelector((state) => {
        return {
            projectDetails: state.projectDetails.data,
            uploadedFiles: state.projectOverview.uploadFileDetails.uploadDetails,
            isUploading: state.projectOverview.uploadFileDetails.loading,
            propertyDetails: state.propertyDetails.data,
        };
    });
    const { data: userData } = useQuery(GET_USER_PROFILE);

    const uploadToS3 = (files: any) => {
        let filesToBeUpload;
        filesToBeUpload = filter(files, (file) => {
            return !find(uploadedFiles, { name: file.name });
        });

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
                    position: highestPosition + 1 + i,
                    name: file.name,
                    remote_file_reference: null,
                    remark: null,
                    loading: true,
                    validateFileName: null,
                })),
                filePath: `project_spec/datasource_files/${propertyDetails?.id}`,
                files: isEmpty(uploadedFiles) ? files : filesToBeUpload,
                isReupload: false,
                projectId: propertyDetails.projects.find((elm: any) => elm.type === "DEFAULT").id,
            }),
        );
    };
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [createDataSourceFiles] = useMutation(CREATE_DATASOURCE_FILE);

    const isSaveDisable = () => {
        if (isUploading) {
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
            const input = {
                property_id: propertyId,
                remote_file_references: urls,
                upload_phase: phase,
                uploaded_by: userData?.getUserProfile?.id,
                take_off_type,
            };
            const res = await createDataSourceFiles({
                variables: {
                    input,
                },
            });
            console.log(loading, res);
            // onClose();
            dispatch(actions.projectOverview.emptyUploadedDetails());
            setLoading(false);
            setOpenMessage(true);
            setDisabled(true);
        } catch (error) {
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title="Could not upload files." />,
            });
            onClose();
            dispatch(actions.projectOverview.createDataSourceFail(error));
            setLoading(false);
            setDisabled(false);
        }
    };

    const handleClose = () => {
        onClose();
        setLoading(false);
        dispatch(actions.projectOverview.emptyUploadedDetails());
    };

    const onFileUpload = (files: File[]) => {
        uploadToS3(files);
    };

    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            // onClose={onClose}
            maxWidth="lg"
            fullWidth
        >
            <Box display={"flex"} justifyContent={"flex-end"}>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
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
                        onValChange={(val) => setPhase(val)}
                        value={phase}
                    />
                </Box>
                <Box display={"flex"} justifyContent="center" mb={4}>
                    <FileUpload
                        isMultiple
                        helperText={`Upload only ZIP Files*`}
                        onFileChange={onFileUpload}
                        acceptedFileTypes={["application/zip"]}
                    />
                </Box>
                <Box>
                    {loading ? (
                        <Box
                            height={150}
                            alignItems="center"
                            display={"flex"}
                            justifyContent="center"
                        >
                            <img
                                src={loaderProgress}
                                alt="file-status"
                                style={{
                                    width: "44px",
                                    height: "44px",
                                }}
                            />
                        </Box>
                    ) : uploadedFiles.length > 0 ? (
                        <FileUploadStatus />
                    ) : (
                        <></>
                    )}
                </Box>
                {uploadedFiles.length === 0 && (
                    <DatasourceFilesTable
                        takeOffType={take_off_type}
                        propertyDetails={propertyDetails}
                    />
                )}
                {uploadedFiles.length > 0 && (
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
                )}
            </DialogContent>
            <InfoModal
                open={openMessage}
                onClose={() => {
                    setOpenMessage(false);
                    onClose();
                }}
            />
        </Dialog>
    );
}
