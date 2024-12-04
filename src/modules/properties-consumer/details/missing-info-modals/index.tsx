/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    Grid,
    Typography,
    DialogTitle,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import appTheme from "styles/theme";
// eslint-disable-next-line no-unused-vars
import { FORGE_DETAIL_TYPES } from "../../constants";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { useParams } from "react-router";
import actions from "stores/actions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import BaseButton from "components/button";
import { ReactComponent as UploadIcon } from "assets/icons/upload.svg";
import { ReactComponent as ArrowCircleRignt } from "assets/icons/arrow-circle-right-blue.svg";
import { ReactComponent as Whatsapp } from "assets/icons/whatsapp.svg";
import { ReactComponent as PlayCircleOutlined } from "assets/icons/play-circle-outlined.svg";
import { ReactComponent as ArrowDropdown } from "assets/icons/arrow-dropdown.svg";

import FileUpload from "components/upload-files-new";
import BaseTextField from "components/text-field";
import PreviewModal from "./preview_modal";
import { IFileDetails } from "stores/single-project/interfaces";
import CommonDialog from "modules/admin-portal/common/dialog";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BaseLoader from "components/base-loading";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface IMissingInfoModal {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
    onSave: any;
    setPreviewMediaFile: any;
    previewMediaFile: any;
    missingInfoModalDataKey: any;
    propertyTitle: any;
    showingAllMissingInfo: any;
    forgeMissingDetailTypesObj: any;
}

const MissingInfoModal = ({
    modalHandler,
    openModal,
    setPreviewMediaFile,
    previewMediaFile,
    missingInfoModalDataKey,
    propertyTitle,
    showingAllMissingInfo,
    forgeMissingDetailTypesObj,
}: IMissingInfoModal) => {
    const {
        floorplansData,
        propertyDetails,
        missingFileUploading,
        deleteInProgress,
        floorplansLoading,
        snackbar,
    } = useAppSelector((state) => ({
        floorplansData: state.projectFloorplans.floorplans.data,
        propertyDetails: state.propertiesConsumer.propertyDetails,
        missingFileUploading: state.projectFloorplans.missingFileUploading,
        deleteInProgress: state.projectFloorplans.deleteInProgress,
        floorplansLoading: state.projectFloorplans.floorplans.loading,
        snackbar: state.common.snackbar,
    }));

    const { propertyId } = useParams();
    const dispatch = useAppDispatch();
    const [missingInfo, setMissingInfo]: any = useState(FORGE_DETAIL_TYPES);
    const [expanded, setExpanded]: any = useState({});
    const [accordionsExpanded, setAccordionsExpanded]: any = useState({});

    const [showFileUpload, setShowFileUpload]: any = useState({});
    const [whatsAppNumbers, setWhatsAppNumbers]: any = useState({});
    const [fileUploadRefs, setFileUploadRefs]: any = useState({});

    const [openNumberConfirmation, setOpenNumberConfirmation]: any = useState(false);
    const [currentUploadAgainstFP, setCurrentUploadAgainstFP]: any = useState(null);
    const [currentMissingDetail, setCurrentMissingDetail]: any = useState(null);

    const userId = localStorage.getItem("user_id") || "";
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [itemToRemove, setItemToRemove]: any = useState<IFileDetails | null>(null);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const [deleteItemTakeOffType, setDeleteItemTakeOffType]: any = useState(null);

    const floorplanTypes = ["FLOORPLAN", "BUILDING", "COMMON_AREA"];
    const handleVideoClick = () => {
        setPreviewMediaFile({
            isBestPracticeVideo: true,
        });
        // Logic to open the video player
        setShowPreviewModal(true);
    };

    const handleCloseVideo = () => {
        // Logic to close the video player
        setShowPreviewModal(false);
    };

    const handleExpandClick = (id: any) => {
        setExpanded((prevExpanded: any) => ({
            ...prevExpanded,
            [id]: !prevExpanded[id],
        }));
        // Shift focus to the expanded/collapsed grid
        const expandedGrid: any = document.getElementById(`expanded-grid-${id}`);
        expandedGrid?.focus();
    };
    const handleAccordionExpandClick = (id: any) => {
        setAccordionsExpanded((prevExpanded: any) => ({
            ...prevExpanded,
            [id]: !prevExpanded[id],
        }));
    };

    const openPreviewClick = (fileData: any) => {
        setShowPreviewModal(true),
            setPreviewMediaFile({
                ...fileData,
                previewLink: fileData.highestResolutionUrl,
            });
    };

    const onFileUpload = (files: any, id: any, takeOffType: any) => {
        console.log("files", files);
        setCurrentUploadAgainstFP(id);
        uploadToS3(files, id, takeOffType);
    };
    const isFileTypeValid = (file: any) => {
        const acceptedFormats = [".mp4", ".mov", ".heic", ".png", ".jpeg", ".jpg"];
        const fileExtension = file?.name?.split(".")?.pop()?.toLowerCase();
        return acceptedFormats?.includes(`.${fileExtension}`);
    };
    const { enqueueSnackbar } = useSnackbar();

    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };

    const uploadToS3 = (files: any, id: any, takeOffType: any) => {
        const images = [...files]?.map((file: { name: string; type: any }) => {
            if (isFileTypeValid(file)) {
                return {
                    file_name: file.name,
                    file_type: file.type.includes("video")
                        ? "MISSING_INFO_VIDEO"
                        : "MISSING_INFO_IMAGE",
                    tags: {
                        is_cover_image: false,
                        projectId: propertyId,
                        content_type: file.type,
                    },
                };
            } else {
                showSnackBar("error", `Invalid file : ${file.name}`);
                return null;
            }
        });
        const validImages = images.filter((image) => image !== null);
        if (validImages?.length) {
            dispatch(
                actions.projectFloorplans.createMissingInfoStart({
                    isPropertyMissingInfo: takeOffType == "SITE",
                    takeOffType: takeOffType,
                    floor_plan_id: id,
                    input: {
                        files: [...validImages],
                        project_id: propertyId,
                        user_id: userId,
                        floor_plan_id: takeOffType == "SITE" ? null : id,
                        prefix: null,
                    },
                    project_id: propertyId,
                    files: [...files],
                }),
            );
        }
    };
    const DeleteFile = async (file: IFileDetails | undefined) => {
        const filestoRemove = [file];

        try {
            dispatch(
                actions.projectFloorplans.DeleteMissingInfoStart({
                    project_id: propertyId,
                    files: filestoRemove,
                    user_id: localStorage.getItem("user_id"),
                    file_type: file?.file_type?.includes("video")
                        ? "MISSING_INFO_VIDEO"
                        : "MISSING_INFO_IMAGE",
                    takeOffType: deleteItemTakeOffType,
                }),
            );
            //MIXPANEL : Event tracking for  Design Documents deleted

            setOpenDeleteConfirmation(false);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        // Create a ref for each FileUpload component
        const refs = missingInfo.reduce((acc: any, item: any) => {
            item.data.forEach((dataItem: any) => {
                acc[dataItem.id] = React.createRef(); // use dataItem.id as the key
            });
            return acc;
        }, {});
        setFileUploadRefs(refs);
    }, [missingInfo]);

    const handleUploadMoreFilesClick = (id: any) => {
        setShowFileUpload((prev: any) => ({
            ...prev,
            [id]: true,
        }));

        fileUploadRefs[id]?.current?.focus();
    };
    const handleUpdateWhatsappNumbers = (id: any, value: any) => {
        setWhatsAppNumbers((prev: any) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleshowPreviousFilesClick = (id: any) => {
        setShowFileUpload((prev: any) => ({
            ...prev,
            [id]: false,
        }));
    };
    console.log(
        "input data",
        { showingAllMissingInfo: showingAllMissingInfo },
        { missingInfo: missingInfo },
        { floorplansData: floorplansData },
        { FORGE_DETAIL_TYPES: FORGE_DETAIL_TYPES },
        { missingInfoModalDataKey: missingInfoModalDataKey },
        { propertyTitle: propertyTitle },
    );

    useEffect(() => {
        let updatedMissingInfo = [];

        if (showingAllMissingInfo) {
            // Update all missingInfo data with filteredFloorplans

            updatedMissingInfo = FORGE_DETAIL_TYPES.filter(
                (data: any) => forgeMissingDetailTypesObj[data?.title] > 0,
            ).map((info: any) => {
                if (info?.dataKey === "SITE") {
                    // Update data with property details from Redux store
                    // Example:

                    return { ...info, data: [propertyDetails] };
                } else {
                    const filteredFloorplans = floorplansData.filter(
                        (elm: any) =>
                            elm.takeOffType === info.dataKey && elm.isHavingMissingInfo === true,
                    );
                    return { ...info, data: filteredFloorplans };
                }
            });
        } else {
            updatedMissingInfo = FORGE_DETAIL_TYPES.filter(
                (data: any) => data.dataKey == missingInfoModalDataKey?.dataKey,
            );

            updatedMissingInfo = updatedMissingInfo.map((info: any) => {
                if (missingInfoModalDataKey?.dataKey === "SITE") {
                    // Update data with property details from Redux store
                    // Example:

                    return { ...info, data: [propertyDetails] };
                } else if (info.dataKey === missingInfoModalDataKey?.dataKey) {
                    // Filter floorplans for each info
                    const filteredFloorplans = floorplansData.filter(
                        (elm: any) =>
                            elm.takeOffType === info.dataKey && elm.isHavingMissingInfo === true,
                    );
                    return { ...info, data: filteredFloorplans };
                } else {
                    return info;
                }
            });
        }

        setMissingInfo(updatedMissingInfo);
    }, [
        missingInfoModalDataKey,
        showingAllMissingInfo,
        floorplansData,
        propertyDetails,
        forgeMissingDetailTypesObj,
        floorplansLoading,
    ]);

    const handleOpenDailog = () => {
        setOpenDeleteConfirmation(true);
    };

    const onClickSendToWhatsApp = (missingDetail: any) => {
        setCurrentMissingDetail(missingDetail);
        setOpenNumberConfirmation(true);
    };
    const onConfirmConsistancyInNumber = async () => {
        try {
            let missingInfoCopy = [...missingInfo];
            let areas: any[] = [];
            missingInfoCopy.forEach(async (element: any) => {
                element.data.forEach(async (dataElement: any) => {
                    // if id matches with propertyId, it is site
                    if (dataElement.id === propertyId) {
                        areas.push({
                            name: "Site",
                        });
                    } else {
                        areas.push({
                            name: `${dataElement.commercial_name}${
                                dataElement.commercial_name !== dataElement.name
                                    ? `(${dataElement.name || "-"})`
                                    : ""
                            }`,
                            floorplan_id: dataElement.id,
                        });
                    }
                });
            });
            missingInfoCopy.forEach(async (element: any) => {
                element.data.forEach(async (dataElement: any) => {
                    let copy = { ...dataElement };
                    copy["whatsapp_number"] = whatsAppNumbers[currentMissingDetail.id];
                    await updateWhatsAppNumber(copy, true);
                });
            });
            sendWhatsappMessage(areas, whatsAppNumbers[currentMissingDetail.id]);
        } catch (e) {
            console.log("error updating whatsapp num", e);
        }
    };
    console.log("showpreviewmodal", showPreviewModal);

    const onCancelConsistanyInNumber = () => {
        updateWhatsAppNumber(currentMissingDetail, false);
        setOpenNumberConfirmation(false);
        setCurrentMissingDetail(null);
        let areas = [];

        if (currentMissingDetail.id === propertyId) {
            areas = [
                {
                    name: "Site",
                },
            ];
        } else {
            areas = [
                {
                    name: `${currentMissingDetail.commercial_name}${
                        currentMissingDetail.commercial_name !== currentMissingDetail.name
                            ? `(${currentMissingDetail.name || "-"})`
                            : ""
                    }`,
                    floorplan_id: currentMissingDetail.id,
                },
            ];
        }
        sendWhatsappMessage(areas, whatsAppNumbers[currentMissingDetail.id]);
    };
    const updateWhatsAppNumber = async (floorPlanData: any, isFromConfirmConsistancy: any) => {
        const whatsAppNumber = isFromConfirmConsistancy
            ? floorPlanData["whatsapp_number"]
            : whatsAppNumbers[floorPlanData.id];
        if (floorplanTypes.includes(floorPlanData.takeOffType)) {
            await dispatch(
                actions.projectFloorplans.updateFloorPlanStart({
                    id: floorPlanData.id,
                    project_id: propertyId,
                    is_missing_info: true,
                    whatsapp_phone_number: whatsAppNumber,
                    isFromMissingInfo: true,
                }),
            );
        } else {
            await dispatch(
                actions.propertyDetails.updatePropertyStart({
                    property_id: propertyId,
                    input: {
                        is_missing_info: true,
                        whatsapp_phone_number: whatsAppNumber,
                    },
                }),
            );
        }

        setOpenNumberConfirmation(false);
    };

    const sendWhatsappMessage = (areas: any[], whatsAppNumber: string) => {
        dispatch(
            actions.propertyDetails.sendWhatsappMessage({
                input: {
                    property_id: propertyId,
                    property_name: propertyDetails.name,
                    areas: areas,
                    whatsapp_number: whatsAppNumber,
                    created_by: localStorage.getItem("user_id"),
                },
            }),
        );
    };

    const CirCularLoader = () => {
        return (
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress color="primary" />
            </div>
        );
    };

    const isWhatsappUploadEnabled = useFeature(
        FeatureFlagConstants.DATA_UPLOAD_THROUGH_WHATSAPP,
    ).on;

    const checkIfVideo = (fileName?: string) => {
        if (!fileName) return;
        else {
            const fileParts = fileName.split(".").map((x: string) => x.toLowerCase());
            if (["mov", "mp4"].includes(fileParts[fileParts.length - 1])) {
                return true;
            }
            return false;
        }
    };
    const userEmail = localStorage.getItem("email");
    const isFromTailorbirdUS = userEmail && userEmail.endsWith("tailorbird.us");

    const openeDemoVideo = () => {
        window.open(`${process.env.REACT_APP_TB_DEMO_VIDEO_URL}`, "_blank");
        return null;
    };

    return (
        <>
            <CommonDialog
                open={openDeleteConfirmation}
                title={`Are you sure to want delete ?`}
                onClose={() => setOpenDeleteConfirmation(false)}
                onDelete={async () => await DeleteFile(itemToRemove)}
                deleteText={`Are you sure to want delete ?`}
                deleteDialog={true}
                width="40rem"
            />
            <CommonDialog
                open={openNumberConfirmation}
                title={`Consistent Numbering Scheme Across Floorplans`}
                onClose={() => onCancelConsistanyInNumber()}
                onDelete={async () => onConfirmConsistancyInNumber()}
                deleteText={`Do you prefer to retain this number across all floorplans ?`}
                deleteDialog={true}
                width="40rem"
            />
            <Dialog
                open={openModal}
                fullWidth={true}
                maxWidth="md"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onClose={() => modalHandler(false)}
            >
                <DialogTitle>
                    <Box
                        p={5}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        pb={2.5}
                        sx={{ borderBottom: `1px solid ${appTheme.border.inner}` }}
                    >
                        <Typography variant="text_16_medium">
                            {`${
                                !showingAllMissingInfo
                                    ? missingInfoModalDataKey?.title
                                    : propertyTitle
                            } Missing Info`}
                        </Typography>
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
                </DialogTitle>

                <DialogContent style={{ minHeight: "40px" }}>
                    {floorplansLoading && <BaseLoader />}

                    {missingInfo.map((item: any, index: any) => (
                        <Accordion
                            key={`${item?.title}-${index}`}
                            aria-controls={`${item?.title}-${index}`}
                            defaultExpanded={false}
                            style={{
                                marginTop: "1px",
                            }}
                            onClick={() => handleAccordionExpandClick(item?.title)}
                            // expanded={accordionsExpanded[`${item?.title}`]}
                            // aria-expanded={accordionsExpanded[`${item?.title}`]}
                            onChange={() => handleAccordionExpandClick(item?.title)}
                            TransitionProps={{ unmountOnExit: true }}
                        >
                            <AccordionSummary
                                aria-controls={`${item?.title}-content`}
                                id={`${item?.title}-header`}
                                expandIcon={<ArrowDropdown />}
                            >
                                <Typography variant="text_16_semibold">{item.title}</Typography>
                            </AccordionSummary>
                            <Divider />

                            <AccordionDetails style={{ boxShadow: "none", padding: "0" }}>
                                {item?.data?.map((missingDetail: any, index: any) => (
                                    <Box key={`missingDetail-${missingDetail.id}-${index}`}>
                                        {index > 0 && (
                                            <Divider style={{ margin: "0.25rem 0rem" }} />
                                        )}
                                        <Box>
                                            <Grid
                                                container
                                                display={"grid"}
                                                gridAutoFlow={"column"}
                                                justifyContent={"space-between"}
                                                padding={"1.5rem"}
                                                aria-controls={`missingDetail-${missingDetail.id}-${index}`}
                                                key={`missingDetail-${missingDetail.id}-${index}`}
                                            >
                                                <Box
                                                    key={`missingDetail-${missingDetail.id}-${index}-box`}
                                                    aria-controls={`missingDetail-${missingDetail.id}-${index}-box`}
                                                    id={`missingDetail-${missingDetail.id}-${index}-box`}
                                                >
                                                    <Grid
                                                        display={"grid"}
                                                        gridAutoFlow={"column"}
                                                        justifyContent={"space-between"}
                                                        gridTemplateColumns={"0.4fr 0.7fr"}
                                                        width={"100%"}
                                                    >
                                                        <Grid display={"grid"} gridAutoFlow={"row"}>
                                                            <Typography
                                                                variant={"text_16_semibold"}
                                                            >
                                                                {missingDetail.commercial_name ? (
                                                                    <span>
                                                                        <span
                                                                            style={{
                                                                                color: "#000",
                                                                            }}
                                                                        >
                                                                            {
                                                                                missingDetail.commercial_name
                                                                            }
                                                                        </span>
                                                                        {missingDetail.commercial_name !=
                                                                            missingDetail.name && (
                                                                            <span
                                                                                style={{
                                                                                    color: "#969696",
                                                                                }}
                                                                            >
                                                                                {` (${
                                                                                    missingDetail.name ||
                                                                                    "No Name"
                                                                                }) `}
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                ) : (
                                                                    <span
                                                                        style={{
                                                                            color: "#969696",
                                                                        }}
                                                                    >
                                                                        {missingDetail.name ??
                                                                            missingDetail.floorplan_type}
                                                                    </span>
                                                                )}
                                                            </Typography>
                                                            <Typography variant="text_14_regular">
                                                                {missingDetail.takeOffType}
                                                            </Typography>
                                                        </Grid>
                                                        <Box
                                                            display={"flex"}
                                                            justifyContent={"center"}
                                                            alignItems={"center"}
                                                        >
                                                            <Typography variant="text_12_regular">
                                                                {
                                                                    "Use the area below to upload files of missing information. Videos are preferred. Images are also accepted. Multiple files can be added at once."
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    </Grid>

                                                    <Divider style={{ margin: "1rem 0" }} />

                                                    {showFileUpload[missingDetail.id] ? (
                                                        <Box
                                                            alignItems={"center"}
                                                            marginBottom={"12px"}
                                                            position="relative"
                                                        >
                                                            {missingFileUploading &&
                                                                CirCularLoader()}
                                                            <FileUpload
                                                                ref={
                                                                    fileUploadRefs[missingDetail.id]
                                                                }
                                                                accept={
                                                                    ".mp4,.mov,.heic,.png,.jpeg,.jpg"
                                                                }
                                                                isMultiple
                                                                helperText="Accepts .mp4, .mov, .heic, .png, and .jpeg .jpg only"
                                                                onFileChange={(files: any) =>
                                                                    onFileUpload(
                                                                        files,
                                                                        missingDetail.id,
                                                                        item.value,
                                                                    )
                                                                }
                                                                showAsGrid={true}
                                                            />
                                                        </Box>
                                                    ) : missingDetail?.missingInfo?.length > 0 ? (
                                                        <>
                                                            <Grid
                                                                spacing={2}
                                                                width={"100%"}
                                                                style={{
                                                                    cursor: "pointer",
                                                                    overflow: "visible",
                                                                }}
                                                                gridAutoFlow={"row"}
                                                                columnGap={"1.5rem"}
                                                                rowGap={"1.5rem"}
                                                                display={"grid"}
                                                                gridTemplateColumns="repeat(3,1fr)"
                                                                gridTemplateRows={
                                                                    expanded[missingDetail.id]
                                                                        ? `repeat(${Math.ceil(
                                                                              missingDetail
                                                                                  ?.missingInfo
                                                                                  ?.length / 3,
                                                                          )}, 160px)`
                                                                        : "repeat(1, 160px)"
                                                                }
                                                                className="galleryContainer"
                                                            >
                                                                {missingDetail?.missingInfo
                                                                    ?.slice(
                                                                        0,
                                                                        expanded[missingDetail.id]
                                                                            ? missingDetail
                                                                                  .missingInfo
                                                                                  .length
                                                                            : 3,
                                                                    )
                                                                    .map(
                                                                        (
                                                                            fileData: any,
                                                                            index: any,
                                                                        ) => (
                                                                            <Box
                                                                                key={`missingInfo-${index}`}
                                                                                style={{
                                                                                    position:
                                                                                        "relative",
                                                                                    flex: 1,
                                                                                    // maxHeight: "160px",
                                                                                }}
                                                                            >
                                                                                {itemToRemove?.id ==
                                                                                    fileData?.id &&
                                                                                    deleteInProgress &&
                                                                                    CirCularLoader()}
                                                                                {checkIfVideo(
                                                                                    fileData?.file_name,
                                                                                ) ? (
                                                                                    // eslint-disable-next-line jsx-a11y/media-has-caption
                                                                                    <video
                                                                                        controls={
                                                                                            false
                                                                                        }
                                                                                        preload="metadata"
                                                                                        autoPlay={
                                                                                            false
                                                                                        }
                                                                                        onClick={() =>
                                                                                            openPreviewClick(
                                                                                                fileData,
                                                                                            )
                                                                                        }
                                                                                        className="missingvideo"
                                                                                    >
                                                                                        <source
                                                                                            src={`${fileData?.highestResolutionUrl}#t=0.1`}
                                                                                            type="video/mp4"
                                                                                        />
                                                                                    </video>
                                                                                ) : (
                                                                                    <img
                                                                                        alt={
                                                                                            fileData?.file_name
                                                                                        }
                                                                                        className="missingimg"
                                                                                        src={
                                                                                            fileData?.highestResolutionUrl
                                                                                        }
                                                                                        onClick={() =>
                                                                                            openPreviewClick(
                                                                                                fileData,
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                )}
                                                                                <Box
                                                                                    style={{
                                                                                        position:
                                                                                            "absolute",
                                                                                        top: "-12px",
                                                                                        right: "-12px",
                                                                                        backgroundColor:
                                                                                            "#F0F0F0",
                                                                                        height: "24px",
                                                                                        width: "24px",
                                                                                        borderRadius:
                                                                                            "50%",
                                                                                        display:
                                                                                            "flex",
                                                                                        justifyContent:
                                                                                            "center",
                                                                                        alignItems:
                                                                                            "center",
                                                                                    }}
                                                                                >
                                                                                    <DeleteOutlineIcon
                                                                                        style={{
                                                                                            color: "#e1031552",
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                        onClick={() => {
                                                                                            setDeleteItemTakeOffType(
                                                                                                item.value,
                                                                                            );
                                                                                            handleOpenDailog();
                                                                                            setItemToRemove(
                                                                                                fileData,
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                </Box>
                                                                            </Box>
                                                                        ),
                                                                    )}
                                                            </Grid>

                                                            {missingDetail?.missingInfo?.length >
                                                                3 && (
                                                                <Box
                                                                    textAlign={"center"}
                                                                    border={
                                                                        "1px solid var(--v-3-colors-border-normal-subdued, #C9CCCF)"
                                                                    }
                                                                    marginBottom={"12px"}
                                                                    marginTop={"12px"}
                                                                    onClick={() =>
                                                                        handleExpandClick(
                                                                            missingDetail.id,
                                                                        )
                                                                    }
                                                                    style={{
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    {expanded[missingDetail.id] ? (
                                                                        <Grid
                                                                            container
                                                                            justifyContent={
                                                                                "center"
                                                                            }
                                                                        >
                                                                            <ExpandLessIcon />
                                                                            <Typography>
                                                                                Show less
                                                                            </Typography>
                                                                        </Grid>
                                                                    ) : (
                                                                        <Grid
                                                                            container
                                                                            justifyContent={
                                                                                "center"
                                                                            }
                                                                        >
                                                                            <ExpandMoreIcon />
                                                                            <Typography>
                                                                                Show more
                                                                            </Typography>
                                                                        </Grid>
                                                                    )}
                                                                </Box>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <Box
                                                            textAlign={"center"}
                                                            padding={"2rem"}
                                                            border={"1px dashed lightgrey"}
                                                            mt={"1.5rem"}
                                                            mb={"1.5rem"}
                                                        >
                                                            <Typography
                                                                variant="text_16_semibold"
                                                                color={"#00000052"}
                                                            >
                                                                No files uploaded
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    <Box>
                                                        <BaseButton
                                                            onClick={() =>
                                                                handleUploadMoreFilesClick(
                                                                    missingDetail.id,
                                                                )
                                                            }
                                                            label={""}
                                                            type="text"
                                                            endIcon={<UploadIcon />}
                                                        >
                                                            <Typography
                                                                variant="text_12_semibold"
                                                                lineHeight={"16px"}
                                                            >
                                                                Upload more files
                                                            </Typography>
                                                        </BaseButton>

                                                        <BaseButton
                                                            onClick={() =>
                                                                handleshowPreviousFilesClick(
                                                                    missingDetail.id,
                                                                )
                                                            }
                                                            label={""}
                                                            type="text"
                                                            endIcon={<ArrowCircleRignt />}
                                                        >
                                                            <Typography
                                                                variant="text_12_semibold"
                                                                lineHeight={"16px"}
                                                            >
                                                                See previously uploaded files
                                                            </Typography>
                                                        </BaseButton>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            {isWhatsappUploadEnabled && (
                                                <>
                                                    <Divider style={{ margin: "1rem" }} />
                                                    <Grid
                                                        display={"grid"}
                                                        gridAutoFlow={"row"}
                                                        rowGap={"12px"}
                                                        padding={"0px 15px"}
                                                        key={`missingDetail-${missingDetail.id}-${index}-phoneArea`}
                                                    >
                                                        <Box alignItems={"center"} display={"flex"}>
                                                            <Whatsapp />
                                                            <Typography variant="text_14_regular">
                                                                Alternatively, add a number below to
                                                                send and receive as WhatsApp
                                                                messages
                                                            </Typography>
                                                        </Box>
                                                        <Box
                                                            gap={"12px"}
                                                            display={"flex"}
                                                            mb={"1rem"}
                                                        >
                                                            <PhoneInput
                                                                defaultCountry="us"
                                                                value={
                                                                    whatsAppNumbers[
                                                                        missingDetail.id
                                                                    ]
                                                                }
                                                                onChange={(phone) =>
                                                                    handleUpdateWhatsappNumbers(
                                                                        missingDetail.id,
                                                                        phone,
                                                                    )
                                                                }
                                                            />
                                                            <BaseButton
                                                                onClick={() =>
                                                                    onClickSendToWhatsApp(
                                                                        missingDetail,
                                                                    )
                                                                }
                                                                label={""}
                                                                classes={`${
                                                                    whatsAppNumbers[
                                                                        missingDetail.id
                                                                    ] == null ||
                                                                    whatsAppNumbers[
                                                                        missingDetail.id
                                                                    ] == ""
                                                                        ? "primary disabled"
                                                                        : "primary default"
                                                                } `}
                                                                endIcon={<Whatsapp />}
                                                            >
                                                                <Typography variant="text_14_semibold">
                                                                    Send to Whatsapp
                                                                </Typography>
                                                            </BaseButton>
                                                        </Box>
                                                    </Grid>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}

                    <Grid
                        display={"grid"}
                        gridAutoFlow={"row"}
                        rowGap={"12px"}
                        padding={"0px 15px"}
                    >
                        <Box justifyContent={"flex-start"} display={"flex"}>
                            <BaseButton
                                onClick={() =>
                                    isFromTailorbirdUS ? handleVideoClick() : openeDemoVideo()
                                }
                                label={""}
                                endIcon={<PlayCircleOutlined />}
                            >
                                <Typography variant="text_12_semibold">
                                    Best practices for recording good videos
                                </Typography>
                            </BaseButton>
                        </Box>
                    </Grid>
                </DialogContent>
            </Dialog>
            {showPreviewModal && (
                <PreviewModal mediaFile={previewMediaFile} onClose={handleCloseVideo} />
            )}
            <Snackbar
                open={snackbar.open}
                onClose={() => dispatch(actions.common.closeSnack())}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={3000}
            >
                <Alert
                    onClose={() => dispatch(actions.common.closeSnack())}
                    severity={snackbar.variant}
                >
                    <Typography variant="text_16_regular"> {snackbar.message}</Typography>
                </Alert>
            </Snackbar>
        </>
    );
};

export default MissingInfoModal;
