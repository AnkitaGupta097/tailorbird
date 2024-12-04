import React, { useEffect } from "react";
import { isEmpty } from "lodash";
import { Typography, Dialog, Box } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import Button from "components/button";
import AppTheme from "styles/theme";
import actions from "stores/actions";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import { shallowEqual } from "react-redux";
import { useParams } from "react-router";
import ChangeOrderTable from "./change-order-table";

interface IChangeOrderModalProps {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
}
const ChangeOrderModal = ({ modalHandler, openModal }: IChangeOrderModalProps) => {
    const dispatch = useAppDispatch();
    const { projectId } = useParams();

    const { budgetApprovalsAndChangeOrders, loading } = useAppSelector(
        (state) => ({
            budgetApprovalsAndChangeOrders:
                state.singleProject.projectAnalytics.spendAnalysis.budgetApprovalsAndChangeOrders,
            loading: state.singleProject.loading,
        }),
        shallowEqual,
    );

    useEffect(() => {
        if (isEmpty(budgetApprovalsAndChangeOrders)) {
            dispatch(
                actions.singleProject.fetchApprovalChangeOrderStart({
                    project_id: projectId,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                <Typography variant="text_18_bold">Budget Approvals and Change Orders</Typography>
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
                <ChangeOrderTable
                    budgetApprovalsAndChangeOrders={budgetApprovalsAndChangeOrders}
                    loading={loading}
                />
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

export default ChangeOrderModal;
