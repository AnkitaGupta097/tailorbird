import BaseTextField from "components/text-field";
import BaseButton from "components/button";
import AddIcon from "@mui/icons-material/Add";
import { Grid, Stack, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { IAdminTemplate } from "../utils/interfaces";
import { KebabMenuIcon } from "../utils/constants";
import DataGridPro from "components/data-grid-pro";

const AdminTemplate: React.FC<IAdminTemplate> = ({
    onClick,
    title,
    buttonText,
    columns,
    rows,
    rowsPerPage,
    onSearch,
    disabled,
    onRowClick,
}) => {
    return (
        <>
            <Grid container pl="3rem" pr="3rem" direction="column" spacing={4}>
                <Grid item sm mt={4} alignItems="flex-end">
                    <Stack direction="row" alignItems="stretch">
                        <Typography
                            variant="text_24_medium"
                            sx={{
                                marginRight: "auto",
                                display: "flex",
                                alignItems: "flex-end",
                            }}
                        >
                            {title}
                        </Typography>
                        <BaseTextField
                            InputProps={{ endAdornment: <SearchIcon htmlColor="#757575" /> }}
                            variant="outlined"
                            size="small"
                            placeholder={`Search for ${buttonText}`}
                            onChange={(e: any) => {
                                onSearch(e.target.value);
                            }}
                            sx={{
                                marginRight: "1rem",
                                width: "25rem",
                            }}
                        />
                        <BaseButton
                            classes="primary default"
                            onClick={() => onClick()}
                            label={buttonText}
                            startIcon={<AddIcon />}
                            disabled={disabled}
                        />
                    </Stack>
                </Grid>
                <Grid item sm>
                    <DataGridPro
                        disableColumnMenu={false}
                        columns={columns}
                        rows={rows}
                        rowsPerPageOptions={rowsPerPage}
                        components={{
                            MoreActionsIcon: KebabMenuIcon,
                        }}
                        onRowClick={onRowClick}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 20 } },
                        }}
                    ></DataGridPro>
                </Grid>
            </Grid>
        </>
    );
};
export default AdminTemplate;
