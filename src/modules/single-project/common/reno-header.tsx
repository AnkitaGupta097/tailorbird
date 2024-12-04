/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Typography, Box } from "@mui/material";
import appTheme from "styles/theme";

interface IRenoHeader {
    title: string;
    subTitle?: string;
}
const RenoHeader = ({ title, subTitle }: IRenoHeader) => {
    return (
        <Box>
            <Typography variant="text_34_regular">{title}</Typography>
            <br />
            {subTitle && (
                <Typography variant="text_18_regular" color={appTheme.border.medium}>
                    {subTitle}
                </Typography>
            )}
        </Box>
    );
};

export default RenoHeader;
