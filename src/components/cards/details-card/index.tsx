import {
    Box,
    Card,
    CardContent,
    CardProps,
    Chip,
    Container,
    Stack,
    Typography,
} from "@mui/material";
import React from "react";
import BaseProgressBar from "components/progress-bar";
import BaseChip from "components/chip";

const removeNoneInAddress = (address: string): string => {
    return address
        .split(", ")
        .filter((str) => str !== "None")
        .join(", ");
};

interface IDetailsCard {
    cardProps?: CardProps;
    leftBorderColor: string;
    imgSrc?: string;
    propertyName: string;
    propertyAddress: string;
    organization: string;
    showProgress?: boolean;
    progress?: number;
    progressText?: string;
    chipLabel: string | React.ReactNode;
    chipBgColor: string;
    chipLabelColor: string;
    showText?: boolean;
    text?: string;
    maxBiddersText?: string;
    rfpVersion?: string;
    greyScaleImg?: boolean;
    projectType: string;
    projectTypeBgColor: string;
}

const ProjectDetailsCard: React.FC<IDetailsCard> = ({
    cardProps,
    leftBorderColor,
    imgSrc,
    propertyName,
    propertyAddress,
    organization,
    showProgress,
    progress,
    progressText,
    chipLabel,
    chipBgColor,
    chipLabelColor,
    showText,
    text,
    maxBiddersText,
    rfpVersion = "2.0",
    greyScaleImg,
    projectType,
    projectTypeBgColor,
}) => {
    return (
        <>
            <Card
                {...cardProps}
                sx={{
                    ".MuiCardContent-root": {
                        padding: "0",
                        paddingRight: "2rem",
                    },
                    borderLeft: `1rem solid ${leftBorderColor}`,
                    borderRadius: "8px",
                    ...cardProps?.sx,
                }}
            >
                <CardContent>
                    <Stack
                        direction="row"
                        spacing={8}
                        alignItems="center"
                        justifyContent="space-between"
                        height="100%"
                        minHeight="100%"
                    >
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            height="100%"
                            ml=".5rem"
                            position="relative"
                        >
                            {imgSrc && (
                                <>
                                    <img
                                        src={imgSrc}
                                        alt="Property"
                                        style={{
                                            width: "10rem",
                                            height: "6.25rem",
                                            objectFit: "fill",
                                            filter: greyScaleImg ? "grayscale(100%)" : "none",
                                        }}
                                    />
                                    <Chip
                                        label={projectType}
                                        style={{
                                            position: "absolute",
                                            right: "415px",
                                            bottom: "5px",
                                        }}
                                        sx={{
                                            border: "1px solid white",
                                            borderRadius: "4px",
                                            background: projectTypeBgColor,
                                            color: "white",
                                        }}
                                    />
                                </>
                            )}
                            {!imgSrc && (
                                <Box
                                    sx={{
                                        width: "10rem",
                                        height: "6.25rem",
                                        backgroundColor: "#D9D9D9",
                                    }}
                                />
                            )}
                            <Stack direction="column" minWidth={"25rem"}>
                                <Typography variant="text_16_bold" mb=".5rem">
                                    {propertyName}
                                </Typography>
                                <Typography variant="text_12_regular">
                                    {removeNoneInAddress(propertyAddress)}
                                </Typography>
                                {organization && organization?.trim() !== "" ? (
                                    <Chip
                                        variant="outlined"
                                        label={organization}
                                        sx={{
                                            borderRadius: "5px",
                                            color: "#00344D",
                                            borderColor: "#00344D",
                                            maxWidth: "7.5rem",
                                            mt: 3,
                                        }}
                                    />
                                ) : (
                                    <></>
                                )}
                            </Stack>
                        </Stack>
                        {showProgress && rfpVersion === "2.0" ? (
                            <BaseProgressBar
                                sx={{
                                    maxWidth: "25rem",
                                    ".MuiLinearProgress-root": {
                                        height: 8,
                                        borderRadius: "10px",
                                    },
                                }}
                                label={progressText}
                                value={progress}
                            />
                        ) : (
                            <></>
                        )}
                        {!showProgress && showText && text && rfpVersion === "2.0" ? (
                            <Typography variant="text_14_regular" color="#916A00">
                                {text} {maxBiddersText && <span>{maxBiddersText}</span>}
                            </Typography>
                        ) : (
                            <></>
                        )}
                        <Container sx={{ paddingTop: ".5rem", width: "auto" }}>
                            <Stack
                                direction="row"
                                width="100%"
                                gap="3"
                                justifyContent="space-between"
                            >
                                {rfpVersion === "1.0" ? (
                                    <Chip
                                        variant="outlined"
                                        label="RFP 1.0"
                                        sx={{
                                            borderRadius: "5px",
                                            color: "#B86800",
                                            borderColor: "#B86800",
                                            marginRight: 5,
                                        }}
                                    />
                                ) : null}
                                <BaseChip
                                    bgcolor={chipBgColor}
                                    label={chipLabel}
                                    textColor={chipLabelColor}
                                />
                            </Stack>
                        </Container>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
};

export default ProjectDetailsCard;
