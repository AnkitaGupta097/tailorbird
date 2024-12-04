import { Typography, Tooltip } from "@mui/material";
import { GridColDef, GridCellParams } from "@mui/x-data-grid";
import React from "react";
import { BIDDING_PORTAL, getFormattedNumber } from "../common/constants";
import { checkIfItemIsModified } from "../helper";
import clsx from "clsx";
import ErrorIcon from "@mui/icons-material/Error";
import { ICategory } from "stores/bidding-portal/bidding-portal-models";

export const commonColumns: Array<GridColDef> = [
    {
        field: "fp_name",
        headerName: "Floor Plan",
        cellClassName: (params: GridCellParams<any, any>) => {
            /* criteria for isModified cell in summary table if all the below condition fulfills
                1. if type of change is not null 
                2. if type of change is created or update but no price filled 
                3. if type of change is deleted but price is filled
                */
            let isModified = checkIfItemIsModified(params?.row?.categories);
            return clsx("modified-common", {
                negative: !isModified,
                positive: isModified,
            });
        },
        width: 250,
        resizable: false,
        renderCell(params) {
            let isModified = checkIfItemIsModified(params?.row?.categories);
            return (
                <>
                    <Typography
                        variant="text_14_semibold"
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            padding: "0 0.6rem",
                            whiteSpace: "normal",
                        }}
                        color="#004D71"
                    >
                        {`${params.row?.fp_name}${
                            params.row?.inventory_name?.length > 0
                                ? `: ${params.row?.inventory_name}`
                                : ""
                        }${
                            params?.row?.sub_group_name?.length > 0
                                ? `: ${params.row.sub_group_name}`
                                : ""
                        } - ${params.row?.total_units ?? 0} units`}
                    </Typography>
                    {isModified && (
                        <Tooltip title={"Please make revision"}>
                            <ErrorIcon htmlColor="#D72C0D" sx={{ marginRight: "10px" }} />
                        </Tooltip>
                    )}
                </>
            );
        },
    },
];
export const wtdAvgColumn = (renoUnits: any[], considerAlternates?: boolean) => {
    return [
        {
            field: "wtdAvg",
            headerName: "Wtd Average",
            width: 220,
            resizable: false,
            cellClassName: (params: GridCellParams<any, any>) => {
                let isModified = checkIfItemIsModified(params?.row?.categories);

                return clsx("modified-common", {
                    negative: !isModified,
                    positive: isModified,
                });
            },
            renderCell(params: {
                row: {
                    fp_name: any;
                    total_units: number;
                    categories: ICategory[];
                };
            }) {
                let row = params?.row;
                let index = renoUnits?.findIndex((item) => item?.fp_name === row?.fp_name);
                let total_fp_units =
                    index > -1 ? renoUnits?.[index]?.total_fp_units : row?.total_units;
                // let alternatesSum = 0;
                let totalSum = 0;
                if (considerAlternates) {
                    row?.categories.every((category) => {
                        if (category.totalSum === 0) {
                            totalSum = 0;
                            return false;
                        } else {
                            totalSum += category.totalSum;
                            return true;
                        }
                    });
                } else {
                    row?.categories.every((category) => {
                        if (category.category === "Alternates") {
                            return true;
                        } else if (category.totalSum === 0) {
                            totalSum = 0;
                            return false;
                        } else {
                            totalSum += category.totalSum;
                            return true;
                        }
                    });
                }
                return (
                    <>
                        <Typography
                            variant="text_14_regular"
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                padding: "0 0.6rem",
                            }}
                        >
                            {totalSum > 0 && total_fp_units > 0
                                ? `$${getFormattedNumber(
                                      params.row?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS
                                          ? totalSum / total_fp_units
                                          : totalSum,
                                  )}`
                                : "Not completed"}
                        </Typography>
                    </>
                );
            },
        },
    ];
};
export const aggregateColumn = (considerAlternates?: boolean) => {
    return [
        {
            field: "aggregate",
            headerName: "Aggregate",
            width: 220,
            resizable: false,
            cellClassName: (params: GridCellParams<any, any>) => {
                let isModified = checkIfItemIsModified(params?.row?.categories);

                return clsx("modified-common", {
                    negative: !isModified,
                    positive: isModified,
                });
            },
            renderCell(params: {
                row: {
                    fp_name: any;
                    total_units: number;
                    categories: ICategory[];
                };
            }) {
                let row = params?.row;
                let totalSum = 0;
                if (considerAlternates) {
                    row?.categories.every((category) => {
                        if (category.totalSum === 0) {
                            totalSum = 0;
                            return false;
                        } else {
                            totalSum += category.totalSum;
                            return true;
                        }
                    });
                } else {
                    row?.categories.every((category) => {
                        if (category.category === "Alternates") {
                            return true;
                        } else if (category.totalSum === 0) {
                            totalSum = 0;
                            return false;
                        } else {
                            totalSum += category.totalSum;
                            return true;
                        }
                    });
                }
                return (
                    <>
                        <Typography
                            variant="text_14_regular"
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                padding: "0 0.6rem",
                            }}
                        >
                            {totalSum > 0
                                ? `$${getFormattedNumber(
                                      params.row?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS
                                          ? totalSum
                                          : totalSum * row?.total_units,
                                  )}`
                                : "Not completed"}
                        </Typography>
                    </>
                );
            },
        },
    ];
};
