import { Box, Stack, Typography } from "@mui/material";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

import React from "react";

interface IExpandRows {
    isScopeDetailFiltered: boolean;
    isInitalDataLoading: boolean;
    groupingExpansionDepth: number;
    setGroupingExpansionDepth: any;
}

const ExpandRows: React.FC<IExpandRows> = ({
    isScopeDetailFiltered,
    isInitalDataLoading,
    groupingExpansionDepth,
    setGroupingExpansionDepth,
}) => {
    return (
        <Stack
            direction={"row-reverse"}
            alignItems={"center"}
            spacing={2}
            onClick={() => {
                !isScopeDetailFiltered
                    ? setGroupingExpansionDepth(groupingExpansionDepth == 0 ? 1 : 0)
                    : false;
            }}
            style={{
                cursor: "pointer",
            }}
        >
            <Typography variant="text_14_bold" fontSize={"0.8rem"} style={{ marginLeft: "0.5rem" }}>
                {isInitalDataLoading ? "" : "Category"}
            </Typography>
            <Box
                style={{
                    display: isScopeDetailFiltered ? "none" : "flex",
                    width: "1.2rem",
                    height: "1.2rem",
                    alignItems: "center",
                }}
            >
                {groupingExpansionDepth == 0 ? (
                    <KeyboardArrowRightOutlinedIcon />
                ) : (
                    <KeyboardArrowDownOutlinedIcon />
                )}
            </Box>
        </Stack>
    );
};

export default ExpandRows;
