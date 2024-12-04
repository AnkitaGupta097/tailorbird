import { Grid, SxProps, Typography, Link } from "@mui/material";
import React, { useState } from "react";
import BaseButton from "components/button";
import AppTheme from "styles/theme";
import DownloadIcon from "@mui/icons-material/Download";

interface IFloorplanSummaryItems {
    fpImgPath: string;
    bedCount: number;
    bathCount: number;
    totalSQFT: number;
    totalUnits: number;
    summary: string;
    disableBedBathCount: boolean;
}

const headingTextStyling: SxProps = {
    fontFamily: "Roboto",
    color: AppTheme.text.medium,
};

const dataTextStyling: SxProps = {
    fontFamily: "Roboto",
    fontSize: "14px",
    color: "#232323",
    fontWeight: 400,
};

const summaryTextStyling: SxProps = {
    fontFamily: "Roboto",
    color: AppTheme.text.medium,
    position: "absolute",
    wordWrap: "break-word",
    maxWidth: "60%",
};

const FloorplanSummary: React.FC<IFloorplanSummaryItems> = ({
    fpImgPath,
    bedCount,
    bathCount,
    totalSQFT,
    totalUnits,
    disableBedBathCount,
    summary,
}) => {
    const [showPDFButton, setShowPDFButton] = useState<boolean>(false);
    let fpData: { heading: string; data: string }[] = disableBedBathCount
        ? [{ heading: "Total SQ FT", data: `${totalSQFT ? totalSQFT : "NA"}` }]
        : [
              {
                  heading: "Bedroom(s) / bath(s)",
                  data: `${bedCount ? bedCount : "NA"} / ${bathCount ? bathCount : "NA"}`,
              },
              { heading: "Total SQ FT", data: `${totalSQFT ? totalSQFT : "NA"}` },
              { heading: "Total units (expected)", data: `${totalUnits ? totalUnits : "NA"}` },
          ];

    return (
        <Grid container direction={"row"} spacing={"24px"} paddingTop={"24px"}>
            {fpImgPath?.length > 0 && (
                <Grid
                    item
                    xs={3}
                    sm={"auto"}
                    onMouseOver={() => setShowPDFButton(true)}
                    onMouseOut={() => setShowPDFButton(false)}
                >
                    <Link
                        style={{
                            display: showPDFButton ? "" : "none",
                            position: "absolute",
                            left: "5%",
                            top: "63%",
                            ...(showPDFButton && { zIndex: 1 }),
                        }}
                        itemRef="noreferrer"
                        href={fpImgPath}
                    >
                        <BaseButton
                            classes="primary default"
                            startIcon={<DownloadIcon />}
                            label="Download"
                            onClick={() => {}}
                        />
                    </Link>
                    <img
                        src={fpImgPath}
                        alt="Floorplan IMG isn't available"
                        width={"280px"}
                        height={"180px"}
                        style={{
                            opacity: showPDFButton ? 0.6 : 1,
                            minWidth: "280px",
                            minHeight: "180px",
                        }}
                    />
                </Grid>
            )}
            <Grid item xs={1.5} sm={"auto"}>
                <Grid container direction={"column"} spacing={"24px"}>
                    {fpData?.map(({ heading, data }, idx) => (
                        <Grid key={`${idx}-${heading.slice(0, 3)}`} item>
                            <Typography variant="text_10_regular" sx={headingTextStyling}>
                                {heading}
                            </Typography>
                            <Typography sx={dataTextStyling}>{data}</Typography>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Grid item xs sm>
                <Typography sx={summaryTextStyling} variant="text_14_regular">
                    {summary}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default FloorplanSummary;
