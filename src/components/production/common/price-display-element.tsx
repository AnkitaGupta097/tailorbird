import React from "react";
import { IconButton, Typography, TypographyPropsVariantOverrides } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { getRoundedOffAndFormattedAmount } from "../helper";
import { isNil } from "lodash";

interface IPriceDisplayElement {
    startPrice: number;
    currentPrice: number;
    variant: keyof TypographyPropsVariantOverrides;
}

const PriceDisplayElement = ({ startPrice, currentPrice = 0, variant }: IPriceDisplayElement) => {
    const priceDifference = isNil(startPrice) ? 0 : currentPrice - startPrice;

    const displayPrice = `$${getRoundedOffAndFormattedAmount(currentPrice || 0)}`;

    const priceDetail = { displayPrice, priceDifference };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "2px",
                color: "black",
            }}
        >
            {priceDetail.priceDifference != 0 &&
                (priceDetail.priceDifference > 0 ? (
                    <IconButton color="error">
                        <ArrowUpwardIcon />
                    </IconButton>
                ) : (
                    <IconButton color="info">
                        <ArrowDownwardIcon />
                    </IconButton>
                ))}
            <Typography variant={variant}>{priceDetail.displayPrice}</Typography>
        </div>
    );
};

export default PriceDisplayElement;
