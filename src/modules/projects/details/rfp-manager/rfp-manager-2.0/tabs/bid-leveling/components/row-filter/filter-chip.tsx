import React, { FC, MouseEventHandler } from "react";
import { Chip, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { FONT_COLOR } from "../../constants";

interface IFilterChip {
    onClickHandler: MouseEventHandler<HTMLDivElement>;
    checkIconVisible: boolean;
    bgColor: string;
    label: string;
    labelColor: string;
}

const FilterChip: FC<IFilterChip> = ({
    onClickHandler,
    checkIconVisible,
    bgColor,
    label,
    labelColor,
}) => {
    const chipIcon = checkIconVisible ? <CheckIcon htmlColor={FONT_COLOR.defaultFont} /> : <></>;
    const chipLabel = (
        <Typography variant="text_14_medium" fontFamily="Roboto" color={labelColor}>
            {label}
        </Typography>
    );

    const props = {
        clickable: true,
        onClick: onClickHandler,
        style: {
            borderRadius: "4px",
            fontFamily: "Roboto",
            background: bgColor,
            border: "1px solid #6A6464",
        },
        label: chipLabel,
        icon: chipIcon,
    };

    return <Chip {...props} />;
};

export default FilterChip;
