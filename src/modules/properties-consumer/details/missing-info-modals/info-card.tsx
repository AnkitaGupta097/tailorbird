import React from "react";
import "./style.css";
import { ReactComponent as InfoIconTbBlue } from "assets/icons/info-icon-tb-blue.svg";
import { ReactComponent as OpenInNewIcon } from "assets/icons/open_in_new.svg";
import { Box, Grid, Typography } from "@mui/material";

export const InfoCard = ({
    type,
    forgeMissingDetailTypesObj,
    dataKey,
    openMissingInfoModal,
    isCombined,
    enableAllMissingInfo,
    setShowingAllMissingInfo,
    showPropertyData,
}: any) => {
    const getFormattedString = () => {
        let formattedArray: any = ["We need your help gathering information about "];

        forgeMissingDetailTypesObj &&
            Object.keys(forgeMissingDetailTypesObj)
                .filter((key) => forgeMissingDetailTypesObj[key] > 0)
                .map((key, index, array) => {
                    if (index !== 0) {
                        if (index === array.length - 1) {
                            formattedArray.push(
                                <Typography variant="text_14_semibold" key={key}>
                                    {` and `}
                                </Typography>,
                            );
                        } else {
                            formattedArray.push(
                                <Typography variant="text_14_semibold" key={key}>
                                    {`, `}
                                </Typography>,
                            );
                        }
                    }
                    formattedArray.push(
                        <Typography variant="text_14_semibold" key={key}>
                            {`${key} (${forgeMissingDetailTypesObj[key]})`}
                        </Typography>,
                    );
                });
        return formattedArray;
    };
    const getTopClass = () => {
        if (isCombined && !showPropertyData) {
            return "fullWidthBox box fullWidth";
        } else if (isCombined && showPropertyData) {
            return "box";
        } else {
            return "box";
        }
    };
    return (
        <div className={`${getTopClass()}`}>
            <div
                className="rectangle"
                style={{
                    padding: `${showPropertyData ? "10px" : "0px 0px 0px 10px"}`,
                    cursor: "pointer",
                }}
            >
                <Grid
                    display={"grid"}
                    gridAutoFlow={"column"}
                    width={"100%"}
                    justifyContent={"space-evenly"}
                    gap={"10px"}
                    onClick={() => {
                        if (isCombined) {
                            enableAllMissingInfo(true);
                        } else {
                            setShowingAllMissingInfo(false);
                            openMissingInfoModal({ dataKey: dataKey, title: type });
                        }
                    }}
                >
                    {isCombined ? <OpenInNewIcon /> : <InfoIconTbBlue />}
                    <Grid
                        display={"grid"}
                        gridAutoFlow={"row"}
                        width={"100%"}
                        justifyContent={"space-evenly"}
                    >
                        <Box display="flex" gap={"10px"}>
                            <Typography variant="text_14_semibold">{type}</Typography>
                            {!isCombined && <OpenInNewIcon />}
                        </Box>
                        {!isCombined ? (
                            <Typography variant="text_16_regular">
                                {`Missing information (${forgeMissingDetailTypesObj})`}
                            </Typography>
                        ) : (
                            <Typography variant="text_12_regular">
                                {getFormattedString()}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};
