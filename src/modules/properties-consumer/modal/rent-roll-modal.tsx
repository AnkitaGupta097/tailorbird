import React, { useState } from "react";
import { Box, Dialog, Typography, Button, Divider, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import appTheme from "styles/theme";
import { ReactComponent as FileIcon } from "../../../assets/icons/file-icon.svg";
import { ReactComponent as CsvFile } from "../../../assets/icons/upload-file.svg";
import { ReactComponent as DownLoadIcon } from "../../../assets/icons/download-property.svg";
import {
    CREATE_PROJECT_FILES,
    MARK_FILE_UPLOADED,
    GET_PROJECT_FILE,
} from "stores/projects/tpsm/tpsm-queries";
import { DELETE_PROJECT_FILES } from "stores/single-project/queries";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { includes, isEmpty, map } from "lodash";
import { RENT_ROLL_FILE_TYPE } from "../constants";
import { graphQLClient } from "utils/gql-client";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import actions from "../../../stores/actions";
import Loader from "modules/admin-portal/common/loader";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";

interface ICreateNewItemModal {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
}

const RentRollModal = ({ modalHandler, openModal }: ICreateNewItemModal) => {
    const { enqueueSnackbar } = useSnackbar();
    const { propertyId } = useParams();
    const dispatch = useAppDispatch();
    const userId = localStorage.getItem("user_id") || "";
    const { rentRoll, loading } = useAppSelector((state) => ({
        rentRoll: state.propertiesConsumer.rentRoll.data,
        loading: state.propertiesConsumer.rentRoll.loading,
    }));

    const [isDeleteRR, setDeleteRR] = useState<any>([]);

    const getAlert = (status: any, mes: string) => {
        enqueueSnackbar("", {
            variant: status,
            action: <BaseSnackbar variant={status} title={mes} />,
        });
    };

    const uploadFile = async (file: File, signedUrl: string, fileId: string) => {
        const options = {
            method: "PUT",
            body: file,
        };
        const uploadResponse = await fetch(signedUrl, options);
        if (uploadResponse.ok) {
            const res = await graphQLClient.mutate("markFileUploaded", MARK_FILE_UPLOADED, {
                fileId,
            });
            if (res) {
                getAlert("success", "Upload Successful");
                dispatch(
                    actions.propertiesConsumer.fetchPropertyFilesStart({
                        fileType: "RENT_ROLL_COSTUMER_UPLOAD",
                        propertyId,
                    }),
                );
            } else {
                getAlert("error", "Upload Unsuccessful");
            }
        } else {
            getAlert("error", `Upload failed: ${uploadResponse.statusText}`);
        }
    };

    const onRentRollChange = async (files: any) => {
        if (files.length > 0) {
            const file = files[0];
            const fileType = includes(RENT_ROLL_FILE_TYPE, file.type);
            if (!fileType) {
                //MIXPANEL : Event tracking for uploading invalid rent roll files
                mixpanel.track(
                    "PROPERTY DETAIL RENT ROLL INVALID FILE UPLOAD  : Uploaded Invalid Rent Roll File",
                    {
                        eventId: "invalid_rent_roll_file_uploaded",
                        ...getUserDetails(),
                        ...getUserOrgDetails(),
                        file_type: file.type,
                        property_id: propertyId,
                    },
                );
                getAlert("error", `Wrong file type. Upload only CSV / XLSX file.`);
            } else {
                try {
                    dispatch(
                        actions.propertiesConsumer.getLoaderStatus({
                            fileType: "RENT_ROLL_COSTUMER_UPLOAD",
                        }),
                    );
                    const input = {
                        files: [
                            {
                                file_name: file.name,
                                file_type: "RENT_ROLL_COSTUMER_UPLOAD",
                                tags: null,
                            },
                        ],
                        project_id: propertyId,
                        user_id: userId,
                        prefix: `project_spec/customer_rent_roll/${propertyId}`,
                    };
                    const response = await graphQLClient.mutate(
                        "createProjectFiles",
                        CREATE_PROJECT_FILES,
                        {
                            input,
                        },
                    );
                    const { signed_url, id } = response[0];

                    await uploadFile(file, signed_url, id);
                    //MIXPANEL : Event tracking for uploading rent roll files
                    mixpanel.track(
                        "PROPERTY DETAIL RENT ROLL FILE UPLOADED : Uploaded Rent Roll File",
                        {
                            eventId: "rent_roll_file_uploaded",
                            ...getUserDetails(),
                            ...getUserOrgDetails(),
                            file_id: id,
                            property_id: propertyId,
                        },
                    );
                } catch (error) {
                    getAlert("error", `Something went wrong.`);
                }
            }
        }
    };

    const downloadRentRollFile = async (fileId: any) => {
        try {
            const res = await graphQLClient.query("getProjectFile", GET_PROJECT_FILE, {
                fileId,
            });
            //MIXPANEL : Event tracking fordownloading rent roll files
            mixpanel.track("PROPERTY DETAIL RENT ROLL FILE DOWNLOAD : Downloaded Rent Roll File", {
                eventId: "rent_roll_file_download",
                ...getUserDetails(),
                ...getUserOrgDetails(),
                file_id: fileId,
                property_id: propertyId,
            });
            window.open(res.getProjectFile.download_link);
        } catch (error) {
            getAlert("error", `Something went wrong.`);
        }
    };

    const cancleDelete = (id: any) => {
        setDeleteRR(isDeleteRR.filter((item: any) => item !== id));
    };
    const deleteRentRoll = async (id: any) => {
        try {
            dispatch(
                actions.propertiesConsumer.getLoaderStatus({
                    fileType: "RENT_ROLL_COSTUMER_UPLOAD",
                }),
            );
            const res = await graphQLClient.mutate("deleteProjectFile", DELETE_PROJECT_FILES, {
                input: {
                    file_id: id,
                    user_id: userId,
                },
            });
            if (res) {
                dispatch(
                    actions.propertiesConsumer.deletePropertiesFile({
                        data: rentRoll.filter((item: any) => item.id !== id),
                        fileType: "RENT_ROLL_COSTUMER_UPLOAD",
                    }),
                );
                //MIXPANEL : Event tracking fordownloading rent roll files
                mixpanel.track("PROPERTY DETAIL RENT ROLL FILE DELETE : Deleted Rent Roll File", {
                    eventId: "rent_roll_file_deleted",
                    ...getUserDetails(),
                    ...getUserOrgDetails(),
                    file_id: id,
                    property_id: propertyId,
                });
                getAlert("success", "Deleted Successfullly");
            }
        } catch (error) {
            getAlert("error", `Something went wrong.`);
        }
    };

    return (
        <Dialog
            open={openModal}
            fullWidth={true}
            maxWidth="md"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => modalHandler(false)}
        >
            {loading && (
                <Box position="absolute" height="100%" width="100%">
                    <Loader />
                </Box>
            )}
            <Box
                p={6}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2.5}
                sx={{ borderBottom: `1px solid ${appTheme.border.inner}` }}
            >
                <Typography variant="text_18_bold">Rent Rolls</Typography>
                <CloseOutlinedIcon
                    sx={{
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onClick={() => {
                        modalHandler(false);
                    }}
                />
            </Box>
            <Box>
                <Box p={6} minHeight="150px">
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        px={8}
                        py={3}
                        style={{ background: appTheme.background.header }}
                    >
                        <Box>
                            <Typography variant="text_16_semibold">File</Typography>
                        </Box>
                        <Box>
                            <Typography variant="text_16_semibold">Download Link</Typography>
                        </Box>
                    </Box>
                    <Box px={8} maxHeight={"580px"} sx={{ overflowY: "scroll" }}>
                        {!isEmpty(rentRoll) &&
                            map(rentRoll, (RRFile) => {
                                const { file_name, uploaded_at, id } = RRFile;
                                const ext = file_name.split(".");
                                const isDelete = isDeleteRR.includes(id);
                                return (
                                    <>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            my={4}
                                            sx={{ filter: `blur(${loading ? "1px" : "0px"}) ` }}
                                        >
                                            <Box display="flex">
                                                {ext[ext.length - 1] === "csv" ? (
                                                    <CsvFile />
                                                ) : (
                                                    <FileIcon />
                                                )}
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    justifyContent="center"
                                                    pl={2}
                                                >
                                                    <Typography variant="text_12_medium">
                                                        {file_name}
                                                    </Typography>
                                                    <Typography variant="text_12_regular">
                                                        {`${moment(uploaded_at).format(
                                                            "l [at] LT",
                                                        )} by Tailorbird`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            {isDelete ? (
                                                <Box display="flex" alignItems="center">
                                                    <Button
                                                        variant="outlined"
                                                        style={{
                                                            height: "40px",
                                                            borderColor: appTheme.border.medium,
                                                        }}
                                                        onClick={() => cancleDelete(id)}
                                                    >
                                                        <Typography
                                                            variant="text_16_semibold"
                                                            color={appTheme.border.medium}
                                                        >
                                                            Cancle
                                                        </Typography>
                                                    </Button>
                                                    <Box
                                                        ml={2}
                                                        display="flex"
                                                        alignItems="center"
                                                        onClick={() => deleteRentRoll(id)}
                                                    >
                                                        <div>
                                                            <Typography
                                                                variant="text_16_semibold"
                                                                color={appTheme.text.error}
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Confirm Delete
                                                            </Typography>
                                                        </div>
                                                        <CloseIcon
                                                            style={{
                                                                cursor: "pointer",
                                                                color: appTheme.text.error,
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Box display="flex" alignItems="center">
                                                    <Button
                                                        variant="outlined"
                                                        style={{ height: "40px" }}
                                                        endIcon={<DownLoadIcon />}
                                                        onClick={() => downloadRentRollFile(id)}
                                                    >
                                                        <Typography variant="text_16_semibold">
                                                            Download
                                                        </Typography>
                                                    </Button>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() =>
                                                            setDeleteRR([...isDeleteRR, id])
                                                        }
                                                    >
                                                        <CloseIcon style={{ cursor: "pointer" }} />
                                                    </IconButton>
                                                </Box>
                                            )}
                                        </Box>
                                        <Divider />
                                    </>
                                );
                            })}
                    </Box>
                </Box>
                <Box>
                    <Box pb={5} px={6} display="flex" justifyContent="flex-end">
                        <Box>
                            <Button
                                variant="contained"
                                component="label"
                                style={{ marginLeft: "10px", height: "40px" }}
                                endIcon={
                                    <DownLoadIcon
                                        stroke={appTheme.palette.secondary.light}
                                        style={{
                                            transform: `rotate( 180deg)`,
                                        }}
                                    />
                                }
                            >
                                <input
                                    id="rentRollFileUpload"
                                    type={"file"}
                                    hidden
                                    onChange={(e) => onRentRollChange(e.target.files)}
                                />
                                <Typography variant="text_16_semibold">Upload New </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

export default RentRollModal;
