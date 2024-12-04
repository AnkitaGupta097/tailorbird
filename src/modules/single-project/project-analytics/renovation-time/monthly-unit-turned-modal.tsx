import React from "react";
import { Typography, Dialog, Box } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import Button from "components/button";
import AppTheme from "styles/theme";
import MonthlyUnitTurnedTable from "./monthly-unit-turned-table";

interface IMonthlyUnitTurnedModalProps {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
}
const MonthlyUnitTurnedModal = ({ modalHandler, openModal }: IMonthlyUnitTurnedModalProps) => {
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
                <Typography variant="text_18_bold">Month by Month of Units Turned</Typography>
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
                <MonthlyUnitTurnedTable />
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

export default MonthlyUnitTurnedModal;
