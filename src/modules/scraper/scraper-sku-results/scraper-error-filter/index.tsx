import { Grid, Typography } from "@mui/material";
import { StyledCheckbox } from "..";
import React, { useEffect } from "react";
import { getFilteredSKURows } from "../common/helper";

const ScraperErrorFilter = (props: any) => {
    let values = Object.values(props?.isNotFoundOrIncomplete);

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
        });
        props?.setData(filteredData);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props?.isNotFoundOrIncomplete?.value, props?.isNotFoundOrIncomplete?.type]);

    return (
        <Grid item>
            <Grid container gap="5px">
                <Grid item>
                    <StyledCheckbox
                        key={props?.key}
                        checked={
                            (props?.filterText === "Not found" &&
                                props?.isNotFoundOrIncomplete?.type === "not_found" &&
                                props?.isNotFoundOrIncomplete?.value === true) ||
                            (props?.filterText === "Incomplete" &&
                                props?.isNotFoundOrIncomplete?.type === "incomplete" &&
                                props?.isNotFoundOrIncomplete?.value === true)
                        }
                        onChange={() => {
                            if (props?.filterText === "Not found") {
                                if (values?.[0] === "not_found") {
                                    props?.setIsNotFoundOrIncomplete({
                                        type: "not_found",
                                        value: !props?.isNotFoundOrIncomplete.value,
                                    });
                                } else {
                                    props?.setIsNotFoundOrIncomplete({
                                        type: "not_found",
                                        value: true,
                                    });
                                }
                            } else if (props?.filterText === "Incomplete") {
                                if (values?.[0] === "incomplete") {
                                    props?.setIsNotFoundOrIncomplete({
                                        type: "incomplete",
                                        value: !props?.isNotFoundOrIncomplete.value,
                                    });
                                } else {
                                    props?.setIsNotFoundOrIncomplete({
                                        type: "incomplete",
                                        value: true,
                                    });
                                }
                            }
                        }}
                    />
                </Grid>
                <Grid item>
                    <Typography
                        sx={{
                            color: "#000000",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                        }}
                    >
                        {props?.filterText}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ScraperErrorFilter;
