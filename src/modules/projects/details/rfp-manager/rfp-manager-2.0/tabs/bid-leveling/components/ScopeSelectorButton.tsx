import React, { FC, MouseEventHandler } from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";
import BaseButton from "components/button";

interface IScopeSelectorButton {
    isDisabled: boolean;
    onClickHandler: MouseEventHandler<HTMLButtonElement>;
    isViewMode: boolean;
    onCancelClick: MouseEventHandler<HTMLButtonElement>;
}

const ScopeSelectorButton: FC<IScopeSelectorButton> = ({
    isDisabled,
    isViewMode,
    onClickHandler,
    onCancelClick,
}) =>
    isViewMode ? (
        <IconButton disabled={isDisabled} edge="end" onClick={onClickHandler}>
            <ChecklistIcon />
            <Typography variant="text_18_regular" textAlign="center" lineHeight="20px">
                Scope Selector
            </Typography>
        </IconButton>
    ) : (
        <Stack direction="row" m="1rem 0rem" gap="0.5rem">
            <BaseButton label="Cancel" classes="grey default" onClick={onCancelClick} />
            <BaseButton label="Apply" classes="primary default" onClick={onClickHandler} />
        </Stack>
    );

export default ScopeSelectorButton;
