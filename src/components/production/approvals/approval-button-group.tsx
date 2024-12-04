import { Button, Grid, Typography } from "@mui/material";
import React from "react";

interface IApprovalButtonGroupProps {
    onClickViewDetail?: any;
    onReject?: any;
    onApprove?: any;
    canReviewRequest?: boolean;
}

const ApprovalButtonGroup = (props: IApprovalButtonGroupProps) => {
    const { onClickViewDetail, onReject, onApprove, canReviewRequest } = props;
    return (
        <Grid container spacing={4} sx={{ marginTop: "16px" }}>
            <Grid item xs={12}>
                <Button
                    color="secondary"
                    variant="contained"
                    sx={{ width: "100%" }}
                    onClick={onClickViewDetail}
                >
                    <Typography variant="text_16_medium">View Details</Typography>
                </Button>
            </Grid>
            {canReviewRequest && (
                <>
                    <Grid item xs={6}>
                        <Button
                            color="primary"
                            variant="contained"
                            sx={{ width: "100%" }}
                            onClick={onReject}
                        >
                            <Typography variant="text_16_medium">Reject Selected</Typography>
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            color="primary"
                            variant="contained"
                            sx={{ width: "100%" }}
                            onClick={onApprove}
                        >
                            <Typography variant="text_16_medium">Approve Selected</Typography>
                        </Button>
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default ApprovalButtonGroup;
