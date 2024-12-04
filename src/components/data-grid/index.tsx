import React from "react";
import { StyledDataGrid } from "./style";

interface IBaseDataGrid {
    columns: any;
    rows: any;
    rowsPerPageOptions: number[];
    [v: string]: any;
}

const BaseDataGrid = ({ rows, columns, rowsPerPageOptions, ...dataGridProps }: IBaseDataGrid) => {
    const [pageSize, setPageSize] = React.useState<number>(rowsPerPageOptions[0]);
    return (
        <StyledDataGrid
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={rowsPerPageOptions}
            pagination
            autoHeight={true}
            rows={rows}
            columns={columns}
            disableColumnMenu={true}
            {...dataGridProps}
        />
    );
};

export default BaseDataGrid;
