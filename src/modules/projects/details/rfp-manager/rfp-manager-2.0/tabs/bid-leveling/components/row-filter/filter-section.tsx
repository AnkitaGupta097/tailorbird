import { CircularProgress, Grid, Typography } from "@mui/material";
import React, { Dispatch, FC, SetStateAction } from "react";
import { getRowFilters, FONT_COLOR, FILTER_CHIP_BG_COLOR } from "../../constants";
import FilterChip from "./filter-chip";

interface ISection {
    filterName: string;
    selectedFilters: Record<string, string[]>;
    setSelectedFilter: Dispatch<SetStateAction<Record<string, string[]>>>;
    isWorkTypeDataLoading: boolean;
    isFloorSplitUsed: boolean;
}

const FilterSection: FC<ISection> = ({
    filterName,
    selectedFilters,
    setSelectedFilter,
    isWorkTypeDataLoading,
    isFloorSplitUsed,
}) => {
    const { ROW_FILTERS } = getRowFilters(isFloorSplitUsed);
    const handleFilterChange = (filterName: string, label: string): void =>
        setSelectedFilter({
            ...selectedFilters,
            [filterName]: selectedFilters[filterName].includes(label)
                ? selectedFilters[filterName].filter((filteredLabel) => filteredLabel !== label)
                : [...selectedFilters[filterName], label],
        });

    return (
        <Grid container>
            <Grid item>
                <Typography variant="valueText" fontFamily="Roboto">
                    {filterName}
                </Typography>
            </Grid>
            <Grid container direction="row" gap="0.4rem" marginTop="0.5rem">
                {ROW_FILTERS[filterName].map((label, idx) => {
                    const isFilterSelected = selectedFilters[filterName]?.includes(label);

                    const chipProps = {
                        bgColor: isFilterSelected ? FILTER_CHIP_BG_COLOR : "white",
                        label,
                        labelColor: FONT_COLOR.defaultFont,
                        checkIconVisible: isFilterSelected,
                        onClickHandler: () => handleFilterChange(filterName, label),
                    };

                    return (
                        <Grid item key={idx}>
                            {isWorkTypeDataLoading && filterName?.toLowerCase() === "work type" ? (
                                <CircularProgress size={25} />
                            ) : (
                                <FilterChip {...chipProps} />
                            )}
                        </Grid>
                    );
                })}
            </Grid>
        </Grid>
    );
};

export default FilterSection;
