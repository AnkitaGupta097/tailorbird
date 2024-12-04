import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import { Link, Stack, Typography } from "@mui/material";
import Menu, { MenuProps } from "@mui/material/Menu";
import { styled } from "@mui/material/styles";
import { GridRowParams } from "@mui/x-data-grid-pro";
import { getCategoryIcon } from "modules/projects/details/budgeting/category-icons";
import { IItem } from "stores/bidding-portal/bidding-portal-models";
import { BIDDING_PORTAL, getFormattedNumber } from "../common/constants";
import React from "react";
export const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        {...props}
    />
))(() => ({
    "& .MuiPaper-root": {
        borderRadius: 5,
        minWidth: 180,
        color: "#000000",
        size: "16px",
        weight: "400",
        padding: "8px 0px 8px 0px",
        fontFamily: "Roboto",
        boxShadow:
            "0px 3px 14px 2px #0000001F, 0px 8px 10px 1px #00000024, 0px 5px 5px -3px #00000033",
        "& .MuiMenu-list": {
            padding: "4px 0",
        },
        "& .MuiMenuItem-root": {
            "&:active": {
                backgroundColor: "#EEEEEE",
            },
        },
    },
}));

export const SubDetailsLine = ({
    item,
    onAlternatesClick,
}: {
    item: IItem;
    onAlternatesClick: () => void;
}) => {
    return item?.alternate_item_ref ? (
        <Stack direction="row" alignItems="center" gap={1} color="#757575">
            <img
                src={getCategoryIcon("Alternates")}
                height="16px"
                width="16px"
                alt="Alternates Icon"
            />
            <Typography variant="text_12_regular" fontStyle="italic">
                has an
                <Link
                    onClick={onAlternatesClick}
                    sx={{
                        padding: 1,
                        m: 0,
                        color: "#757575",
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                >
                    Alternate
                </Link>
            </Typography>
        </Stack>
    ) : item?.is_alternate ? (
        <>
            <Stack
                direction="row"
                alignItems="center"
                gap={1}
                color={item?.is_ownership_alt ? "#916A00" : "#1F7A76"}
            >
                {item?.is_ownership_alt ? (
                    <CallReceivedIcon
                        sx={{
                            fontSize: "16px",
                        }}
                    />
                ) : (
                    <CallMadeIcon
                        sx={{
                            fontSize: "16px",
                        }}
                    />
                )}
                <Typography variant="text_12_regular">
                    {item?.is_ownership_alt ? "Owner Request" : "VE Suggestion"}
                </Typography>
            </Stack>
        </>
    ) : null;
};

export const getTotalPrice = (
    params: GridRowParams<IItem>,
    data: any,
    filteredProjectCost: any,
    returnPreciseValue: boolean = false,
) => {
    let percentageCost = 0;
    const excludedCategories = ["Tax", "General Conditions", "Profit & Overhead", "Alternates"];
    const { inventory_name } = data;
    const filterKey =
        params?.row?.fp_name + (inventory_name ?? "") + (params?.row?.sub_group_name ?? "");
    const isPercentageUOM =
        params?.row?.specific_uom === "percentage" || params?.row?.uom === "percentage";
    const isCombinedItem = params?.row?.type?.toLowerCase() === "combined";

    const baseAmount =
        params?.row?.subcategory?.toLowerCase().includes("tax on labor") && !isCombinedItem
            ? filteredProjectCost[filterKey]?.laborCost
            : params?.row?.subcategory?.toLowerCase().includes("tax on material") && !isCombinedItem
            ? filteredProjectCost[filterKey]?.materialCost
            : filteredProjectCost[filterKey]?.categorySum;

    if (excludedCategories.includes(params?.row?.category) && isPercentageUOM) {
        percentageCost =
            (baseAmount *
                (params?.row?.unique_price > 0
                    ? params?.row?.unique_price
                    : params?.row?.default_price)) /
            100;
    }

    if (params?.row?.isParentCategory)
        return (
            <Typography sx={{ fontWeight: "bold" }}>{`$${calculateChildPrices(
                params,
            )}`}</Typography>
        );
    if (
        params?.row?.default_price === 0 &&
        params?.row?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS &&
        params?.row?.floorplans?.length > 0 &&
        !params?.row?.allFloorplansFilled &&
        params?.row?.unitsToBeFilled > 0
    )
        return <Typography>Incomplete</Typography>;

    return `$
                        ${getFormattedNumber(
                            isPercentageUOM
                                ? percentageCost
                                : params?.row?.total_price === 0
                                ? params?.row?.unique_price > 0
                                    ? params?.row?.unique_price *
                                      (params?.row?.specific_quantity ?? params?.row?.quantity)
                                    : params?.row?.default_price > 0
                                    ? params?.row?.default_price *
                                      (params?.row?.specific_quantity ?? params?.row?.quantity)
                                    : params?.row?.total_price
                                : params?.row?.total_price,
                            returnPreciseValue,
                        )}`;
};

const calculateChildPrices = (params: any) => {
    let sum = 0.0;
    if (params?.row?.items?.length > 0) {
        params?.row?.items?.forEach((item: any) => {
            sum =
                sum +
                parseFloat(
                    getFormattedNumber(
                        item?.total_price === 0
                            ? item?.unique_price > 0
                                ? item?.unique_price * (item?.specific_quantity ?? item?.quantity)
                                : item?.default_price > 0
                                ? item?.default_price * (item?.specific_quantity ?? item?.quantity)
                                : item?.total_price
                            : item?.total_price,
                    ),
                );
        });
    }
    return sum.toLocaleString("en-US");
};

export const isCombineItemDisabled = (
    selectedRowsData: any[],
): { message: string; value: boolean } => {
    let isNotSameCategory = !selectedRowsData.every(
        (row: any) =>
            row.l1_name === selectedRowsData[0].l1_name &&
            row.l2_name === selectedRowsData[0].l2_name &&
            row.l3_name === selectedRowsData[0].l3_name,
    );
    let value = selectedRowsData.length < 2 || isNotSameCategory;

    return {
        message: isNotSameCategory ? "Please select rows from the same section to combine." : "",
        value: value,
    };
};
