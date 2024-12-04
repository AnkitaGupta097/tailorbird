import { Card, CardContent, CardProps, Stack, Typography } from "@mui/material";
import BaseSvgIcon from "components/svg-icon";
import React from "react";

interface IBiddingStatusCard {
    count: number;
    subtitle: string;
    iconPath: string | any;
    cardProps?: CardProps;
    onClick?: Function;
    selected?: boolean;
}

const BiddingStatusCard: React.FC<IBiddingStatusCard> = ({
    iconPath,
    subtitle,
    count,
    cardProps,
    onClick,
    selected,
}) => {
    return (
        <>
            <Card
                {...cardProps}
                sx={{
                    ...cardProps?.sx,
                    opacity: selected ? 1 : 0.5,
                }}
                onClick={() => onClick?.()}
            >
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" mb="1rem">
                        <Typography variant="text_34_semibold">{count}</Typography>
                        <BaseSvgIcon svgPath={iconPath}></BaseSvgIcon>
                    </Stack>
                    <Typography variant="text_16_regular">{subtitle}</Typography>
                </CardContent>
            </Card>
        </>
    );
};

export default BiddingStatusCard;
