import styled from "@emotion/styled";
import { DataGrid, DataGridProps } from "@mui/x-data-grid";

export const StyledDataGrid = styled(DataGrid)<DataGridProps>(() => ({
    "& .super-app-theme--created": {
        backgroundColor: "#ECF6F1",
        "&:hover": {
            backgroundColor: "#ECF6F1",
        },
        "&.Mui-selected": {
            backgroundColor: "#ECF6F1",
        },
    },
    "& .super-app-theme--updated": {
        backgroundColor: "#FFF5EA",
        "&:hover": {
            backgroundColor: "#FFF5EA",
        },
        "&.Mui-selected": {
            backgroundColor: "#FFF5EA",
        },
    },
    "& .super-app-theme--deleted": {
        backgroundColor: "#FFF4F4",
        "&:hover": {
            backgroundColor: "#FFF4F4",
        },
        "&.Mui-selected": {
            backgroundColor: "#FFF4F4",
        },
    },
    ".MuiDataGrid-columnHeaders": {
        borderBottom: "2px solid #234947",
        backgroundColor: "#EEEEEE",
    },
    ".MuiDataGrid-columnHeader:focus": {
        outline: "none",
    },
    ".MuiDataGrid-columnHeader:focus-within": {
        outline: "none",
    },
    ".MuiDataGrid-cell:focus": {
        outline: "none",
    },
    ".MuiDataGrid-cell:focus-within": {
        outline: "none",
    },
    ".MuiDataGrid-sortIcon": {
        color: "#57B6B2 !important",
    },
    ".MuiDataGrid-columnHeaderTitle": {
        fontSize: "0.8rem",
        fontWeight: 600,
    },
    ".MuiTablePagination-selectLabel": {
        color: "#757575",
        fontWeight: 400,
        fontSize: "0.8rem",
        lineHeight: "1.1rem",
    },
    ".MuiTablePagination-select": {
        borderRadius: "0.1rem",
        textAlign: "center" as "center",
    },
    ".MuiSelect-icon": {
        marginRight: 0,
        color: "#004D71",
    },
    ".MuiTablePagination-displayedRows": {
        fontWeight: 400,
        fontSize: "0.75rem",
    },
    ".MuiDataGrid-selectedRowCount": {
        visibility: "hidden" as "hidden",
    },
    ".MuiDataGrid-footerContainer": {
        background: "#EEEEEE",
    },
    "& .multiline": {
        whiteSpace: "pre-line",
    },
}));
