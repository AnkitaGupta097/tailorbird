import { Typography } from "@mui/material";
import React from "react";
import { IItem } from "stores/bidding-portal/bidding-portal-models";
import TooltipWrapper from "./tooltip-wrapper";
import { useAppSelector } from "stores/hooks";
import { getDisplayUOM } from "../constants";
import { getFormattedNumber } from "modules/rfp-manager/common/constants";

interface IQuantityColumnRender {
    params: { row: IItem };
}

const QuantityColumnRender: React.FC<IQuantityColumnRender> = ({ params }) => {
    const { quantityChangeLog } = useAppSelector((state) => ({
        quantityChangeLog: state.biddingPortal.quantityChangeLog,
    }));
    let row = params.row;
    let inv_id: null | string = row.inventory_id;
    let subgroup_id: null | string = row.subgroup_id;
    if (row.fp_id === "ALL") {
        inv_id = null;
        subgroup_id = null;
    }
    let { display, quantity } =
        quantityChangeLog?.[`${row.reno_item_id}:${row.fp_id}:${inv_id}:${subgroup_id}`] ?? {};

    let showUpdates =
        `${row.reno_item_id}:${row.fp_id}:${inv_id}:${subgroup_id}` in (quantityChangeLog ?? {}) &&
        !!quantity &&
        quantity !== row.quantity;

    return (
        <TooltipWrapper
            wrapWithTooltip={params?.row?.type_of_change === "updated" && showUpdates}
            tooltipText={`Previously: \n ${display} `}
        >
            <Typography
                variant="text_14_regular"
                color="#757575"
                component="div"
                whiteSpace="normal"
                sx={{
                    textDecorationLine:
                        params?.row?.type_of_change === "deleted" ? "line-through" : "none",
                    ...(params?.row?.type_of_change === "updated" && showUpdates
                        ? { backgroundColor: "#FFD79D", borderRadius: "4px", padding: "0.5rem" }
                        : {}),
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                }}
            >
                {params?.row?.specific_uom?.toLowerCase() === "percentage" ||
                params?.row?.uom?.toLowerCase() === "percentage"
                    ? "N/A"
                    : `${getFormattedNumber(
                          params?.row?.specific_quantity ?? params?.row?.quantity ?? 0,
                          false,
                      )} ${
                          params?.row?.specific_uom
                              ? getDisplayUOM(params?.row?.specific_uom)
                              : getDisplayUOM(params?.row?.uom ?? "")
                      }`}
            </Typography>
        </TooltipWrapper>
    );
};

export default QuantityColumnRender;
