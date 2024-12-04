/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../style";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Grid,
    IconButton,
} from "@mui/material";
import appTheme from "styles/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ReactComponent as CounterTops } from "../../../assets/icons/counter-tops.svg";
import { ReactComponent as EllipseBlue } from "../../../assets/icons/blue-ellipse.svg";
import { useAppSelector } from "stores/hooks";
import { map } from "lodash";
import { useParams } from "react-router-dom";
import ForgeViewer from "./forge-viewer-docking-panel";
import ContentPlaceholder from "components/content-placeholder";
import MinimizableCard from "./minimizable-card";
import Loader from "modules/admin-portal/common/loader";
import { InfoCard } from "./missing-info-modals/info-card";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";
import { ReactComponent as Apartment } from "../../../assets/icons/apartment.svg";
import { ReactComponent as Pool } from "../../../assets/icons/pool.svg";
import { ReactComponent as Mountains } from "../../../assets/icons/mountains.svg";
import TableDetailedStat from "./table-detailed-stats";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const ForgeViewerPanels = ({
    openMissingInfoModal,
    setShowingAllMissingInfo,
    forgeMissingDetailTypesObj,
}: any) => {
    const { propertyId } = useParams();
    const [projectViewsCopy, setProjectViewsCopy]: any = useState([]);
    const {
        projectViews,
        loading,
        floorplans,
        propertyDetailStats,
        propertyDetailStatsForAllUnits,
    }: any = useAppSelector((state) => ({
        loading: state.propertiesConsumer.projectViews.loading,
        projectViews: state.propertiesConsumer.projectViews.data,
        floorplans: state.projectFloorplans.floorplans.data,
        propertyDetailStats: state.propertiesConsumer.propertyDetailStats,
        propertyDetailStatsForAllUnits: state.propertiesConsumer.propertyDetailStatsForAllUnits,
    }));
    // Define state variables for sort criteria and order
    const [sortOrder, setSortOrder] = useState("asc"); // Default sort order ascending

    const effectTriggeredRef = React.useRef(false);
    // Function to update the sort logic based on sort by parameter and order
    const updateSortLogic = (data: any, sortOn: any) => {
        return data.sort((a: any, b: any) => {
            if (sortOn === "FLOORPLAN") {
                return sortOrder === "asc"
                    ? (a.commercial_name || "").localeCompare(b.commercial_name || "")
                    : (b.commercial_name || "").localeCompare(a.commercial_name || "");
            } else {
                return sortOrder === "asc"
                    ? (a.name || "").localeCompare(b.name || "")
                    : (b.name || "").localeCompare(a.name || "");
            }
        });
    };
    // Toggle between ascending and descending order
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    // const mergedProjectViews = () => {
    //     let projectViewClone = [...projectViews];
    //     projectViewClone.forEach((projectView: { data: any }) => {
    //         if (projectView.data.length > 0) {
    //             projectView.data.forEach((floorPlan: { flooplan_id: any; views: any[] }) => {
    //                 if (floorPlan.flooplan_id) {
    //                     console.log("floorPlan.floorplan_id", floorPlan);
    //                     const details = propertyDetailStats.propertyDetailStat.get(
    //                         floorPlan.flooplan_id,
    //                     );
    //                     let view =
    //                         floorPlan.views.find(function (view) {
    //                             return view.view_alias == "FULL UNIT";
    //                         }) || [];
    //                 }
    //             });
    //         }
    //     });
    // };
    const [currentSelections, setCurrentSelections]: any = useState(null);

    const updateCurrentSelection = (incomingSelection: any) => {
        setCurrentSelections((prevState: any) => {
            return {
                ...prevState,
                [incomingSelection.dataKey]: {
                    ...prevState?.[incomingSelection.dataKey],
                    ...incomingSelection,
                },
            };
        });
    };

    const isPropertyDataUploadOn = useFeature(FeatureFlagConstants.PROPERTY_MISSING_DATA_UPLOAD).on;
    const iconMap: any = {
        FLOORPLAN: <CounterTops />,
        BUILDING: <Apartment />,
        COMMON_AREA: <Pool />,
        SITE: <Mountains />,
    };

    const isInteriorDetailedStatsEnabled = useFeature(
        FeatureFlagConstants.INTERIOR_DETAILED_STATS_ENABLED,
    ).on;
    const isExteriorDetailedStatsEnabled = useFeature(
        FeatureFlagConstants.EXTERIOR_DETAILED_STATS_ENABLED,
    ).on;
    const isCommonAreaDetailedStatsEnabled = useFeature(
        FeatureFlagConstants.COMMON_AREA_DETAILED_STATS_ENABLED,
    ).on;

    // Define feature flags based on enabled/disabled status
    const featureFlagData: any = {
        FLOORPLAN: isInteriorDetailedStatsEnabled,
        BUILDING: isExteriorDetailedStatsEnabled,
        COMMON_AREA: isCommonAreaDetailedStatsEnabled,
        SITE: false,
    };

    // Use useEffect to update project views based on floorplans and property details
    useEffect(() => {
        const viewsCopy = projectViews.map((pView: any) => {
            // Filter matching floorplans based on takeOffType
            const matchingFloorplans = floorplans.filter(
                (fp: any) => fp.takeOffType === pView.dataKey,
            );
            const existingIds = pView.data.map((item: any) => item.flooplan_id);
            // Find non-matching floorplans
            const nonMatchingFloorplans = matchingFloorplans.filter(
                (fp: any) => !existingIds.includes(fp.id),
            );
            // Create new items for non-matching floorplans
            const newItems = nonMatchingFloorplans.map((item: any) => ({
                flooplan_id: item.id,
                views: [],
                name: item.name,
                floorplan_type: item.type,
                urn: null,
                isHavingMissingInfo: item.isHavingMissingInfo,
                commercial_name: item.commercial_name,
                // property_detail_stats: propertyDetailStats?.propertyDetailStat?.get(item.id),
            }));
            let pviewCopy = JSON.parse(JSON.stringify(pView));
            let x = {
                ...pviewCopy,
                data: [
                    ...pviewCopy.data.map((item: any) => ({
                        ...item,
                        name: matchingFloorplans.find((mfp: any) => mfp.id == item.flooplan_id)
                            ?.name,
                    })),
                    ...newItems,
                ],
            };
            // Add default object for FLOORPLAN dataKey
            if (pView.dataKey === "FLOORPLAN" && featureFlagData[pView.dataKey]) {
                x.data.unshift({
                    name: "All Units",
                    views: [
                        {
                            view_alias: "Detailed Stats",
                            views: null,
                            detailed_view: true,
                            property_detail_stats: propertyDetailStatsForAllUnits,
                        },
                    ],
                    // other keys can be added here if necessary
                });
            }
            x.data.forEach((projectViews: { views: any[]; flooplan_id: string }) => {
                const property_detail_stat = propertyDetailStats?.propertyDetailStat.get(
                    projectViews.flooplan_id,
                );
                // Check if property detail stats exist and feature flag is enabled for the current data key
                if (property_detail_stat && featureFlagData[pView.dataKey]) {
                    let view =
                        projectViews.views.find(function (view: { view_alias: string }) {
                            return view.view_alias == "FULL UNIT";
                        }) || null;
                    if (!view) {
                        view = {
                            view_alias: "FULL UNIT",
                            views: [],
                        };
                        if (!projectViews.views) {
                            projectViews.views = [];
                        }

                        projectViews.views = [...projectViews.views, view];
                    }
                    view.views = [
                        ...view.views,
                        {
                            view_alias: "Detailed Stats",
                            views: [],
                            property_detail_stats: property_detail_stat,
                            detailed_view: true,
                        },
                    ];
                }
            });
            return x;
        });
        setProjectViewsCopy(viewsCopy);
    }, [floorplans, projectViews, propertyDetailStats, propertyDetailStatsForAllUnits]);
    console.log("currentSelections", currentSelections);

    React.useEffect(() => {
        if (!effectTriggeredRef.current && projectViews && propertyDetailStats) {
            effectTriggeredRef.current = true;
            // mergedProjectViews();
        }
    }, [propertyDetailStats, projectViews]);
    //required to debug
    console.log("projectViewsCopy", projectViewsCopy);

    return (
        <Box pt={4} mb={8}>
            {loading && <Loader />}
            {projectViewsCopy.map((pView: any, index: any) => (
                <Accordion
                    key={`${pView.dataKey}-accordion-${index}`}
                    defaultExpanded={false}
                    style={{
                        marginTop: "1px",
                        border: "1px solid #EEEEEE",
                    }}
                    id={`${pView.dataKey}-accordion-${index}`}
                >
                    <AccordionSummary
                        expandIcon={
                            <ExpandMoreIcon
                                style={{
                                    color: appTheme.scopeHeader.label,
                                }}
                            />
                        }
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        style={{ paddingLeft: "16px" }}
                    >
                        {iconMap[pView.dataKey]}
                        &nbsp;&nbsp;&nbsp;
                        <Typography variant="text_16_regular">{pView.title}</Typography>
                    </AccordionSummary>
                    <Divider />
                    {!pView?.data?.length && (
                        <ContentPlaceholder
                            text={"information not yet available"}
                            aText={""}
                            height="250px"
                        />
                    )}
                    {pView?.data?.length > 0 && (
                        <AccordionDetails>
                            <Grid container display={"flex"} flex={1}>
                                <Grid
                                    container
                                    display={"content"}
                                    alignItems={"flex-start"}
                                    width={"fit-content"}
                                >
                                    {pView.data && (
                                        <MinimizableCard
                                            prokey={`${pView.dataKey}-card1Data`}
                                            sx={{
                                                boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.10)",
                                                minHeight: "500px",
                                                maxHeight: "60vh",
                                                overflowY: "auto",
                                                alignSelf: "stretch",
                                            }}
                                        >
                                            <Box
                                                mt={2}
                                                p={2}
                                                mb={"16px"}
                                                display="flex"
                                                flexDirection={"column"}
                                                alignItems="center"
                                            >
                                                <Box display="flex" alignItems="center">
                                                    <Typography
                                                        variant="text_16_medium"
                                                        color={"#000"}
                                                    >
                                                        {pView.subTitleForCard1}
                                                    </Typography>
                                                    <Box ml={1}>
                                                        <IconButton onClick={toggleSortOrder}>
                                                            {sortOrder === "asc" ? (
                                                                <ArrowUpwardIcon />
                                                            ) : (
                                                                <ArrowDownwardIcon />
                                                            )}
                                                        </IconButton>
                                                    </Box>
                                                </Box>

                                                {map(
                                                    updateSortLogic(pView.data, pView.dataKey),
                                                    (answer, index) => {
                                                        const isSelected =
                                                            currentSelections &&
                                                            currentSelections[
                                                                pView.dataKey
                                                            ]?.breadCrumb?.includes(
                                                                answer?.name ??
                                                                    answer.floorplan_type,
                                                            );

                                                        return (
                                                            <Box
                                                                key={index}
                                                                padding={"12px 0px"}
                                                                mb={1}
                                                                display="flex"
                                                                flexDirection={"column"}
                                                                alignItems="center"
                                                                minWidth={"175px"}
                                                                textAlign={"center"}
                                                                style={{
                                                                    borderRadius: isSelected
                                                                        ? "8px 8px 0px 0px"
                                                                        : "0px",
                                                                    borderBottom: isSelected
                                                                        ? "2px solid #004D71"
                                                                        : "none",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => {
                                                                    let breadCrumb = [
                                                                        answer?.name ??
                                                                            answer?.floorplan_type,
                                                                    ];
                                                                    const isHavingFullUnitinchildViews =
                                                                        answer?.views?.filter(
                                                                            (viewinfo: any) =>
                                                                                viewinfo.view_alias
                                                                                    ?.toLowerCase()
                                                                                    ?.includes(
                                                                                        "full",
                                                                                    ),
                                                                        )?.length > 0;

                                                                    const FullUnitChildViewItem =
                                                                        answer?.views?.find(
                                                                            (viewinfo: any) =>
                                                                                viewinfo?.view_alias
                                                                                    ?.toLowerCase()
                                                                                    ?.includes(
                                                                                        "full",
                                                                                    ) ||
                                                                                viewinfo?.view_alias
                                                                                    ?.toLowerCase()
                                                                                    ?.includes(
                                                                                        "3d",
                                                                                    ),
                                                                        );
                                                                    const FullUnitChildView3dItem =
                                                                        FullUnitChildViewItem &&
                                                                        FullUnitChildViewItem?.views?.find(
                                                                            (viewinfo: any) =>
                                                                                viewinfo?.view_alias
                                                                                    ?.toLowerCase()
                                                                                    ?.includes(
                                                                                        "3d",
                                                                                    ),
                                                                        );

                                                                    let updatedBreadCrumb = [
                                                                        ...breadCrumb,
                                                                        FullUnitChildViewItem?.view_alias,
                                                                        FullUnitChildView3dItem &&
                                                                            `${FullUnitChildView3dItem?.view_alias}-${FullUnitChildView3dItem?.guid}`,
                                                                    ];

                                                                    const guidValue =
                                                                        isHavingFullUnitinchildViews
                                                                            ? FullUnitChildView3dItem?.guid
                                                                            : FullUnitChildViewItem?.guid ||
                                                                              answer?.guid;
                                                                    const isCommonArea =
                                                                        pView.dataKey ==
                                                                        "COMMON_AREA";
                                                                    let selectionObj = {
                                                                        card2Data: answer?.views
                                                                            ?.length
                                                                            ? answer?.views
                                                                            : null,

                                                                        card3Data:
                                                                            FullUnitChildViewItem?.views ||
                                                                            null,
                                                                        breadCrumb:
                                                                            updatedBreadCrumb,
                                                                        guid: guidValue,
                                                                    };
                                                                    // Refactored code
                                                                    if (isCommonArea) {
                                                                        console.log(
                                                                            "isHavingFullUnitinchildViews",
                                                                            answer?.views,
                                                                            answer,
                                                                        );
                                                                        const card3AutoFilteredItem =
                                                                            answer?.views?.find(
                                                                                (cardItem: any) =>
                                                                                    [
                                                                                        answer.floorplan_type,
                                                                                        answer.commercial_name,
                                                                                        answer.name,
                                                                                    ]
                                                                                        ?.map(
                                                                                            (
                                                                                                name,
                                                                                            ) =>
                                                                                                name
                                                                                                    ?.toLowerCase()
                                                                                                    ?.trim(),
                                                                                        )
                                                                                        ?.includes(
                                                                                            cardItem.view_alias
                                                                                                ?.toLowerCase()
                                                                                                ?.trim(),
                                                                                        ),
                                                                            ) || null;

                                                                        selectionObj.card2Data =
                                                                            null;
                                                                        selectionObj.card3Data =
                                                                            card3AutoFilteredItem?.views ||
                                                                            null;

                                                                        const c3Item =
                                                                            card3AutoFilteredItem?.views?.find(
                                                                                (c3Item: any) =>
                                                                                    c3Item?.view_alias
                                                                                        ?.toLowerCase()
                                                                                        ?.includes(
                                                                                            "3d",
                                                                                        ),
                                                                            );

                                                                        selectionObj.breadCrumb = [
                                                                            ...updatedBreadCrumb,
                                                                            `${c3Item?.view_alias}-${c3Item?.guid}`,
                                                                        ];

                                                                        selectionObj.guid =
                                                                            c3Item?.guid;
                                                                    }
                                                                    updateCurrentSelection({
                                                                        dataKey: pView.dataKey,
                                                                        // breadCrumb: updatedBreadCrumb,
                                                                        // guid: guidValue,
                                                                        // card2Data: answer?.views?.length
                                                                        //     ? answer?.views
                                                                        //     : null,
                                                                        // card3Data:
                                                                        //     FullUnitChildViewItem?.views ||
                                                                        //     null,
                                                                        ...selectionObj,
                                                                        urn:
                                                                            answer?.urn ||
                                                                            "not available",
                                                                        property_detail_stats:
                                                                            answer?.property_detail_stats ||
                                                                            null,
                                                                        isAllUnits:
                                                                            answer.name ==
                                                                            "All Units",
                                                                    });
                                                                }}
                                                            >
                                                                <Grid
                                                                    display={"grid"}
                                                                    gridAutoFlow={"column"}
                                                                    columnGap={"0.5rem"}
                                                                    alignItems={"center"}
                                                                >
                                                                    <Typography
                                                                        variant={"text_14_medium"}
                                                                    >
                                                                        {/* commercial name only to the type FLOORPLAN (INterior) */}
                                                                        {answer.commercial_name &&
                                                                        pView.dataKey ==
                                                                            "FLOORPLAN" ? (
                                                                            <span>
                                                                                <span
                                                                                    style={{
                                                                                        color: isSelected
                                                                                            ? "#000"
                                                                                            : "#969696",
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        answer.commercial_name
                                                                                    }
                                                                                </span>
                                                                                {answer.commercial_name !=
                                                                                    answer.name && (
                                                                                    <span
                                                                                        style={{
                                                                                            color: isSelected
                                                                                                ? "#000"
                                                                                                : "#969696",
                                                                                        }}
                                                                                    >
                                                                                        {`(${
                                                                                            answer.name ||
                                                                                            "No Text"
                                                                                        })`}
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        ) : (
                                                                            <span
                                                                                style={{
                                                                                    color: isSelected
                                                                                        ? "#000"
                                                                                        : "#969696",
                                                                                }}
                                                                            >
                                                                                {answer.name ||
                                                                                    answer.floorplan_type ||
                                                                                    "No Text"}
                                                                            </span>
                                                                        )}
                                                                    </Typography>
                                                                    {answer?.isHavingMissingInfo &&
                                                                        isPropertyDataUploadOn && (
                                                                            <EllipseBlue />
                                                                        )}
                                                                </Grid>
                                                            </Box>
                                                        );
                                                    },
                                                )}
                                            </Box>
                                        </MinimizableCard>
                                    )}
                                    {currentSelections &&
                                        currentSelections[pView?.dataKey]?.card2Data && (
                                            <MinimizableCard
                                                prokey={`${pView?.dataKey}-card2Data`}
                                                sx={{
                                                    boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.10)",
                                                    minHeight: "500px",
                                                    maxHeight: "60vh",
                                                    overflowY: "auto",
                                                    alignSelf: "stretch",
                                                }}
                                            >
                                                <Box
                                                    mt={2}
                                                    mb={"16px"}
                                                    p={2}
                                                    display="flex"
                                                    flexDirection={"column"}
                                                    alignItems="center"
                                                >
                                                    {currentSelections &&
                                                        currentSelections[
                                                            pView?.dataKey
                                                        ]?.card2Data?.map(
                                                            (item: any, index: any) => {
                                                                const isSelected =
                                                                    currentSelections &&
                                                                    currentSelections[
                                                                        pView.dataKey
                                                                    ]?.breadCrumb?.includes(
                                                                        item.view_alias,
                                                                    );
                                                                return (
                                                                    <Box
                                                                        key={`${item.space}`}
                                                                        padding={"12px 0px"}
                                                                        mb={1}
                                                                        display="flex"
                                                                        flexDirection={"column"}
                                                                        alignItems="center"
                                                                        minWidth={"175px"}
                                                                        textAlign={"center"}
                                                                        style={{
                                                                            borderRadius: isSelected
                                                                                ? "8px 8px 0px 0px"
                                                                                : "0px",
                                                                            borderBottom: isSelected
                                                                                ? "2px solid #004D71"
                                                                                : "none",
                                                                            cursor: "pointer",
                                                                        }}
                                                                        onClick={() => {
                                                                            const { breadCrumb } =
                                                                                currentSelections?.[
                                                                                    pView.dataKey
                                                                                ] || {};
                                                                            let updatedBreadCrumb =
                                                                                breadCrumb
                                                                                    ? breadCrumb
                                                                                          .slice(
                                                                                              0,
                                                                                              1,
                                                                                          )
                                                                                          .concat(
                                                                                              item.view_alias,
                                                                                          )
                                                                                    : [];
                                                                            const isHaving3DinchildViews =
                                                                                item?.views?.filter(
                                                                                    (
                                                                                        viewinfo: any,
                                                                                    ) =>
                                                                                        viewinfo.view_alias
                                                                                            ?.toLowerCase()
                                                                                            ?.includes(
                                                                                                "3d",
                                                                                            ),
                                                                                )?.length > 0;
                                                                            const ChildView3dItem =
                                                                                item?.views?.find(
                                                                                    (
                                                                                        viewinfo: any,
                                                                                    ) =>
                                                                                        viewinfo?.view_alias
                                                                                            ?.toLowerCase()
                                                                                            ?.includes(
                                                                                                "3d",
                                                                                            ),
                                                                                );
                                                                            if (
                                                                                isHaving3DinchildViews
                                                                            ) {
                                                                                updatedBreadCrumb =
                                                                                    [
                                                                                        ...updatedBreadCrumb,

                                                                                        ChildView3dItem?.view_alias,
                                                                                    ];
                                                                            }
                                                                            const guidValue =
                                                                                isHaving3DinchildViews
                                                                                    ? ChildView3dItem?.guid
                                                                                    : item?.guid;
                                                                            updateCurrentSelection({
                                                                                breadCrumb:
                                                                                    updatedBreadCrumb,
                                                                                dataKey:
                                                                                    pView.dataKey,
                                                                                guid: guidValue,
                                                                                property_detail_stats:
                                                                                    item?.property_detail_stats ||
                                                                                    null,
                                                                                card3Data:
                                                                                    item.views,
                                                                            });
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant={
                                                                                "text_14_medium"
                                                                            }
                                                                            color={
                                                                                isSelected
                                                                                    ? "#000"
                                                                                    : "#969696"
                                                                            }
                                                                        >
                                                                            {item.view_alias}
                                                                        </Typography>
                                                                    </Box>
                                                                );
                                                            },
                                                        )}
                                                </Box>
                                            </MinimizableCard>
                                        )}
                                    {currentSelections &&
                                        currentSelections[pView.dataKey]?.card3Data && (
                                            <MinimizableCard
                                                prokey={`${pView.dataKey}-card3Data`}
                                                sx={{
                                                    boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.10)",
                                                    minHeight: "500px",
                                                    maxHeight: "60vh",
                                                    overflowY: "auto",
                                                    alignSelf: "stretch",
                                                }}
                                            >
                                                <Box
                                                    mt={2}
                                                    mb={"16px"}
                                                    p={2}
                                                    display="flex"
                                                    flexDirection={"column"}
                                                    alignItems="center"
                                                >
                                                    {currentSelections &&
                                                        currentSelections[
                                                            pView.dataKey
                                                        ]?.card3Data?.map(
                                                            (item: any, index: any) => {
                                                                const isSelected =
                                                                    currentSelections &&
                                                                    currentSelections[
                                                                        pView.dataKey
                                                                    ]?.breadCrumb?.includes(
                                                                        item.guid
                                                                            ? `${item.view_alias}-${item.guid}`
                                                                            : item.view_alias,
                                                                    );

                                                                return (
                                                                    <Box
                                                                        key={`${item.space}`}
                                                                        padding={"12px 0px"}
                                                                        mb={1}
                                                                        display="flex"
                                                                        flexDirection={"column"}
                                                                        alignItems="center"
                                                                        minWidth={"175px"}
                                                                        textAlign={"center"}
                                                                        style={{
                                                                            borderRadius: isSelected
                                                                                ? "8px 8px 0px 0px"
                                                                                : "0px",
                                                                            borderBottom: isSelected
                                                                                ? "2px solid #004D71"
                                                                                : "none",
                                                                            cursor: "pointer",
                                                                        }}
                                                                        onClick={() => {
                                                                            const { breadCrumb } =
                                                                                currentSelections?.[
                                                                                    pView.dataKey
                                                                                ] || {};
                                                                            const updatedBreadCrumb =
                                                                                breadCrumb
                                                                                    ? breadCrumb
                                                                                          .slice(
                                                                                              0,
                                                                                              2,
                                                                                          )
                                                                                          .concat(
                                                                                              item.guid
                                                                                                  ? `${item.view_alias}-${item.guid}`
                                                                                                  : item.view_alias,
                                                                                          )
                                                                                    : [];
                                                                            updateCurrentSelection({
                                                                                breadCrumb:
                                                                                    updatedBreadCrumb,
                                                                                dataKey:
                                                                                    pView.dataKey,
                                                                                guid:
                                                                                    item.guid ||
                                                                                    null,
                                                                                property_detail_stats:
                                                                                    item?.property_detail_stats ||
                                                                                    null,
                                                                            });
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant={
                                                                                "text_14_medium"
                                                                            }
                                                                            color={
                                                                                isSelected
                                                                                    ? "#000"
                                                                                    : "#969696"
                                                                            }
                                                                        >
                                                                            {item.view_alias}
                                                                        </Typography>
                                                                    </Box>
                                                                );
                                                            },
                                                        )}
                                                </Box>
                                            </MinimizableCard>
                                        )}
                                </Grid>
                                {currentSelections &&
                                currentSelections[pView.dataKey] &&
                                currentSelections[pView.dataKey]?.breadCrumb?.some((item: string) =>
                                    item?.includes("Detailed Stats"),
                                ) &&
                                currentSelections[pView.dataKey]?.property_detail_stats ? (
                                    <TableDetailedStat
                                        data={
                                            currentSelections[pView.dataKey]?.property_detail_stats
                                        }
                                        prokey={pView.dataKey}
                                        currentSelection={currentSelections[pView.dataKey]}
                                    />
                                ) : (
                                    <ForgeViewer
                                        DockingPanel
                                        prokey={pView.dataKey}
                                        interUnitInfo={
                                            (currentSelections &&
                                                currentSelections[pView?.dataKey]) ||
                                            null
                                        }
                                    />
                                )}
                            </Grid>
                        </AccordionDetails>
                    )}

                    <div className="info-card-container">
                        {forgeMissingDetailTypesObj[pView.warnCarditle] > 0 &&
                            isPropertyDataUploadOn && (
                                <InfoCard
                                    type={pView.title}
                                    forgeMissingDetailTypesObj={
                                        forgeMissingDetailTypesObj[pView.warnCarditle]
                                    }
                                    dataKey={pView.dataKey}
                                    openMissingInfoModal={openMissingInfoModal}
                                    setShowingAllMissingInfo={setShowingAllMissingInfo}
                                    isCombined={false}
                                />
                            )}
                    </div>
                </Accordion>
            ))}
        </Box>
    );
};

export default ForgeViewerPanels;
