import React from "react";
import { Box, BoxProps, styled, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { ReactComponent as ErrorIcon } from "../../../../../assets/icons/error-icon.svg";
import AppTheme from "../../../../../styles/theme";

const ErrorGridBox = styled(Box)<BoxProps>(({ theme }) => ({
    marginBottom: "10px",
    display: "flex",
    padding: "11px",
    borderRadius: "5px",
    justifyContent: "space-between",
    border: `1.5px solid ${theme.text.error}`,
    backgroundColor: theme.background.error,
}));

interface IErrorGrid {
    title: String;
    onCheck: any;
    actionText: String;
}

const ErrorGrid = ({ title, onCheck, actionText }: IErrorGrid) => {
    return (
        <ErrorGridBox mb={2.5}>
            <Box display="flex" pl={1} alignItems="center">
                <Box pr={2} pt={0.1}>
                    <ErrorIcon />
                </Box>
                <Typography variant="text_16_regular">{title}</Typography>
            </Box>
            <Box>
                <FormControlLabel
                    sx={{
                        "& span": {
                            padding: "0px",
                        },
                    }}
                    control={
                        <Checkbox
                            // checked={!isEmpty(unselectedInventory)}
                            onChange={(e: any) => onCheck(e)}
                            sx={{
                                color: AppTheme.text.info,
                                marginRight: "4px",
                            }}
                        />
                    }
                    label={<Typography variant="text_16_regular">{actionText}</Typography>}
                    labelPlacement="end"
                />
            </Box>
        </ErrorGridBox>
    );
};

export default React.memo(ErrorGrid);
