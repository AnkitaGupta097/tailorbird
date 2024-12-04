import { Stack, Typography, Tooltip, Box } from "@mui/material";
import React from "react";
import { IItem } from "stores/bidding-portal/bidding-portal-models";
import { useAppSelector } from "stores/hooks";
import TooltipWrapper from "./tooltip-wrapper";
import { isEmpty } from "lodash";

interface ILocationColumnRender {
    params: { row: IItem };
    projectType?: string;
}
const LocationColumnRender: React.FC<ILocationColumnRender> = ({
    params,
    projectType = "interior",
}) => {
    const { itemChangeLog } = useAppSelector((state) => ({
        itemChangeLog: state.biddingPortal.itemChangeLog,
    }));
    let reno_item_id = params!.row?.reno_item_id.split("#")[0];

    let changeLogKey =
        params?.row?.category?.toLowerCase() === "alternates"
            ? "alt_renovation_change_log"
            : params?.row?.category?.toLowerCase() === "flooring" && projectType !== "exterior"
            ? "flooring_renovation_change_log"
            : "base_renovation_change_log";
    let changeLogObj = itemChangeLog?.[changeLogKey]?.[reno_item_id]?.reno_item_diff?.location;
    let showToolTipWithPreviousValues = !!changeLogObj;
    let previousLocations = "";
    if (showToolTipWithPreviousValues) {
        previousLocations = (changeLogObj?.["old_value"] as string)
            ?.split(",")
            .reduce((prev, curr, index) => {
                if (prev == "") return curr;
                if (index % 5 == 0) {
                    return `${prev} \n${curr}`;
                }
                return `${prev}, ${curr}`;
            }, "");

        previousLocations = `Previously: \n${previousLocations ?? "None"}`;
    }

    let parentLocation: null | string = null;
    if (params?.row?.children) {
        params?.row?.children.every((child) => {
            let location = child.location?.toString().split(",");
            if (location?.length > 1) {
                parentLocation = "Multiple";
                return false;
            } else if (location?.length === 1) {
                if (parentLocation !== location?.[0]) {
                    parentLocation = "Multiple";
                    return false;
                }
                return true;
            }
        });
    }
    let splitLocations = (params?.row?.location ?? "")?.toString()?.split(",");
    let joinedSplitLocations: string = "";
    joinedSplitLocations = splitLocations?.map((val) => val.trim()).join("\r\n");
    if (!isEmpty(splitLocations)) {
        joinedSplitLocations = splitLocations.reduce((prev, curr, index) => {
            if (prev == "") return curr;
            if (index % 5 == 0) {
                return `${prev} \n${curr}`;
            }
            return `${prev}, ${curr}`;
        }, "");
    }

    if (params.row.children)
        return (
            <Stack justifyContent="center" direction="column" width="100%" height="100%">
                <Typography
                    sx={{
                        textDecorationLine:
                            params?.row?.type_of_change === "deleted" ? "line-through" : "none",
                    }}
                    variant="text_14_regular"
                    textAlign="left"
                    color="#757575"
                >
                    {parentLocation ?? ""}
                </Typography>
            </Stack>
        );
    else
        return splitLocations && splitLocations?.length > 1 ? (
            <Tooltip
                title={
                    <pre>
                        <Typography variant="text_14_semibold">
                            {showToolTipWithPreviousValues
                                ? `${previousLocations} \r\n\nCurrently:\r\n${joinedSplitLocations}`
                                : joinedSplitLocations}
                        </Typography>
                    </pre>
                }
                arrow
            >
                <Typography
                    sx={{
                        textDecorationLine:
                            params?.row?.type_of_change === "deleted" ? "line-through" : "none",
                    }}
                    variant="text_14_regular"
                    textAlign="left"
                    color="#757575"
                >
                    {showToolTipWithPreviousValues ? (
                        <Box
                            sx={{
                                backgroundColor: "#FFD79D",
                                borderRadius: "4px",
                                padding: "0.5rem",
                            }}
                        >
                            Multiple
                        </Box>
                    ) : (
                        "Multiple"
                    )}
                </Typography>
            </Tooltip>
        ) : (
            <TooltipWrapper
                tooltipText={previousLocations}
                wrapWithTooltip={showToolTipWithPreviousValues}
            >
                <Typography
                    sx={{
                        textDecorationLine:
                            params?.row?.type_of_change === "deleted" ? "line-through" : "none",
                        backgroundColor:
                            params?.row?.type_of_change === "updated" &&
                            showToolTipWithPreviousValues
                                ? "#FFD79D"
                                : "none",
                    }}
                    variant="text_14_regular"
                    textAlign="left"
                    color="#757575"
                >
                    {params?.row?.location ?? ""}
                </Typography>
            </TooltipWrapper>
        );
};

export default LocationColumnRender;
