import { Accordion, AccordionDetails, AccordionSummary, Grid } from "@mui/material";
import React, { Dispatch, FC, MouseEventHandler, SetStateAction, useState } from "react";
import { getRowFilters } from "../../constants";
import FilterSection from "./filter-section";
import BaseButton from "components/button";
import FilterHeader from "./filter-header";

interface IRowFilter {
    intialFilters: Record<string, string[]>;
    setRowFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
    expanded: boolean;
    setExpanded: Function;
    isWorkTypeDataLoading: boolean;
    isLoading: boolean;
    onCancel: MouseEventHandler<Element>;
    isFloorSplitUsed: boolean;
}

const RowFilters: FC<IRowFilter> = ({
    intialFilters,
    setRowFilters,
    expanded,
    setExpanded,
    onCancel,
    isLoading,
    isWorkTypeDataLoading,
    isFloorSplitUsed,
}) => {
    const { ROW_FILTERS, TOTAL_FILTERS } = getRowFilters(isFloorSplitUsed);
    const [selectedFilters, setSelectedFilter] = useState<Record<string, string[]>>(intialFilters);
    const [temporaryFilters, setTemporaryFilter] = useState<Record<string, string[]>>({});
    const clearFilters = (): void => {
        setSelectedFilter(ROW_FILTERS);
        setRowFilters(ROW_FILTERS);
    };

    return (
        <Accordion
            expanded={expanded}
            onChange={() => {
                setTemporaryFilter(expanded ? {} : selectedFilters);
                setExpanded();
            }}
            disabled={isLoading}
            sx={{
                border: "1px solid #CCCCCC",
            }}
        >
            <AccordionSummary sx={{ m: "0 1rem" }}>
                <FilterHeader
                    areFiltersApplied={Object.values(selectedFilters).flat().length < TOTAL_FILTERS}
                    onClearFilters={clearFilters}
                    expanded={expanded}
                    isLoading={isLoading}
                />
            </AccordionSummary>
            <AccordionDetails>
                <Grid container direction="column" gap="1.4rem" key="row-filters" m="0.5rem 1rem">
                    <Grid item>
                        <Grid container direction="row" gap="1.2rem">
                            {Object.keys(ROW_FILTERS).map((filterName, idx) => {
                                const filterProps = {
                                    filterName,
                                    selectedFilters,
                                    setSelectedFilter,
                                    isWorkTypeDataLoading,
                                    isFloorSplitUsed,
                                };

                                return (
                                    <Grid item key={idx}>
                                        <FilterSection {...filterProps} />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" gap="0.5rem">
                            <Grid item>
                                <BaseButton
                                    label="Cancel"
                                    classes="grey default"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedFilter(temporaryFilters);
                                        onCancel(e);
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <BaseButton
                                    label="Apply"
                                    classes={`primary default`}
                                    onClick={() => {
                                        setTemporaryFilter(selectedFilters);
                                        setRowFilters(selectedFilters);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

export default RowFilters;
