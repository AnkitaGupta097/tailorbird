import { Grid, SxProps, Typography } from "@mui/material";
import { getCategoryIcon } from "modules/projects/details/budgeting/category-icons";
import React from "react";
import AppTheme from "styles/theme";

interface IScopeItems {
    categoryName: string;
    summary: string;
}

const categoryStyling: SxProps = {
    fontFamily: "Roboto",
    color: "#232323",
    verticalAlign: "middle",
    lineHeight: "39.12px",
};

const summaryTextStyling: SxProps = {
    fontFamily: "Roboto",
    color: AppTheme.text.medium,
    wordWrap: "break-word",
};

const ScopeSummary: React.FC<IScopeItems> = ({ categoryName, summary }) => {
    return (
        <Grid container direction={"row"}>
            <Grid item xs={3}>
                <Grid container direction={"row"} spacing={"16px"}>
                    <Grid item>
                        <Typography sx={categoryStyling}>
                            <img
                                src={getCategoryIcon(categoryName)}
                                alt="icon"
                                width={"40px"}
                                height={"39.12px"}
                            />
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="text_14_medium" sx={categoryStyling}>
                            {categoryName}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={9}>
                <Typography variant="text_14_regular" sx={summaryTextStyling}>
                    {summary}
                </Typography>
            </Grid>
            <hr style={{ width: "100%", color: "#d2d5d8", opacity: 0.5 }} />
        </Grid>
    );
};

export default ScopeSummary;
