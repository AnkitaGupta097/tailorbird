import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Box, Link, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { ROUTES, getFormattedNumber, BIDDING_PORTAL } from "../common/constants";
import { IItem } from "stores/bidding-portal/bidding-portal-models";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";

const AddPrice = (
    data: any,
    navigate: any,
    role: string,
    userID: string,
    groupedBidItems: any,
    projectId: string,
    selectedVersion: string,
    bidResponseItem: any[],
    bidRequestItem: any[],
    isModified: boolean,
    organization_id: string,
    isAdminAccess: boolean,
    version: string,
    isLatest: boolean,
    tab?: string,
    isAgreement?: boolean,
) => {
    const { contractorId, contractorName, agreementId } = useParams();
    const displayPreciseValues = useFeature(FeatureFlagConstants.PRECISE_VALUES_IN_RFP2).on;
    let catIndex = data?.row?.categories?.findIndex((item: any) => item.category === data?.field);
    let index = data?.row?.index;
    let displayValue: any = 0;
    let item = groupedBidItems?.[index]?.categories?.[catIndex]?.items.find((item: IItem) => {
        let unit_price = 0;
        if (item.is_unique_price) {
            unit_price = item.unique_price;
        } else {
            unit_price = item.default_price;
        }
        let condition =
            item.total_price === 0 && unit_price === 0 && item?.type_of_change !== "deleted";
        if (item?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS && item?.floorplans?.length > 0)
            return !item?.allFloorplansFilled && condition;
        else return condition;
    });
    if (tab === "wtd_avg" && !item) {
        displayValue =
            groupedBidItems?.[index]?.categories?.[catIndex]?.totalSum > 0 &&
            groupedBidItems?.[index]?.total_units > 0
                ? groupedBidItems?.[index]?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS
                    ? groupedBidItems?.[index]?.categories?.[catIndex]?.totalSum /
                      groupedBidItems?.[index]?.total_units
                    : groupedBidItems?.[index]?.categories?.[catIndex]?.totalSum
                : 0;
    } else if (tab === "aggregate" && !item) {
        displayValue =
            catIndex !== -1
                ? groupedBidItems?.[index]?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS
                    ? groupedBidItems?.[index]?.categories?.[catIndex]?.totalSum
                    : groupedBidItems?.[index]?.categories?.[catIndex]?.totalSum *
                      groupedBidItems?.[index]?.total_units
                : 0;
    }
    return (
        <Box
            sx={{
                backgroundColor: isModified ? "#FFF5EA" : displayValue > 0 ? "#F1F8F5" : undefined,
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                height: "100%",
                alignItems: "center",
                padding: "0 1rem 0 .5rem",
            }}
        >
            <Link
                onClick={() => {
                    let category = data?.field;
                    let route = isAgreement
                        ? ROUTES.ENTRY_TABLE_AGREEMENTS(
                              role,
                              userID,
                              agreementId ?? "",
                              projectId,
                              contractorId ?? "",
                              contractorName ?? "",
                              category,
                          )
                        : ROUTES.ENTRY_TABLE(role, userID, projectId, category);
                    navigate(route, {
                        state: {
                            data: data?.row,
                            category: category,
                            index: data?.row?.index,
                            tab: tab,
                            organization_id: organization_id,
                            selectedVersion: selectedVersion,
                            bidResponseItem: bidResponseItem,
                            bidRequestItem: bidRequestItem,
                            isAdminAccess: isAdminAccess,
                            version: version,
                            isLatest: isLatest,
                        },
                    });
                }}
                sx={{
                    "&:hover": {
                        cursor: "pointer",
                    },
                }}
                color={displayValue > 0 ? "#00B779" : "#004D71"}
            >
                <Typography variant="text_14_regular">
                    {displayValue > 0
                        ? `$${getFormattedNumber(displayValue, displayPreciseValues)}`
                        : isModified
                        ? "Revise pricing"
                        : "Add Price"}
                </Typography>
            </Link>
            {displayValue > 0 ? (
                <CheckCircleRoundedIcon
                    htmlColor="#00B779"
                    sx={{
                        height: "100%",
                    }}
                />
            ) : null}
        </Box>
    );
};

export default AddPrice;
