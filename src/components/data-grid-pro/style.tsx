import styled from "@emotion/styled";
import { DataGridPro } from "@mui/x-data-grid-pro";

export const StyledDataGrid = styled(DataGridPro)<any>(() => ({
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
    "& .super-app-theme--parent": {
        backgroundColor: "#A4E8F2",
        "&:hover": {
            backgroundColor: "#A4E8F2",
        },
        "&.Mui-selected": {
            backgroundColor: "#A4E8F2",
        },
    },
    ".MuiDataGrid-columnHeaders": {
        borderBottom: "2px solid #234947",
        backgroundColor: "#EEEEEE",
        lineHeight: "unset",
    },
    ".stack-columnHeaders": {
        width: "100%",
        display: "flex",
        position: "sticky" as "sticky",
        top: "13rem",
        zIndex: "10",
    },
    ".MuiDataGrid-toolbarContainer": {
        backgroundColor: "#EEEEEE",
        flexDirection: "row-reverse" as "row-reverse",
    },
    ".MuiDataGrid-columnHeader:focus": {
        outline: "none",
    },
    ".MuiDataGrid-columnHeader:focus-within": {
        outline: "none",
    },
    ".MuiDataGrid-sortIcon": {
        color: "#57B6B2 !important",
    },
    ".MuiDataGrid-columnHeaderTitle": {
        fontSize: "0.8rem",
        fontWeight: 600,
    },
    ".MuiDataGrid-columnHeaderTitleContainerContent": {
        fontSize: "0.8rem",
        fontWeight: 600,
        display: "flex",
    },
    ".MuiTablePagination-selectLabel": {
        color: "#757575",
        fontWeight: 400,
        fontSize: "0.8rem",
    },
    ".MuiTablePagination-select": {
        borderRadius: "0.1rem",
        textAlign: "center" as "center",
    },
    ".MuiTablePagination-displayedRows": {
        fontWeight: 400,
        fontSize: "0.75rem",
    },
    ".MuiDataGrid-footerContainer": {
        background: "#EEEEEE",
    },
    ".cellPadding0": {
        padding: "0 !important",
        width: "100% !important",
    },
    ".MuiDataGrid-columnHeaderTitleContainer": {
        width: "inherit",
    },
    ".hidden": {
        backgroundColor: "#ffffff",
        zIndex: 1,
        color: "#ffff",
    },
    ".groupParent": {
        fontWeight: 500,
        color: "#232323",
        fontSize: "14px",
    },
    ".groupChild": {
        " .MuiDataGrid-treeDataGroupingCell": {
            fontWeight: "400 !important",
        },
        fontWeight: "400 !important",
        fontSize: "12px",
        color: "#232323",
        textIndent: "30px",
    },
}));
