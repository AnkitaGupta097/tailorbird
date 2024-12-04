import styled from "@emotion/styled";
import {
    TableHead,
    TableHeadProps,
    TableRow,
    TableRowProps,
    TableSortLabel,
    TableSortLabelProps,
} from "@mui/material";

export const StyledTableHead = styled(TableHead)<TableHeadProps>(() => ({
    borderBottom: "2px solid #234947",
    backgroundColor: "#EEEEEE",
}));

export const StyledTableSortLabel = styled(TableSortLabel)<TableSortLabelProps>(() => ({
    ":hover": {
        color: "black",
    },
    "& .MuiTableSortLabel-icon": {
        color: "#57B6B2 !important",
    },
}));

export const StyledTableRow = styled(TableRow)<TableRowProps>(() => ({}));
