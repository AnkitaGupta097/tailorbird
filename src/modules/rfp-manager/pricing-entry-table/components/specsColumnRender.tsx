import { Stack, Typography, Container, Grid, Chip } from "@mui/material";
import React from "react";
import { IItem } from "stores/bidding-portal/bidding-portal-models";
import BaseSvgIcon from "components/svg-icon";
import { ReactComponent as MaterialIcon } from "../../../../assets/icons/material.svg";
import { ReactComponent as LaborIcon } from "../../../../assets/icons/labor.svg";
import { ReactComponent as MaterialWithLabourIcon } from "../../../../assets/icons/material+labor.svg";
import TooltipWrapper from "./tooltip-wrapper";
import { useAppSelector } from "stores/hooks";

interface ISpecsColumnRender {
    params: { row: IItem };
}
const SpecsColumnRender: React.FC<ISpecsColumnRender> = ({ params }) => {
    const { itemChangeLog } = useAppSelector((state) => ({
        itemChangeLog: state.biddingPortal.itemChangeLog,
    }));
    let reno_item_id = params!?.row?.reno_item_id.split("#")[0];
    let changeLogKey =
        params?.row?.category?.toLowerCase() === "alternates"
            ? "alt_renovation_change_log"
            : params?.row?.category?.toLowerCase() === "flooring"
            ? "flooring_renovation_change_log"
            : "base_renovation_change_log";
    let showToolTipWithPreviousValues = false;
    let keysToDisplay = ["description", "model_no", "manufacturer"];
    let changeLogObj = itemChangeLog?.[changeLogKey]?.[reno_item_id]?.reno_item_diff;
    if (
        changeLogObj?.["description"] ||
        changeLogObj?.["model_no"] ||
        changeLogObj?.["manufacturer"]
    ) {
        showToolTipWithPreviousValues = true;
    }
    let tooltipText = "";
    if (showToolTipWithPreviousValues) {
        let values = keysToDisplay.map((key) => {
            return (
                itemChangeLog?.[changeLogKey]?.[reno_item_id]?.[key]?.["old_value"] ??
                params?.row?.[key as keyof IItem] ??
                ""
            );
        });
        tooltipText = `Previously: \n${values[0] ?? ""} \n${values[1] ?? ""} \n${values[2] ?? ""}`;
    }

    let parent_work_type: string | undefined | null = null;
    if (params?.row?.children) {
        params?.row?.children?.forEach((child) => {
            if (!parent_work_type) {
                parent_work_type = child.work_type;
            }
            if (parent_work_type === child.work_type) {
                return;
            } else if (parent_work_type !== child.work_type) {
                parent_work_type = "mixed";
            }
        });
    }
    return (
        <Stack direction="column" width="100%" height="100%">
            <Stack direction="row" gap={2} height={"100%"} alignItems="center" width="100%">
                <BaseSvgIcon
                    svgPath={
                        params?.row?.work_type === "Material" ? (
                            <MaterialIcon />
                        ) : params?.row?.work_type === "Labor" ? (
                            <LaborIcon />
                        ) : (
                            <MaterialWithLabourIcon />
                        )
                    }
                />
                {params?.row?.type === "COMBINED" ? (
                    <Grid container direction="column" justifyContent="flex-start" gap={2}>
                        {params?.row?.children?.map((child, index) => {
                            return (
                                <Grid item xs key={`${index}-${child.subcategory}-${child.id}`}>
                                    <Chip
                                        sx={{
                                            borderRadius: "3px",
                                            height: "150%",
                                            width: "auto",
                                            backgroundColor: "#BCDFEF",
                                            color: "#00344D",
                                            lineHeight: 0.9,
                                            fontSize: 12,
                                        }}
                                        label={child?.subcategory}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                ) : null}
                <TooltipWrapper
                    tooltipText={tooltipText}
                    wrapWithTooltip={
                        params?.row?.type_of_change === "updated" && showToolTipWithPreviousValues
                    }
                >
                    {params?.row?.type !== "COMBINED" && (
                        <Container
                            sx={{
                                padding: "0.5rem 0rem 0.5rem 0.6rem",
                                backgroundColor:
                                    params?.row?.type_of_change === "updated" &&
                                    showToolTipWithPreviousValues
                                        ? "#FFD79D"
                                        : "none",
                                borderRadius:
                                    params?.row?.type_of_change === "updated" &&
                                    showToolTipWithPreviousValues
                                        ? "5px"
                                        : "none",
                            }}
                        >
                            <Typography
                                variant="text_14_regular"
                                color="#757575"
                                sx={{
                                    width: "100%",
                                    alignItems: "center",
                                    whiteSpace: "normal",
                                    lineHeight: "1rem",
                                    display: "block",
                                    textDecorationLine:
                                        params?.row?.type_of_change === "deleted"
                                            ? "line-through"
                                            : "none",
                                }}
                            >
                                {params?.row?.description}
                            </Typography>
                            <Typography
                                variant="text_14_regular"
                                color="#757575"
                                sx={{
                                    width: "100%",
                                    alignItems: "center",
                                    whiteSpace: "normal",
                                    lineHeight: "1rem",
                                    display: "block",
                                    textDecorationLine:
                                        params?.row?.type_of_change === "deleted"
                                            ? "line-through"
                                            : "none",
                                }}
                            >
                                {params?.row?.finish}
                            </Typography>
                            <Typography
                                variant="text_14_regular"
                                color="#757575"
                                sx={{
                                    width: "100%",
                                    alignItems: "center",
                                    whiteSpace: "normal",
                                    lineHeight: "1rem",
                                    display: "block",
                                    textDecorationLine:
                                        params?.row?.type_of_change === "deleted"
                                            ? "line-through"
                                            : "none",
                                }}
                            >
                                {params?.row?.model_no}
                            </Typography>
                            <Typography
                                variant="text_14_regular"
                                color="#757575"
                                sx={{
                                    width: "100%",
                                    alignItems: "center",
                                    display: "block",
                                    whiteSpace: "normal",
                                    lineHeight: "1rem",
                                    textDecorationLine:
                                        params?.row?.type_of_change === "deleted"
                                            ? "line-through"
                                            : "none",
                                }}
                            >
                                {params?.row?.manufacturer}
                            </Typography>
                        </Container>
                    )}
                </TooltipWrapper>
            </Stack>
        </Stack>
    );
};

export default SpecsColumnRender;
