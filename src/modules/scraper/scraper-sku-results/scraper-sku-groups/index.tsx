import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { StyledCheckbox } from "..";
import AppTheme from "../../../../styles/theme";
import { SCRAPER_SKU_GROUPS } from "../common/constant";
import { getFilteredSKURows, isErrorFound } from "../common/helper";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface IScraperSkuGroups {
    jobDetails: {
        [x: string]: any;
    }[];
    data: {
        [x: string]: any;
    }[];
    setData: React.Dispatch<
        React.SetStateAction<
            {
                [x: string]: any;
            }[]
        >
    >;
    skusWithCount: [
        {
            sku: string;
            count: number;
            isSelected: boolean;
        },
    ];
    isChecked: {
        index: number;
        value: boolean;
    };
    setIsChecked: React.Dispatch<
        React.SetStateAction<{
            index: number;
            value: boolean;
        }>
    >;
    checkedIndexes: number[];
    setCheckedIndexes: React.Dispatch<React.SetStateAction<number[]>>;
    skuStatus:
        | {
              skuNumber: {
                  id: number;
                  status: string;
              }[];
          }
        | undefined;
    isNotFoundOrIncomplete: {
        type: string;
        value: boolean;
    };
    allSubCats: string[];
    // allCategories: string[];
}

const ScraperSkuGroups = (props: IScraperSkuGroups) => {
    useEffect(() => {
        const filteredData = getFilteredSKURows({
            skus: props?.skusWithCount,
            jobDetails: props?.jobDetails,
            type:
                props?.isChecked.index === -1
                    ? props?.isChecked.value
                        ? "SelectAll"
                        : "DeSelectAll"
                    : "Multiple",
            index: props?.isChecked.index,
            isChecked: props?.isChecked.value,
            setIsChecked: props?.setIsChecked,
            checkedIndexes: props?.checkedIndexes,
            setCheckedIndexes: props?.setCheckedIndexes,
            isNotFoundOrIncomplete: props?.isNotFoundOrIncomplete,
            allSubCats: props?.allSubCats,
            // allCategories: props?.allCategories,
        });
        props?.setData(filteredData);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props?.isChecked.value, props?.isChecked.index, props?.jobDetails, props?.skuStatus]);

    return (
        <Grid container>
            <Grid container sx={{ marginBottom: "1.3rem", padding: "0.6rem" }}>
                <Grid item sx={{ marginRight: "0.6rem" }}>
                    <StyledCheckbox
                        checked={props?.isChecked.index === -1 ? props?.isChecked.value : false}
                        onChange={() => {
                            if (
                                props.checkedIndexes.length > 0 &&
                                props?.isChecked.value === true
                            ) {
                                props?.setCheckedIndexes([]);
                                props?.setIsChecked({ index: -1, value: true });
                            } else {
                                props?.setIsChecked({ index: -1, value: !props?.isChecked.value });
                            }
                        }}
                    />
                </Grid>
                <Grid item>
                    <Typography>{SCRAPER_SKU_GROUPS.ALL}</Typography>
                </Grid>
            </Grid>
            <Grid container direction={"row"} sx={{ overflowY: "scroll" }}>
                {props?.skusWithCount.map((item, index) => {
                    let isError = false;
                    if (props?.skuStatus)
                        isError = isErrorFound({ skuStatus: props?.skuStatus, sku: item.sku });
                    return (
                        <Grid
                            key={index}
                            container
                            component={Box}
                            sx={{
                                backgroundColor: isError
                                    ? "rgba(218, 0, 0, 0.05)"
                                    : props?.isChecked.value && props?.isChecked.index === -1
                                    ? "#EEEEEE"
                                    : AppTheme.palette.secondary.light,
                                borderBottom: "1px solid #BCBCBB",
                                padding: "0.6rem",
                            }}
                        >
                            <Grid item sx={{ marginRight: "0.6rem" }}>
                                <StyledCheckbox
                                    key={index}
                                    checked={
                                        (props?.isChecked.value &&
                                            props?.isChecked.index === index) ||
                                        (props?.isChecked.value && props?.isChecked.index === -1) ||
                                        props?.checkedIndexes.includes(index)
                                    }
                                    onChange={() => {
                                        if (props?.isChecked.index === index)
                                            props?.setIsChecked({
                                                index: index,
                                                value: !props?.isChecked.value,
                                            });
                                        else
                                            props?.checkedIndexes.includes(index)
                                                ? props?.setIsChecked({
                                                      index: index,
                                                      value: false,
                                                  })
                                                : props?.setIsChecked({
                                                      index: index,
                                                      value: true,
                                                  });
                                    }}
                                />
                            </Grid>
                            {isError && (
                                <ErrorOutlineIcon sx={{ color: "#DA0000", marginRight: "13px" }} />
                            )}
                            <Grid item>
                                <Typography
                                    sx={{
                                        color: isError ? "#DA0000" : "#000000",
                                        fontWeight: 700,
                                        fontSize: "0.8rem",
                                        lineHeight: "18px",
                                        marginTop: "3px",
                                    }}
                                >{`${item.sku} (${item.count})`}</Typography>
                            </Grid>
                        </Grid>
                    );
                })}
            </Grid>
        </Grid>
    );
};

export default ScraperSkuGroups;
