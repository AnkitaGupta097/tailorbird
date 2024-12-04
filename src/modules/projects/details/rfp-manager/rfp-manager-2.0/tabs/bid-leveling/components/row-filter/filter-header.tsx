import React, { FC, MouseEventHandler } from "react";
import { CircularProgress, Divider, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface IRowFilterHeader {
    areFiltersApplied: boolean;
    onClearFilters: MouseEventHandler<HTMLButtonElement>;
    expanded: boolean;
    isLoading: boolean;
}

const FilterHeader: FC<IRowFilterHeader> = ({
    areFiltersApplied,
    onClearFilters,
    expanded,
    isLoading,
}) => {
    return (
        <Stack direction="column" width="100%">
            <Stack direction="row" alignItems="center">
                <Typography variant="text_18_medium">
                    Row Details {isLoading && <CircularProgress size={20} />}
                </Typography>
                <Stack
                    direction="row"
                    alignItems="center"
                    ml="1rem"
                    sx={{
                        visibility: !areFiltersApplied ? "hidden" : "visible",
                    }}
                >
                    <FiberManualRecordIcon htmlColor="#00B779" fontSize="small" />
                    <IconButton onClick={onClearFilters}>
                        <CloseIcon fontSize="small" />
                        <Typography variant="text_14_medium" fontFamily="Roboto">
                            Clear all filters
                        </Typography>
                    </IconButton>
                </Stack>
                <KeyboardArrowDownIcon
                    sx={{
                        marginLeft: "auto",
                        marginRight: 0,
                        transform: expanded ? "rotate(180deg)" : "none",
                    }}
                />
            </Stack>
            {expanded ? <Divider flexItem /> : null}
        </Stack>
    );
};

export default FilterHeader;
