/* eslint-disable no-unused-vars */

import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Button,
} from "@mui/material";
import appTheme from "styles/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ReactComponent as ApartmentIcon } from "../../../assets/icons/apartment.svg";
import { ReactComponent as OpenInNew } from "../../../assets/icons/open_in_new.svg";
import RentRollModal from "../modal/rent-roll-modal";
import FloorPlanModal from "../modal/floor-plan-modal";
import { useSnackbar } from "notistack";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import Carousel from "react-material-ui-carousel";
import { ReactComponent as DownLoadIcon } from "../../../assets/icons/download-property.svg";
import { chunk, includes } from "lodash";
import BaseSnackbar from "components/base-snackbar";
import { FILE_TYPE, TAILORBIRD_PROVIDED_DATA } from "../constants";
import { useParams } from "react-router-dom";
import { graphQLClient } from "utils/gql-client";
import actions from "../../../stores/actions";
import Loader from "modules/admin-portal/common/loader";
import { CREATE_PROJECT_FILES, MARK_FILE_UPLOADED } from "stores/projects/tpsm/tpsm-queries";
import PropertyPhotoModal from "../modal/property-photo-modal";
import FPCommonModal from "../modal/fp-common-modal";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";
import ForgeViewerPanels from "./forge-viewer-accordions";
import MissingInfoModal from "./missing-info-modals";
import { InfoCard } from "./missing-info-modals/info-card";
import { FORGE_DETAIL_TYPES } from "../constants";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";

const PropertyDetail = ({
    forgeMissingDetailTypesObj,
    openMissingInfoModal,
    setShowingAllMissingInfo,
}: any) => {
    const { enqueueSnackbar } = useSnackbar();
    const { propertyId } = useParams();
    const dispatch = useAppDispatch();
    const refCarousel = useRef<any>({});
    const userId = localStorage.getItem("user_id") || "";
    const { propertyImages, loading, propertyTitle, floorplans, propertyDetails } = useAppSelector(
        (state) => ({
            loading: state.propertiesConsumer.propertyImages.loading,
            propertyImages: state.propertiesConsumer.propertyImages.data,
            propertyTitle: state.propertiesConsumer.propertyDetails.name,
            floorplans: state.projectFloorplans.floorplans,
            propertyDetails: state.propertiesConsumer.propertyDetails,
        }),
    );
    console.log("propertyTitle", propertyTitle);

    const [isModal, setAllModal] = useState<any>({
        rentRoll: false,
        floorPlan: false,
        propertyPhoto: false,
        building: false,
        commonArea: false,
    });
    const [expandAcc, setExpandAcc] = useState<any>(false);
    const [photoId, setPhotoId] = useState<any>(null);
    const [previewMediaFile, setPreviewMediaFile] = useState<any>(null);
    const carouselWidth = refCarousel.current?.offsetWidth;
    const sliderItems = chunk(propertyImages, Math.floor(carouselWidth / 190));
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
                        fileType: "PROJECT_IMAGE",
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

    const uploadPropertyImages = async (files: any) => {
        if (files.length > 0) {
            const file = files[0];
            const fileType = includes(FILE_TYPE, file.type);
            if (!fileType) {
                //MIXPANEL : Event tracking for invalid property image types
                mixpanel.track("PROPERTY DETAIL IMAGE UPLOAD FAILURE : Invalid Image type", {
                    eventId: "property_image_upload_failure",
                    ...getUserDetails(),
                    ...getUserOrgDetails(),
                    image_type: file.type,
                });
                getAlert("error", `Wrong file type. Upload only images and gif.`);
            } else {
                try {
                    dispatch(
                        actions.propertiesConsumer.getLoaderStatus({
                            fileType: "PROJECT_IMAGE",
                        }),
                    );
                    const input = {
                        files: [
                            {
                                file_name: file.name,
                                file_type: "PROJECT_IMAGE",
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
                    //MIXPANEL : Event tracking for add new property image
                    mixpanel.track("PROPERTY DETAIL IMAGE UPLOADED : Uploaded New Property Image", {
                        eventId: "property_image_uploaded",
                        ...getUserDetails(),
                        ...getUserOrgDetails(),
                        file_id: id,
                    });
                } catch (error) {
                    getAlert("error", `Something went wrong.`);
                }
            }
        }
    };
    const isPropertyDataUploadOn = useFeature(FeatureFlagConstants.PROPERTY_MISSING_DATA_UPLOAD).on;

    return (
        <Box pt={4} mb={8}>
            <ForgeViewerPanels
                forgeMissingDetailTypesObj={forgeMissingDetailTypesObj}
                openMissingInfoModal={openMissingInfoModal}
                setShowingAllMissingInfo={setShowingAllMissingInfo}
            />
            {isModal.rentRoll && (
                <RentRollModal
                    openModal={isModal.rentRoll}
                    modalHandler={() => setAllModal({ ...isModal, rentRoll: false })}
                />
            )}
            {isModal.floorPlan && (
                <FloorPlanModal
                    openModal={isModal.floorPlan}
                    propertyId={propertyId}
                    modalHandler={() => setAllModal({ ...isModal, floorPlan: false })}
                />
            )}
            {isModal.building && (
                <FPCommonModal
                    openModal={isModal.building}
                    isBuilding={true}
                    modalHandler={() => setAllModal({ ...isModal, building: false })}
                />
            )}
            {isModal.commonArea && (
                <FPCommonModal
                    openModal={isModal.commonArea}
                    modalHandler={() => setAllModal({ ...isModal, commonArea: false })}
                />
            )}
            {isModal.propertyPhoto && (
                <PropertyPhotoModal
                    photoId={photoId}
                    openModal={isModal.propertyPhoto}
                    modalHandler={() => setAllModal({ ...isModal, propertyPhoto: false })}
                    propertyId={propertyId}
                />
            )}
        </Box>
    );
};

export default PropertyDetail;
