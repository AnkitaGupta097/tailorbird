import React from "react";
import { Grid, Link, Typography } from "@mui/material";
import "./content-placeholder.css";
import AppTheme from "../../styles/theme";
import Icon from "../../assets/icons/icon-exclamation.svg";

interface IContentPlaceholder {
    text: string;
    aText: string;
    onLinkClick?: any;
    height?: any;
    isLink?: any;
    actionItem?: any;
    minHeight?: any;
}

const ContentPlaceholder = ({
    text,
    aText,
    onLinkClick,
    height,
    isLink,
    actionItem,
}: IContentPlaceholder) => {
    return (
        <Grid
            container
            className="Content-placeholder-container"
            style={{ height: height || "auto" }}
            justifyContent={"center"}
        >
            <Grid
                item
                md={9}
                sm={12}
                lg={9}
                xl={9}
                className="Content-placeholder-section"
                justifyContent={"center"}
            >
                <img src={Icon} alt="exclamation icon" />
                <div>
                    <Typography variant="text_18_regular">{text}</Typography>
                </div>
                {isLink && (
                    <Link
                        onClick={onLinkClick}
                        sx={{
                            color: AppTheme.error.scraper,
                            textDecorationColor: AppTheme.error.scraper,
                            cursor: "pointer",
                        }}
                    >
                        {aText}
                    </Link>
                )}
                {actionItem}
            </Grid>
        </Grid>
    );
};

export default ContentPlaceholder;
