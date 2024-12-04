import React, { useState } from "react";
import { Typography, Dialog, Box, Grid } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import Button from "components/button";
import AppTheme from "styles/theme";
import RenoTimeTable from "./renovation-time-table";
import TableColumnFilter from "./table-column-filter";
import { useAppSelector } from "stores/hooks";
import { shallowEqual } from "react-redux";

interface IRenoTimeModalProps {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
}
const RenoTimeModal = ({ modalHandler, openModal }: IRenoTimeModalProps) => {
    const { columns } = useAppSelector(
        (state) => ({
            columns: state.singleProject.projectAnalytics.renovationTime.renoTimeByUnit.columns,
        }),
        shallowEqual,
    );

    const [selectedColumns, setSelectedColumns] = useState(columns);

    return (
        <Dialog
            open={openModal}
            fullWidth={true}
            maxWidth={"lg"}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => modalHandler(false)}
        >
            <Box
                p={6}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2.5}
                sx={{ borderBottom: `1px solid ${AppTheme.border.inner}` }}
            >
                <Typography variant="text_18_bold">Renovation Time by Unit</Typography>
                <CloseOutlined
                    sx={{
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onClick={() => {
                        modalHandler(false);
                    }}
                />
            </Box>
            <Box p={6} minHeight="150px">
                <Grid container justifyContent={"flex-end"} marginBottom={"16px"}>
                    <Grid item>
                        <TableColumnFilter
                            columns={[
                                { label: "Unit Number", value: "unit_number" },
                                { label: "Unit Type", value: "unit_type" },
                                { label: "Floorplan Type", value: "floor_plan_type" },
                                { label: "Inventory", value: "inventory" },
                            ]}
                            selectedColumns={selectedColumns}
                            onApply={(value: any) => {
                                setSelectedColumns(value);
                            }}
                        />
                    </Grid>
                </Grid>

                <RenoTimeTable columns={selectedColumns} />
            </Box>
            <Box>
                <Box pb={5} px={6} display="flex" justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        style={{ height: "40px" }}
                        onClick={() => modalHandler(false)}
                        label={""}
                    >
                        <Typography variant="text_16_semibold"> Close</Typography>
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default RenoTimeModal;
