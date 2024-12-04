/* eslint-disable*/
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "stores/hooks";
import React, { useEffect, useMemo, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BaseAccordion from "components/base-accordion";
import BasicTabs from "components/basic-tabs";
import FloorplanSummary from "../floorplan-summary";
import NavBar from "../pricing-entry-table/components/navBar";
import useIsAgreement from "../pricing-entry-table/hooks/useIsAgreement";
import actions from "stores/actions";
import { useDispatch } from "react-redux";
import { ROUTES } from "../common/constants";
import PriceDataGrid from "../pricing-entry-table/components/price-data-grid";
import HeaderComponent from "../pricing-entry-table/components/header-component";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";
import {
    convertCombinedBidItemsToTreeData,
    transformDataToHierarchy,
} from "../pricing-entry-table/constants";

interface CategoryTable {
    category: string;
    idx: number;
    groupedBidItems: any;
    projectDetails: any;
    getDescriptionById: any;
    orgContainerId: null;
    bidItemsUpdated: any;
    currentRenoversion: any;
    expanded: string[];
    setExpanded: any;
}

const CategoryTable = ({
    category,
    idx,
    groupedBidItems,
    projectDetails,
    getDescriptionById,
    orgContainerId,
    bidItemsUpdated,
    currentRenoversion,
    expanded,
    setExpanded,
}: CategoryTable) => {
    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = React.useState<any[]>([]);
    const [selectedRowsData, setSelectedRowsData] = useState<any[]>([]);
    let { floorplanName, projectId, role, userID } = useParams();
    const navState = useLocation().state as any;
    userID = navState?.isAdminAccess ? userID : localStorage.getItem("user_id") ?? undefined;
    const { state } = useLocation() as any;
    const enableCombineLineItems = useFeature(FeatureFlagConstants.COMBINE_LINE_ITEMS).on;
    const [items, setItems] = useState<any>([]);
    const [syncTimeout, setSyncTimeout] = useState(false);
    const [comboPromptState, setComboPromptState] = useState<{
        open: boolean;
        selectedItemId?: string;
        params?: any;
    }>({
        open: false,
    });
    const {
        //groupedBidItems,
        floorplans,
        isEditable,
        isIdle,
        isOffline,
        //bidItemsUpdated,
    } = useAppSelector((state) => ({
        //groupedBidItems: state.biddingPortal.groupedBidItems,
        floorplans: state?.projectFloorplans?.floorplans?.data,
        isEditable: state.biddingPortal.isEditable,
        isIdle: state.biddingPortal.isIdle,
        isOffline: state.biddingPortal.isOffline,
        //bidItemsUpdated: state.biddingPortal.bidItemsUpdated,
    }));
    const isAgreement = useIsAgreement(navState?.isAgreement, state?.bidRequestItem);
    role = isAgreement ? localStorage.getItem("role") ?? undefined : role;
    const isAdminAccess = role !== localStorage.getItem("role");
    const navigate = useNavigate();
    let isLatest: any =
        (state as any)?.isLatest ?? role == "admin"
            ? localStorage.getItem("isLatest") ?? undefined
            : undefined;
    const orgId =
        (state as any)?.org_id ?? role == "admin"
            ? localStorage.getItem("contractor_org_id") ?? undefined
            : localStorage.getItem("organization_id") ?? undefined;

    const FpSummaryComponent = useMemo(() => {
        let FpSummary = [];
        if (floorplanName && floorplanName?.length > 0) {
            if (floorplanName === "All Floor Plans")
                FpSummary.push(
                    <Box width="145vh">
                        <BasicTabs
                            key={0}
                            tabs={floorplans.map(
                                ({
                                    area,
                                    bedsPerUnit,
                                    bathsPerUnit,
                                    name,
                                    totalUnits,
                                    id,
                                    cdn_paths,
                                }) => ({
                                    label: name.toLowerCase(),
                                    content: (
                                        <FloorplanSummary
                                            bathCount={bathsPerUnit}
                                            bedCount={bedsPerUnit}
                                            totalSQFT={area}
                                            totalUnits={totalUnits}
                                            disableBedBathCount={
                                                projectDetails?.property_type?.toLowerCase() !==
                                                "interior"
                                            }
                                            summary={getDescriptionById(id)}
                                            fpImgPath={
                                                cdn_paths?.length > 0
                                                    ? cdn_paths.find((url) =>
                                                          url?.includes("AUTOx300"),
                                                      ) ?? ""
                                                    : ""
                                            }
                                        />
                                    ),
                                }),
                            )}
                        />
                    </Box>,
                );
            else {
                const openedFp = floorplans?.find(({ name }) => name === floorplanName);
                if (openedFp !== undefined) {
                    const { area, bedsPerUnit, bathsPerUnit, totalUnits, id, cdn_paths } = openedFp;
                    FpSummary.push(
                        <BasicTabs
                            key={1}
                            tabs={[
                                {
                                    label: floorplanName,
                                    content: (
                                        <FloorplanSummary
                                            bathCount={bathsPerUnit}
                                            bedCount={bedsPerUnit}
                                            totalSQFT={area}
                                            totalUnits={totalUnits}
                                            summary={getDescriptionById(id)}
                                            disableBedBathCount={
                                                projectDetails?.property_type?.toLowerCase() !==
                                                "interior"
                                            }
                                            fpImgPath={
                                                cdn_paths?.length > 0
                                                    ? cdn_paths.find((url) =>
                                                          url?.includes("AUTOx300"),
                                                      ) ?? ""
                                                    : ""
                                            }
                                        />
                                    ),
                                },
                            ]}
                        />,
                    );
                }
            }
        }
        return FpSummary;
        //eslint-disable-next-line
    }, [floorplanName]);

    const handleChange = (category: string) => {
        setExpanded((prevExpanded: string[]) => {
            if (prevExpanded?.includes(category)) {
                return prevExpanded?.filter((e) => e !== category);
            } else {
                let updatedExpanded;
                if (prevExpanded?.length === 2) {
                    updatedExpanded = [prevExpanded[1], category];
                } else {
                    updatedExpanded = [...(prevExpanded || []), category];
                }
                // Rest of your code...
                return updatedExpanded;
            }
        });
        let catIndex = groupedBidItems?.[state?.fpIndex]?.categories?.findIndex(
            (list: any) => list?.category === category,
        );
        if (catIndex !== -1) {
            //TO-DO : merge transformDataToHierarchy and convertCombinedBidItemsToTreeData function

            let updated = orgContainerId
                ? transformDataToHierarchy(
                      groupedBidItems?.[state?.fpIndex]?.categories?.[catIndex]?.items,
                  )
                : convertCombinedBidItemsToTreeData(
                      groupedBidItems?.[state?.fpIndex]?.categories?.[catIndex]?.items,
                  );
            setItems(updated);
        }
    };

    useEffect(() => {
        if (state?.fpIndex !== 0 && !state?.fpIndex && isAgreement) {
            isAgreement ? navigate(-1) : navigate(ROUTES.SUMMARY_TABLE(role!, userID!, projectId!));
        }
        //eslint-disable-next-line
    }, [isAgreement]);

    useEffect(() => {
        dispatch(actions.biddingPortal.updateSyncTimerStatesStart({}));
    }, []);

    return (
        <Grid item key={idx}>
            {idx == 0 && (
                <Grid container gap={2} direction="column">
                    <Grid item>
                        <NavBar
                            showNavigation={idx === 0}
                            showExportToExcel={idx === 0}
                            groupedBidItems={groupedBidItems}
                            index={state?.fpIndex}
                            isAgreement={isAgreement}
                            isAdminAccess={isAdminAccess}
                            isLatest={isLatest}
                            isEditable={isEditable}
                            orgId={orgId}
                            projectDetails={projectDetails}
                            selectedRows={selectedRows}
                            category={category}
                            wrapWithAccordion={true}
                            orgContainerId={orgContainerId}
                            selectedVersion={state?.selectedVersion}
                        />
                    </Grid>
                    <Grid item>
                        <BaseAccordion
                            title={
                                projectDetails?.property_type?.toLowerCase() === "interior"
                                    ? "FLOOR PLANS"
                                    : "Areas"
                            }
                            components={FpSummaryComponent}
                            defaultExpanded={false}
                        />
                    </Grid>
                </Grid>
            )}
            <Accordion
                TransitionProps={{ unmountOnExit: true }}
                sx={{ marginTop: "10px" }}
                onChange={() => handleChange(category)}
                expanded={expanded?.includes(category)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <HeaderComponent
                        wrapWithAccordion={true}
                        showNavigation={idx === 0}
                        groupedBidItems={groupedBidItems}
                        index={state?.fpIndex}
                        catIndex={groupedBidItems?.[state?.fpIndex]?.categories?.findIndex(
                            (list: any) => list?.category === category,
                        )}
                        category={category}
                        orgContainerId={orgContainerId}
                        setItems={setItems}
                        selectedRows={selectedRows}
                        selectedRowsData={selectedRowsData}
                        costsColumnWidth={`15rem`}
                        projectDetails={projectDetails}
                        setSelectedRows={setSelectedRows}
                        isIdle={isIdle}
                        isOffline={isOffline}
                        enableCombineLineItems={enableCombineLineItems}
                        setComboPromptState={setComboPromptState}
                    />
                </AccordionSummary>
                <AccordionDetails>
                    {expanded?.includes(category) && (
                        <PriceDataGrid
                            items={items}
                            bidItemsUpdated={bidItemsUpdated}
                            syncTimeout={syncTimeout}
                            projectDetails={projectDetails}
                            isEditable={isEditable}
                            isIdle={isIdle}
                            isOffline={isOffline}
                            isAgreement={isAgreement}
                            index={state?.fpIndex}
                            category={category}
                            setComboPromptState={setComboPromptState}
                            currentRenoversion={currentRenoversion}
                            orgId={orgId}
                            setSelectedRows={setSelectedRows}
                            selectedRows={selectedRows}
                            comboPromptState={comboPromptState}
                            isAdminAccess={isAdminAccess}
                            isLatest={isLatest}
                            selectedRowsData={selectedRowsData}
                            setSelectedRowsData={setSelectedRowsData}
                            setItems={setItems}
                            orgContainerId={orgContainerId}
                            setSyncTimeout={setSyncTimeout}
                            disableSnackbar={idx !== 0}
                        />
                    )}
                </AccordionDetails>
            </Accordion>
            {/* <PriceEntryTable
                        wrapWithAccordion
                        showExportToExcel={idx === 0}
                        showStatusBar={idx === 0}
                        showNavigation={idx === 0}
                        disableSnackbar={idx !== 0}
                        fpIndex={state?.fpIndex}
                        categoryName={category!}
                        propBidRequestItem={state?.bidRequestItem}
                        propBidResponseItem={state?.bidResponseItem}
                        displayPricingTable={false}
                        costsColumnWidth={`15rem`}
                    /> */}
        </Grid>
    );
};

export default CategoryTable;
