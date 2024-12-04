import React, { useCallback, useEffect, useState /*useState, useMemo*/ } from "react";
import { Typography, Grid, styled, Box, Button } from "@mui/material";
import FloorPlanTable from "./floor-plan-table";
import { useAppSelector } from "../../../../stores/hooks";
import { isEmpty } from "lodash";
import TakeOffUploadButton from "modules/projects/details/projects-overview/take-off-upload";
import { gql, useQuery } from "@apollo/client";
import { wsclient } from "stores/gql-client";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FloorPlanMediaTable from "./floorplan-media-table";

const TitleSection = styled(Box)({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderBottom: "1px solid #DFE0EB",
});

const GET_DATASOURCE_FILE_PROPERTY_STATUS = gql`
    query GetDataSourceStatusForProperty($propertyId: String, $takeOffType: String) {
        getDataSourceStatusForProperty(property_id: $propertyId, take_off_type: $takeOffType) {
            status
        }
    }
`;

const SUBSCRIBE_DATASOURCE_FILE_PROPERTY_STATUS = {
    query: `subscription SubscribeDataSourceStatusForProperty($propertyId: String, $takeOffType: String) {
        SubscribeDataSourceStatusForProperty(
            property_id: $propertyId
            take_off_type: $takeOffType
        ) {
            status
        }
    }
`,
};

const CommonTable = (props: any) => {
    const { selectedItemForImageVideoMode } = props;

    // const unitMixDetail = { totalUnits: 1, totalRenoUnits: 1 };
    const [fpTakeOffStatus, setFloorplanTakeoffStatus] = useState<string | null>(null);
    const [buildingTakeOffStatus, setBuildingTakeoffStatus] = useState<string | null>(null);
    const [commonareaTakeOffStatus, setCommonareaTakeoffStatus] = useState<string | null>(null);
    const [isDisabled, setDisabled] = useState<boolean>(false);
    const { floorplans /*propertyDetails*/ } = useAppSelector((state) => {
        return {
            floorplans: state.projectFloorplans.floorplans,
            // propertyDetails: state.propertyDetails.data,
        };
    });
    const { propertyId } = useParams();

    const {
        data: florplanDatasourceStatus,
        loading: florplanDatasourceLoading,
        refetch: refetchFloorplanDatasourceStatus,
    } = useQuery(GET_DATASOURCE_FILE_PROPERTY_STATUS, {
        variables: {
            propertyId,
            takeOffType: "FLOORPLAN",
        },
        // pollInterval: 5000,
    });
    const {
        data: buildingDatasourceStatus,
        loading: buildingDatasourceLoading,
        refetch: refetchBuildingDatasourceStatus,
    } = useQuery(GET_DATASOURCE_FILE_PROPERTY_STATUS, {
        variables: {
            propertyId,
            takeOffType: "BUILDING",
        },
        // pollInterval: 5000,
    });
    const {
        data: commonareaDatasourceStatus,
        loading: commonareaDatasourceLoading,
        refetch: refetchCommonareaDatasourceStatus,
    } = useQuery(GET_DATASOURCE_FILE_PROPERTY_STATUS, {
        variables: {
            propertyId,
            takeOffType: "COMMON_AREA",
        },
        // pollInterval: 5000,
    });

    const setDatasourceStatus = useCallback(
        (takeOffType: string) => {
            switch (takeOffType) {
                case "FLOORPLAN":
                    refetchFloorplanDatasourceStatus();
                    break;
                // return setFloorplanTakeoffStatus(status);
                case "BUILDING":
                    refetchBuildingDatasourceStatus();
                    break;
                // return setBuildingTakeoffStatus(status);
                case "COMMON_AREA":
                    refetchCommonareaDatasourceStatus();
                // return setCommonareaTakeoffStatus(status);
            }
        },
        [
            refetchFloorplanDatasourceStatus,
            refetchBuildingDatasourceStatus,
            refetchCommonareaDatasourceStatus,
        ],
    );

    useEffect(() => {
        const unsubscribe = wsclient.subscribe(
            {
                ...SUBSCRIBE_DATASOURCE_FILE_PROPERTY_STATUS,
                variables: {
                    propertyId,
                    takeOffType: props.takeOffType,
                },
            },
            {
                next: ({ data }: any) => {
                    // This function is called for every event received from the server
                    console.log(
                        data?.SubscribeDataSourceStatusForProperty?.status,
                        "SUBSCRIBE_DATASOURCE_FILE_PROPERTY_STATUS",
                    );
                    setDisabled(false);
                    // const status = data?.SubscribeDataSourceStatusForProperty?.status;
                    setDatasourceStatus(props.takeOffType);
                },
                error: (error: any) => {
                    // Called when an error occurs
                    console.error(error);
                },
                complete: () => {
                    // Called when the server signals that there will be no more events
                    console.log("Subscription is completed");
                },
            },
        );

        return () => {
            unsubscribe();
        };
    }, [propertyId, props.takeOffType, setDatasourceStatus]);

    useEffect(() => {
        if (florplanDatasourceStatus) {
            setFloorplanTakeoffStatus(
                florplanDatasourceStatus.getDataSourceStatusForProperty?.status,
            );
        }
    }, [florplanDatasourceStatus, florplanDatasourceLoading]);
    useEffect(() => {
        if (buildingDatasourceStatus) {
            setBuildingTakeoffStatus(
                buildingDatasourceStatus.getDataSourceStatusForProperty?.status,
            );
        }
    }, [buildingDatasourceStatus, buildingDatasourceLoading]);
    useEffect(() => {
        if (commonareaDatasourceStatus) {
            setCommonareaTakeoffStatus(
                commonareaDatasourceStatus.getDataSourceStatusForProperty?.status,
            );
        }
    }, [commonareaDatasourceStatus, commonareaDatasourceLoading]);

    const isUploadDisable = (take_off_type: string): boolean => {
        if (isDisabled) {
            return true;
        }
        switch (take_off_type) {
            case "FLOORPLAN":
                return fpTakeOffStatus === "progress";
            case "BUILDING":
                return buildingTakeOffStatus === "progress";
            case "COMMON_AREA":
                return commonareaTakeOffStatus === "progress";
            default:
                return false;
        }
    };

    const getTakeOffTypeName = (takeOffType: string) => {
        switch (takeOffType) {
            case "FLOORPLAN":
                return "Floorplan";
            case "BUILDING":
                return "Building";
            case "SITE":
                return "Site Details";
            default:
                return "Common Area";
        }
    };
    return (
        <Grid container px={10} sx={{ paddingTop: "30px" }}>
            <Grid item md={12} pb={4}>
                <TitleSection className="title-section">
                    <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
                        <Box display={"flex"} alignItems={"center"} gap={"1rem"}>
                            {selectedItemForImageVideoMode && (
                                <Button
                                    variant="text"
                                    onClick={() => {
                                        props.handleSetSelectedItemForMedia(
                                            null,
                                            props.takeOffType,
                                        );
                                    }}
                                    startIcon={<ArrowBackIcon />}
                                    sx={{
                                        fontSize: "0.875rem",
                                        fontWeight: "600",
                                    }}
                                >
                                    Go back to all{" "}
                                    <span style={{ marginLeft: "2px", textTransform: "lowercase" }}>
                                        {props.takeOffType
                                            .split("_")
                                            .map(
                                                (word: string) =>
                                                    word.charAt(0).toUpperCase() + word.slice(1),
                                            )
                                            .join(" ")}
                                    </span>
                                </Button>
                            )}
                            <Typography
                                sx={{
                                    borderBottom: "3px solid #57B6B2",
                                }}
                                variant="text_18_semibold"
                            >
                                {selectedItemForImageVideoMode
                                    ? "Images and Videos"
                                    : getTakeOffTypeName(props.takeOffType)}
                            </Typography>
                        </Box>
                        {props.takeOffType != "SITE" && (
                            <Box mb={1}>
                                <TakeOffUploadButton
                                    disabled={isUploadDisable(props.takeOffType)}
                                    take_off_type={props.takeOffType}
                                    setDisabled={setDisabled}
                                />
                            </Box>
                        )}
                    </Box>
                </TitleSection>
            </Grid>
            {!isEmpty(floorplans.data) && (
                <>
                    {selectedItemForImageVideoMode ? (
                        <FloorPlanMediaTable
                            selectedFloorPlanImageVideoMode={selectedItemForImageVideoMode}
                        />
                    ) : (
                        <FloorPlanTable
                            handleSetSelectedItemForMedia={props.handleSetSelectedItemForMedia}
                            takeOffType={props.takeOffType}
                        />
                    )}
                </>
            )}
        </Grid>
    );
};

export default React.memo(CommonTable);
