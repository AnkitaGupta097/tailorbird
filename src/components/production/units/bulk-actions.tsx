import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import BaseCheckbox from "components/checkbox";

interface IBulkActionsProps {
    buttonType: "start-scope" | "complete-scope";
    totalScopes: number;
    selectedLength: number;
    onToggle: () => void;
    onButtonClick: () => void;
}

const BulkActions = ({
    buttonType,
    totalScopes,
    selectedLength,
    onToggle,
    onButtonClick,
}: IBulkActionsProps) => {
    return (
        <Grid container gap={3} alignItems="center">
            <Grid item>
                <BaseCheckbox
                    size="small"
                    sx={{ marginRight: "8px" }}
                    checked={selectedLength > 0}
                    onClick={onToggle}
                    indeterminate={selectedLength > 0 && totalScopes != selectedLength}
                />
                <Typography variant="text_14_semibold">{`${selectedLength}/${totalScopes} selected`}</Typography>
            </Grid>
            {selectedLength > 0 && (
                <Grid item>
                    <Button
                        variant={"contained"}
                        color={buttonType === "start-scope" ? "success" : "primary"}
                        onClick={() => onButtonClick()}
                    >
                        <Typography variant="text_16_medium">
                            {buttonType === "start-scope" ? "Start scopes" : "Mark as Complete"}
                        </Typography>
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};

export default BulkActions;
