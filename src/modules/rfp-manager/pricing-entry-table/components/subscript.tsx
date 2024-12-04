import React, { FC } from "react";
import { getDisplayUOM, getSubscript } from "../constants";
import { Typography, Tooltip, Stack } from "@mui/material";
import { IFloorplanPrice, IItem } from "stores/bidding-portal/bidding-portal-models";

const Subscript: FC<{
    params: { row: IItem };
    showInventory?: boolean;
    preciseValues?: boolean;
}> = ({ params, showInventory = true, preciseValues = false }) => {
    return (
        (((params?.row?.unique_price === 0 || params?.row?.default_price === 0) &&
            params?.row?.total_price > 0) ||
            !params?.row?.is_unique_price ||
            params?.row?.is_unique_price) && (
            <Tooltip
                title={
                    params?.row?.floorplans?.length > 0 ? (
                        <Stack direction={"column"}>
                            <Typography>{`Default: ${
                                params?.row?.default_price > 0
                                    ? `$${
                                          Math.ceil(params?.row?.default_price * 100) / 100
                                      }/${getDisplayUOM(
                                          params?.row?.specific_uom ?? params?.row?.uom,
                                      )}`
                                    : "N/A"
                            }`}</Typography>
                            {params?.row?.floorplans?.map(
                                (floorplan: IFloorplanPrice, index: number) => (
                                    <Typography key={index}>{`${floorplan?.fp_name}${
                                        showInventory ? `:${floorplan.inventory ?? ""}` : ""
                                    }:${floorplan.sub_group_name ?? ""} = $${
                                        preciseValues
                                            ? floorplan?.unique_price
                                            : Math.ceil(floorplan?.unique_price * 100) / 100
                                    }/${getDisplayUOM(
                                        params?.row?.specific_uom ?? params?.row?.uom,
                                    )}`}</Typography>
                                ),
                            )}
                        </Stack>
                    ) : (
                        ""
                    )
                }
            >
                <Typography variant="text_10_semibold" color="#969696">
                    {getSubscript(params?.row)}
                </Typography>
            </Tooltip>
        )
    );
};

export default Subscript;
