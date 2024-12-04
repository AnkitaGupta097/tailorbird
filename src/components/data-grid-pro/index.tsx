import React from "react";
import { StyledDataGrid } from "./style";
import { GridToolbar, UncapitalizedGridProSlotsComponent } from "@mui/x-data-grid-pro";
import { ReactComponent as Nodata } from "assets/icons/no-data.svg";
import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
interface IBaseDataGridPro {
    columns: any;
    rows: any;
    rowsPerPageOptions: number[];
    hideToolbar?: boolean;
    subComponents?: Partial<UncapitalizedGridProSlotsComponent>;
    [v: string]: any;
}
const StyledGridOverlay = styled("div")(() => ({
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    margin: "5rem",
    "& .ant-empty-img-1": {
        fill: "#aeb8c2",
    },
    "& .ant-empty-img-2": {
        fill: "#f5f5f7",
    },
    "& .ant-empty-img-3": {
        fill: "#dce0e6",
    },
    "& .ant-empty-img-4": {
        fill: "#fff",
    },
    "& .ant-empty-img-5": {
        fillOpacity: "0.8",
        fill: "#f5f5f5",
    },
}));

const BaseDataGridPro = ({
    rows,
    columns,
    rowsPerPageOptions,
    hideToolbar,
    subComponents,
    ...dataGridProps
}: IBaseDataGridPro) => {
    function CustomNoRowsOverlay() {
        return (
            <StyledGridOverlay>
                <Nodata />
                <Box sx={{ mt: 3, mb: 5 }}>
                    <Typography
                        variant="text_14_light"
                        color={"#757575"}
                        textAlign={"center"}
                        sx={{ display: "block" }}
                    >
                        {dataGridProps.customNoDataMessage || "No Rows"}
                    </Typography>
                </Box>
            </StyledGridOverlay>
        );
    }
    const [pageSize, setPageSize] = React.useState<number>(rowsPerPageOptions[0]);
    return (
        <StyledDataGrid
            pageSize={pageSize}
            onPageSizeChange={(newPageSize: any) => setPageSize(newPageSize)}
            pageSizeOptions={rowsPerPageOptions}
            pagination
            autoHeight={dataGridProps.autoHeight ?? true}
            rows={rows}
            columns={columns}
            slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: !hideToolbar ? GridToolbar : null,
                ...subComponents,
            }}
            {...dataGridProps}
        />
    );
};

export default BaseDataGridPro;
