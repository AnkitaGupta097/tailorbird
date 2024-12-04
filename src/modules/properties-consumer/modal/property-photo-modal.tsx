import React, { useState, useEffect } from "react";
import { Box, Dialog, Typography, Button } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import appTheme from "styles/theme";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import { map, findIndex } from "lodash";
import { graphQLClient } from "utils/gql-client";
import { ReactComponent as DownLoadIcon } from "../../../assets/icons/download-property.svg";
import Carousel from "react-material-ui-carousel";
import moment from "moment";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { GET_PROJECT_FILE } from "stores/projects/tpsm/tpsm-queries";
import CloseIcon from "@mui/icons-material/Close";
import actions from "../../../stores/actions";
import { DELETE_PROJECT_FILES } from "stores/single-project/queries";
import Loader from "modules/admin-portal/common/loader";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";

interface IFloorPlanModal {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
    photoId: any;
    propertyId?: any;
}

const PropertyPhotoModal = ({ modalHandler, openModal, photoId, propertyId }: IFloorPlanModal) => {
    const name = localStorage.getItem("user_name") || "";
    const dispatch = useAppDispatch();
    const userId = localStorage.getItem("user_id") || "";
    const { enqueueSnackbar } = useSnackbar();
    const { propertyImages, loading } = useAppSelector((state) => ({
        propertyImages: state.propertiesConsumer.propertyImages.data,
        loading: state.propertiesConsumer.propertyImages.loading,
    }));
    const [isDelete, setDelete] = useState<any>(false);
    const [photoIndex, setPhotoIndex] = useState<any>(false);

    useEffect(() => {
        setPhotoIndex(findIndex(propertyImages, { id: photoId }));
        //MIXPANEL : Event tracking for add new property image modal view
        mixpanel.track("PROPERTY DETAIL IMAGES VIEW IN MODAL : Viewed Property Images Modal", {
            eventId: "property_image_downloaded",
            ...getUserDetails(),
            ...getUserOrgDetails(),
            property_id: propertyId,
        });
        // eslint-disable-next-line
    }, []);

    const getAlert = (status: any, mes: string) => {
        enqueueSnackbar("", {
            variant: status,
            action: <BaseSnackbar variant={status} title={mes} />,
        });
    };

    const downloadPropertyPhoto = async (fileId: any) => {
        try {
            const res = await graphQLClient.query("getProjectFile", GET_PROJECT_FILE, {
                fileId,
            });
            //MIXPANEL : Event tracking for add new property image download
            mixpanel.track("PROPERTY DETAIL IMAGE DOWNLOADED : Downloaded Property Image", {
                eventId: "property_image_downloaded",
                ...getUserDetails(),
                ...getUserOrgDetails(),
                property_id: propertyId,
                file_id: fileId,
            });
            window.open(res.getProjectFile.download_link);
        } catch (error) {
            getAlert("error", "Something went wrong.");
        }
    };

    const deletePhoto = async (id: any) => {
        try {
            dispatch(
                actions.propertiesConsumer.getLoaderStatus({
                    fileType: "PROJECT_IMAGE",
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
                        data: propertyImages.filter((item: any) => item.id !== id),
                        fileType: "PROJECT_IMAGE",
                    }),
                );
                setDelete(false);
                setPhotoIndex(photoIndex);
                //MIXPANEL : Event tracking for add new property image deleted
                mixpanel.track("PROPERTY DETAIL IMAGE DELETED : Deleted Property Image", {
                    eventId: "property_image_downloaded",
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
    console.log(photoIndex);
    return (
        <Dialog
            open={openModal}
            fullWidth={true}
            maxWidth="sm"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => modalHandler(false)}
        >
            <Box
                p={6}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2.5}
                sx={{ borderBottom: `1px solid ${appTheme.border.inner}` }}
            >
                <Typography variant="text_18_bold">Property Images</Typography>
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
            <Box px={10} py={3}>
                {loading && (
                    <Box position="absolute" width="100%" zIndex={1}>
                        <Loader />
                    </Box>
                )}
                <Carousel
                    indicatorContainerProps={{
                        style: {
                            display: "none",
                        },
                    }}
                    navButtonsAlwaysVisible={true}
                    navButtonsWrapperProps={{
                        style: {
                            display: "flex",
                            justifyContent: "flex-end",
                            position: "relative",
                            float: "right",
                        },
                    }}
                    navButtonsProps={{
                        style: {
                            borderRadius: "8px",
                        },
                    }}
                    index={photoIndex}
                    autoPlay={false}
                >
                    {map(propertyImages, (image: any, index: any) => (
                        <Box key={image.id} aria-hidden={true}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <div>
                                    <Typography variant="text_12_regular"> Uploaded by </Typography>
                                    <Typography variant="text_12_semibold">{name} </Typography>
                                    <Typography variant="text_12_regular"> on </Typography>
                                    <Typography variant="text_12_semibold">
                                        {moment(image?.uploaded_at).format("L")}
                                    </Typography>
                                </div>
                                <Box>
                                    <Button
                                        variant="text"
                                        style={{ height: "40px" }}
                                        onClick={() => downloadPropertyPhoto(image.id)}
                                        endIcon={<DownLoadIcon />}
                                    >
                                        <Typography variant="text_14_semibold">Download</Typography>
                                    </Button>
                                    {isDelete ? (
                                        <Button
                                            variant="text"
                                            style={{ height: "40px", marginLeft: "5px" }}
                                            onClick={() => deletePhoto(image.id)}
                                            onBlur={() => setDelete(false)}
                                            endIcon={
                                                <CloseIcon
                                                    style={{
                                                        color: appTheme.text.error,
                                                    }}
                                                />
                                            }
                                        >
                                            <Typography
                                                variant="text_14_semibold"
                                                color={appTheme.text.error}
                                            >
                                                Confirm Delete
                                            </Typography>
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="text"
                                            style={{ height: "40px", marginLeft: "5px" }}
                                            onClick={() => setDelete(true)}
                                            endIcon={<CloseIcon />}
                                        >
                                            <Typography variant="text_14_semibold">
                                                Delete Image
                                            </Typography>
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                            <img
                                key={image.s3_version_id}
                                alt="property"
                                width="530px"
                                height="470px"
                                style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                    marginTop: "2px",
                                }}
                                src={image?.cdn_path[image?.cdn_path?.length - 1]}
                            />

                            <Typography variant="text_12_regular">
                                Image {index + 1} of {propertyImages.length}
                            </Typography>
                        </Box>
                    ))}
                </Carousel>
            </Box>
        </Dialog>
    );
};

export default PropertyPhotoModal;
