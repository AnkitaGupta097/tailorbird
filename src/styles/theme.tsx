import { createTheme } from "@mui/material/styles";
import React from "react";
import { typoStandard } from "./helper";
import IBMPlexSansRegular from "../assets/fonts/IBMPlexSans-Regular.ttf";

declare module "@mui/material/styles" {
    // eslint-disable-next-line no-unused-vars
    interface Theme {
        error: {
            scraper: string;
            scraperStage: string;
            not_found: string;
        };
        scopeHeader: {
            label: string;
            radioTextActive: string;
            radioTextDefault: string;
        };
        property_type: {
            garden_style: string;
            highrise: string;
        };
        background: {
            header: string;
            boxShadow: string;
            scrappedDetails: string;
            cardHeader: string;
            scrappedSKUs: string;
            selectedSKU: string;
            selectedField: string;
            white: string;
            black: string;
            menuButton: string;
            iconButton: string;
            error: string;
            warning: string;
            info: string;
            success: string;
            alert: string;
            successDefault: string;
        };
        text: {
            disabled: string;
            light: string;
            white: string;
            dark: string;
            medium: string;
            error: string;
            link: string;
            warning: string;
            info: string;
            success: string;
            alert: string;
            successDark: string;
        };
        icon: {
            alert: string;
            successDark: string;
            successDefault: string;
            subdued: string;
        };
        border: {
            inner: string;
            outer: string;
            focus: string;
            medium: string;
            divider: string;
            accordionBottom: string;
            textarea: string;
        };
        table: {
            headerBackground: string;
            laborRows: string;
            white: string;
            border: string;
        };
        buttons: {
            primary: string;
            secondary: string;
            error: string;
        };
        common: {
            white: string;
        };
        tab: {
            divider: string;
        };
        button: {
            danger: {
                backgroundColor: string;
                textColor: string;
            };
            active: {
                backgroundColor: string;
                textColor: string;
            };
            disabled: {
                backgroundColor: string;
                textColor: string;
            };
            warning: {
                backgroundColor: string;
                textColor: string;
            };
            export: {
                backgroundColor: string;
                textColor: string;
            };
            activeLight: {
                backgroundColor: string;
                textColor: string;
            };
        };
        jobStatus: {
            pending: {
                backgroundColor: string;
                textColor: string;
            };
            initiated: {
                backgroundColor: string;
                textColor: string;
            };
            error: {
                backgroundColor: string;
                textColor: string;
            };
            success: {
                backgroundColor: string;
                textColor: string;
            };
        };
    }
    // allow configuration using `createTheme`
    // eslint-disable-next-line no-unused-vars
    interface ThemeOptions {
        error: {
            scraper: string;
            scraperStage: string;
            not_found: string;
        };
        background: {
            header: string;
            boxShadow: string;
            scrappedDetails: string;
            cardHeader: string;
            scrappedSKUs: string;
            selectedSKU: string;
            selectedField: string;
            white: string;
            black: string;
            menuButton: string;
            iconButton: string;
            error: string;
            warning: string;
            info: string;
            success: string;
            alert: string;
            successDefault: string;
        };
        scopeHeader: {
            label: string;
            radioTextActive: string;
            radioTextDefault: string;
        };
        property_type: {
            garden_style: string;
            highrise: string;
        };
        text: {
            disabled: string;
            light: string;
            white: string;
            dark: string;
            error: string;
            warning: string;
            info: string;
            link: string;
            success: string;
            medium: string;
            alert: string;
            successDark: string;
        };
        icon: {
            alert: string;
            successDark: string;
            successDefault: string;
            subdued: string;
        };
        border: {
            inner: string;
            outer: string;
            focus: string;
            medium: string;
            divider: string;
            accordionBottom: string;
            textarea: string;
        };
        table: {
            headerBackground: string;
            laborRows: string;
            white: string;
            border: string;
        };
        buttons: {
            primary: string;
            secondary: string;
            error: string;
        };
        common: {
            white: string;
        };
        tab: {
            divider: string;
        };
        button: {
            danger: {
                backgroundColor: string;
                textColor: string;
            };
            active: {
                backgroundColor: string;
                textColor: string;
            };
            disabled: {
                backgroundColor: string;
                textColor: string;
            };
            warning: {
                backgroundColor: string;
                textColor: string;
            };
            export: {
                backgroundColor: string;
                textColor: string;
            };
            activeLight: {
                backgroundColor: string;
                textColor: string;
            };
        };
        jobStatus: {
            pending: {
                backgroundColor: string;
                textColor: string;
            };
            initiated: {
                backgroundColor: string;
                textColor: string;
            };
            error: {
                backgroundColor: string;
                textColor: string;
            };
            success: {
                backgroundColor: string;
                textColor: string;
            };
        };
    }

    // eslint-disable-next-line no-unused-vars
    interface TypographyVariants {
        title: React.CSSProperties;
        heading: React.CSSProperties;
        buttonText: React.CSSProperties;
        buttonDefaultText: React.CSSProperties;
        tableData: React.CSSProperties;
        footerText: React.CSSProperties;
        heading2: React.CSSProperties;
        body: React.CSSProperties;
        buttonTypography?: React.CSSProperties;
        loaderText?: React.CSSProperties;
        text1: React.CSSProperties;
        tab: React.CSSProperties;
        activeTab: React.CSSProperties;
        dialogHeader: React.CSSProperties;
        dialogContent: React.CSSProperties;
        tableHeaderText: React.CSSProperties;
        labelText: React.CSSProperties;
        warningText: React.CSSProperties;
        summaryText: React.CSSProperties;
        scopeFilterText: React.CSSProperties;
        scopeEditorVariant: React.CSSProperties;
        scopeEditorCreate: React.CSSProperties;
        footerTextInter: React.CSSProperties;
        title2: React.CSSProperties;
        scopeDefinitionLabel: React.CSSProperties;
        scopeDefinitionActiveLabel: React.CSSProperties;
        scrapingStage: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    // eslint-disable-next-line no-unused-vars
    interface TypographyVariantsOptions {
        text_96_light: React.CSSProperties;
        text_96_regular: React.CSSProperties;
        text_96_medium: React.CSSProperties;
        text_96_semibold: React.CSSProperties;
        text_96_bold: React.CSSProperties;
        text_60_light: React.CSSProperties;
        text_60_regular: React.CSSProperties;
        text_60_medium: React.CSSProperties;
        text_60_semibold: React.CSSProperties;
        text_60_bold: React.CSSProperties;
        text_48_light: React.CSSProperties;
        text_48_regular: React.CSSProperties;
        text_48_medium: React.CSSProperties;
        text_48_semibold: React.CSSProperties;
        text_48_bold: React.CSSProperties;
        text_34_light: React.CSSProperties;
        text_34_regular: React.CSSProperties;
        text_34_medium: React.CSSProperties;
        text_34_semibold: React.CSSProperties;
        text_34_bold: React.CSSProperties;
        text_26_light: React.CSSProperties;
        text_26_regular: React.CSSProperties;
        text_26_medium: React.CSSProperties;
        text_26_semibold: React.CSSProperties;
        text_26_bold: React.CSSProperties;
        text_24_light: React.CSSProperties;
        text_24_regular: React.CSSProperties;
        text_24_medium: React.CSSProperties;
        text_24_semibold: React.CSSProperties;
        text_24_bold: React.CSSProperties;
        text_21_light: React.CSSProperties;
        text_21_regular: React.CSSProperties;
        text_21_medium: React.CSSProperties;
        text_21_semibold: React.CSSProperties;
        text_21_bold: React.CSSProperties;
        text_20_light: React.CSSProperties;
        text_20_regular: React.CSSProperties;
        text_20_medium: React.CSSProperties;
        text_20_semibold: React.CSSProperties;
        text_20_bold: React.CSSProperties;
        text_18_light: React.CSSProperties;
        text_18_regular: React.CSSProperties;
        text_18_medium: React.CSSProperties;
        text_18_semibold: React.CSSProperties;
        text_18_bold: React.CSSProperties;
        text_16_light: React.CSSProperties;
        text_16_regular: React.CSSProperties;
        text_16_medium: React.CSSProperties;
        text_16_semibold: React.CSSProperties;
        text_16_bold: React.CSSProperties;
        text_14_light: React.CSSProperties;
        text_14_regular: React.CSSProperties;
        text_14_medium: React.CSSProperties;
        text_14_semibold: React.CSSProperties;
        text_14_bold: React.CSSProperties;
        text_12_light: React.CSSProperties;
        text_12_regular: React.CSSProperties;
        text_12_medium: React.CSSProperties;
        text_12_semibold: React.CSSProperties;
        text_12_bold: React.CSSProperties;
        text_10_light: React.CSSProperties;
        text_10_regular: React.CSSProperties;
        text_10_medium: React.CSSProperties;
        text_10_semibold: React.CSSProperties;
        text_10_bold: React.CSSProperties;
        text_8_light: React.CSSProperties;
        text_8_regular: React.CSSProperties;
        text_8_medium: React.CSSProperties;
        text_8_semibold: React.CSSProperties;
        text_8_bold: React.CSSProperties;
        title?: React.CSSProperties;
        heading: React.CSSProperties;
        buttonText: React.CSSProperties;
        buttonDefaultText: React.CSSProperties;
        tableData: React.CSSProperties;
        footerText: React.CSSProperties;
        heading2: React.CSSProperties;
        body: React.CSSProperties;
        buttonTypography?: React.CSSProperties;
        loaderText?: React.CSSProperties;
        text1: React.CSSProperties;
        tab: React.CSSProperties;
        activeTab: React.CSSProperties;
        dialogHeader: React.CSSProperties;
        dialogContent: React.CSSProperties;
        tableHeaderText: React.CSSProperties;
        labelText: React.CSSProperties;
        warningText: React.CSSProperties;
        summaryText: React.CSSProperties;
        scopeFilterText: React.CSSProperties;
        scopeEditorVariant: React.CSSProperties;
        scopeEditorCreate: React.CSSProperties;
        footerTextInter: React.CSSProperties;
        title2: React.CSSProperties;
        scopeDefinitionLabel: React.CSSProperties;
        scopeDefinitionActiveLabel: React.CSSProperties;
        scrapingStage: React.CSSProperties;
        keyText: React.CSSProperties;
        valueText: React.CSSProperties;
    }
}
// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
    // eslint-disable-next-line no-unused-vars
    interface TypographyPropsVariantOverrides {
        text_96_light: true;
        text_96_regular: true;
        text_96_medium: true;
        text_96_semibold: true;
        text_96_bold: true;
        text_60_light: true;
        text_60_regular: true;
        text_60_medium: true;
        text_60_semibold: true;
        text_60_bold: true;
        text_48_light: true;
        text_48_regular: true;
        text_48_medium: true;
        text_48_semibold: true;
        text_48_bold: true;
        text_34_light: true;
        text_34_regular: true;
        text_34_medium: true;
        text_34_semibold: true;
        text_34_bold: true;
        text_26_light: true;
        text_26_regular: true;
        text_26_medium: true;
        text_26_semibold: true;
        text_26_bold: true;
        text_24_light: true;
        text_24_regular: true;
        text_24_medium: true;
        text_24_semibold: true;
        text_24_bold: true;
        text_20_light: true;
        text_20_regular: true;
        text_20_medium: true;
        text_20_semibold: true;
        text_20_bold: true;
        text_18_light: true;
        text_18_regular: true;
        text_18_medium: true;
        text_18_semibold: true;
        text_18_bold: true;
        text_16_light: true;
        text_16_regular: true;
        text_16_medium: true;
        text_16_semibold: true;
        text_16_bold: true;
        text_14_light: true;
        text_14_regular: true;
        text_14_medium: true;
        text_14_semibold: true;
        text_14_bold: true;
        text_12_light: true;
        text_12_regular: true;
        text_12_medium: true;
        text_12_semibold: true;
        text_12_bold: true;
        text_10_light: true;
        text_10_regular: true;
        text_10_medium: true;
        text_10_semibold: true;
        text_10_bold: true;
        text_8_light: true;
        text_8_regular: true;
        text_8_medium: true;
        text_8_semibold: true;
        text_8_bold: true;
        title: true;
        heading: true;
        heading2: true;
        buttonText: true;
        buttonDefaultText: true;
        tableData: true;
        footerText: true;
        buttonTypography: true;
        body: true;
        loaderText: true;
        text1: true;
        tab: true;
        activeTab: true;
        dialogHeader: true;
        dialogContent: true;
        tableHeaderText: true;
        labelText: true;
        warningText: true;
        summaryText: true;
        scopeFilterText: true;
        scopeEditorVariant: true;
        scopeEditorCreate: true;
        footerTextInter: true;
        title2: true;
        scopeDefinitionLabel: true;
        scopeDefinitionActiveLabel: true;
        scrapingStage: true;
        keyText: true;
        valueText: true;
    }
}

/* eslint-disable no-unused-vars */
const AppTheme = createTheme({
    // breakpoints: {
    //     values: {
    //         xs: 0,
    //         sm: 743,
    //         md: 984,
    //         lg: 1248,
    //         xl: 1248,
    //     },
    // },
    error: {
        scraper: "#410099",
        scraperStage: "#DA0000",
        not_found: "#DA0000",
    },
    scopeHeader: {
        label: "#004D71",
        radioTextActive: "#004D71",
        radioTextDefault: "#EEEEEE",
    },
    background: {
        header: "#EEEEEE",
        boxShadow: "rgba(0, 0, 0, 0.1)",
        scrappedDetails: "#FDFDFD",
        cardHeader: "#FAFAFB",
        selectedField: "#A3DDF8",
        scrappedSKUs: "#DAF3FF",
        selectedSKU: "#004D71",
        white: "#FFF",
        black: "#000",
        menuButton: "#024D71",
        iconButton: "#D9D9D9",
        error: "#FCEDED",
        warning: "#FEF2E3",
        info: "#DAF3FF",
        success: "#DDF0F0",
        alert: "#FFD79D",
        successDefault: "#AEE9D1",
    },
    icon: {
        alert: "#B98900",
        successDark: "#0E845C",
        successDefault: "#AEE9D1",
        subdued: "#8C9196",
    },
    text: {
        light: "#001833",
        disabled: "#969696",
        white: "#FFF",
        dark: "#000",
        medium: "#757575",
        link: "#004D71",
        error: "#D90000",
        warning: "#FB8904",
        info: "#004D71",
        success: "#479491",
        alert: "#B86800",
        successDark: "#0E845C",
    },
    border: {
        inner: "#DEDEDE",
        outer: "#BCBCBB",
        focus: "#DFE0EB",
        medium: "#757575",
        divider: "#DFE0EB",
        accordionBottom: "#004D71",
        textarea: "#C9CCCF",
    },
    property_type: {
        garden_style: "#B98900",
        highrise: "#0088C7",
    },
    buttons: {
        primary: "#004D71",
        secondary: "#DFE0EB",
        error: "#A80000",
    },
    common: { white: "#FFFFFF" },
    table: {
        headerBackground: "#FAFAFB",
        laborRows: "#DAF3FF",
        white: "#FFFFFF",
        border: "#DFE0EB",
    },
    tab: {
        divider: "#57b6b2",
    },
    button: {
        danger: {
            backgroundColor: "#c9302c",
            textColor: "#fff",
        },
        active: {
            backgroundColor: "#004d71",
            textColor: "#fff",
        },
        disabled: {
            backgroundColor: "#eee",
            textColor: "#000",
        },
        warning: {
            backgroundColor: "#ec971f",
            textColor: "#fff",
        },
        export: {
            backgroundColor: "#410099",
            textColor: "#fff",
        },
        activeLight: {
            backgroundColor: "#57B6B2",
            textColor: "#fff",
        },
    },
    jobStatus: {
        pending: {
            backgroundColor: "rgba(251, 137, 4, 0.11)",
            textColor: "#FB8904",
        },
        initiated: {
            backgroundColor: "rgba(65, 0, 153, 0.11)",
            textColor: "#410099",
        },
        error: {
            backgroundColor: "rgba(218, 0, 0, 0.05)",
            textColor: "#D90000",
        },
        success: {
            backgroundColor: "rgba(87, 182, 178, 0.1)",
            textColor: "#57B6B2",
        },
    },
    typography: {
        fontFamily: "IBM Plex Sans",
        fontSize: 14,
        fontWeightMedium: 300,
        text_96_light: {
            ...typoStandard(96, 300),
        },
        text_96_regular: {
            ...typoStandard(96, 400),
        },
        text_96_medium: {
            ...typoStandard(96, 500),
        },
        text_96_semibold: {
            ...typoStandard(96, 600),
        },
        text_96_bold: {
            ...typoStandard(96, 700),
        },
        text_60_light: {
            ...typoStandard(60, 300),
        },
        text_60_regular: {
            ...typoStandard(60, 400),
        },
        text_60_medium: {
            ...typoStandard(60, 500),
        },
        text_60_semibold: {
            ...typoStandard(60, 600),
        },
        text_60_bold: {
            ...typoStandard(60, 700),
        },
        text_48_light: {
            ...typoStandard(48, 300),
        },
        text_48_regular: {
            ...typoStandard(48, 400),
        },
        text_48_medium: {
            ...typoStandard(48, 500),
        },
        text_48_semibold: {
            ...typoStandard(48, 600),
        },
        text_48_bold: {
            ...typoStandard(48, 700),
        },
        text_34_light: {
            ...typoStandard(34, 300),
        },
        text_34_regular: {
            ...typoStandard(34, 400),
        },
        text_34_medium: {
            ...typoStandard(34, 500),
        },
        text_34_semibold: {
            ...typoStandard(34, 600),
        },
        text_34_bold: {
            ...typoStandard(34, 700),
        },
        text_26_light: {
            ...typoStandard(26, 300),
        },
        text_26_regular: {
            ...typoStandard(26, 400),
        },
        text_26_medium: {
            ...typoStandard(26, 500),
        },
        text_26_semibold: {
            ...typoStandard(26, 600),
        },
        text_26_bold: {
            ...typoStandard(26, 700),
        },
        text_24_light: {
            ...typoStandard(24, 300),
        },
        text_24_regular: {
            ...typoStandard(24, 400),
        },
        text_24_medium: {
            ...typoStandard(24, 500),
        },
        text_24_semibold: {
            ...typoStandard(24, 600),
        },
        text_24_bold: {
            ...typoStandard(24, 700),
        },
        text_21_light: {
            ...typoStandard(21, 300),
        },
        text_21_regular: {
            ...typoStandard(21, 400),
        },
        text_21_medium: {
            ...typoStandard(21, 500),
        },
        text_21_semibold: {
            ...typoStandard(21, 600),
        },
        text_21_bold: {
            ...typoStandard(21, 700),
        },
        text_20_light: {
            ...typoStandard(20, 300),
        },
        text_20_regular: {
            ...typoStandard(20, 400),
        },
        text_20_medium: {
            ...typoStandard(20, 500),
        },
        text_20_semibold: {
            ...typoStandard(20, 600),
        },
        text_20_bold: {
            ...typoStandard(20, 700),
        },
        text_18_light: {
            ...typoStandard(18, 300),
        },
        text_18_regular: {
            ...typoStandard(18, 400),
        },
        text_18_medium: {
            ...typoStandard(18, 500),
        },
        text_18_semibold: {
            ...typoStandard(18, 600),
        },
        text_18_bold: {
            ...typoStandard(18, 700),
        },
        text_16_light: {
            ...typoStandard(16, 300),
        },
        text_16_regular: {
            ...typoStandard(16, 400),
        },
        text_16_medium: {
            ...typoStandard(16, 500),
        },
        text_16_semibold: {
            ...typoStandard(16, 600),
        },
        text_16_bold: {
            ...typoStandard(16, 700),
        },
        text_14_light: {
            ...typoStandard(14, 300),
        },
        text_14_regular: {
            ...typoStandard(14, 400),
        },
        text_14_medium: {
            ...typoStandard(14, 500),
        },
        text_14_semibold: {
            ...typoStandard(14, 600),
        },
        text_14_bold: {
            ...typoStandard(14, 700),
        },
        text_12_light: {
            ...typoStandard(12, 300),
        },
        text_12_regular: {
            ...typoStandard(12, 400),
        },
        text_12_medium: {
            ...typoStandard(12, 500),
        },
        text_12_semibold: {
            ...typoStandard(12, 600),
        },
        text_12_bold: {
            ...typoStandard(12, 700),
        },
        text_10_light: {
            ...typoStandard(10, 300),
        },
        text_10_regular: {
            ...typoStandard(10, 400),
        },
        text_10_medium: {
            ...typoStandard(10, 500),
        },
        text_10_semibold: {
            ...typoStandard(10, 600),
        },
        text_10_bold: {
            ...typoStandard(10, 700),
        },
        text_8_light: {
            ...typoStandard(8, 300),
        },
        text_8_regular: {
            ...typoStandard(8, 400),
        },
        text_8_medium: {
            ...typoStandard(8, 500),
        },
        text_8_semibold: {
            ...typoStandard(8, 600),
        },
        text_8_bold: {
            ...typoStandard(8, 700),
        },
        buttonTypography: {
            fontWeight: "400",
            fontSize: "14px",
            lineHeight: "18.2px",
            textTransform: "none",
        },
        subtitle2: {
            fontWeight: "600",
            fontSize: "24px",
            lineHeight: "36px",
            letterSpacing: "0.2px",
        },
        title: {
            fontFamily: "IBM Plex Sans : Medium : 26",
            fontWeight: 500,
            fontSize: "1.6rem",
            lineHeight: "2.1rem",
        },
        title2: {
            fontFamily: "IBM Plex Sans : Medium : 26",
            fontWeight: 500,
            fontSize: "0.625rem",
            lineHeight: "2.1rem",
        },
        heading2: {
            fontFamily: "IBM Plex Sans Semi Bold",
            fontWeight: "600",
            fontSize: "1.625rem",
            lineHeight: "2.1rem",
            letterSpacing: "0.2px",
        },
        heading: {
            fontFamily: "IBM Plex Sans : Semibold : 18",
            fontWeight: 600,
            fontSize: "1.1rem",
            lineHeight: "1.4rem",
        },
        loaderText: {
            fontFamily: "IBM Plex Sans : Regular : 18",
            fontWeight: 400,
            fontSize: "1.1rem",
            lineHeight: "1.4rem",
        },
        buttonText: {
            fontFamily: "Inter : Medium : 14",
            fontWeight: 600,
            fontSize: "1rem",
            lineHeight: "1.3rem",
        },
        buttonDefaultText: {
            fontFamily: "Inter : Regular : 14",
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: "1.3rem",
        },
        tableData: {
            fontFamily: "IBM Plex Sans : Regular : 14",
            fontWeight: 400,
            fontSize: "0.87rem",
            lineHeight: "1.1rem",
        },
        button: {
            fontFamily: "IBM Plex Sans : Regular : 14",
            fontWeight: 400,
            fontSize: "0.87rem",
            lineHeight: "1.14rem",
            textTransform: "capitalize",
        },
        footerText: {
            fontFamily: "IBM Plex Sans : Bold : 12",
            fontWeight: 500,
            fontSize: "0.87rem",
            lineHeight: "1.0rem",
            letterSpacing: "0.01rem",
        },
        subtitle1: {
            fontFamily: "IBM Plex Sans Semi Bold",
            fontWeight: "600",
            fontSize: "0.875rem",
            lineHeight: "1.14rem",
        },
        footerTextInter: {
            fontFamily: "Inter : Bold : 12",
            fontWeight: 500,
            fontSize: "0.87rem",
            lineHeight: "1.0rem",
            letterSpacing: "0.01rem",
        },
        body: {
            fontWeight: 400,
            fontSize: "0.9rem",
            lineHeight: "1.52rem",
            fontFamily: "Inter : Semibold : 16",
        },
        body2: {
            fontFamily: "IBM Plex Sans : Regular 10",
            fontSize: "0.625rem",
            fontWeight: "400",
            lineHeight: "0.8125rem",
        },
        text1: {
            fontFamily: "IBM Plex Sans : Regular : 18",
            fontWeight: 400,
            fontSize: "18px",
            lineHeight: "23px",
        },
        tab: {
            fontFamily: "IBM Plex Sans : Regular : 16",
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: "1.1rem",
            textTransform: "capitalize",
        },
        activeTab: {
            fontFamily: "IBM Plex Sans : Bold : 16",
            fontWeight: 700,
            fontSize: "1rem",
            lineHeight: "1.1rem",
            textTransform: "capitalize",
            color: "#000",
        },
        dialogHeader: {
            fontFamily: "IBM Plex Sans : Semibold : 18",
            fontWeight: 600,
            fontSize: "1.1rem",
            lineHeight: "1.2rem",
        },
        dialogContent: {
            fontFamily: "IBM Plex Sans : Regular : 14",
            fontWeight: 400,
            fontSize: "0.87rem",
            lineHeight: "1.1rem",
        },
        tableHeaderText: {
            fontFamily: "IBM Plex Sans : Semibold : 16",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "1rem",
            lineHeight: "1.3rem",
        },
        labelText: {
            fontFamily: "IBM Plex Sans : Regular : 14",
            fontWeight: 400,
            fontSize: "0.87rem",
            lineHeight: "1.1rem",
        },
        keyText: {
            fontFamily: "Roboto",
            fontSize: "14px",
            fontWeight: 400,
            color: "#757575",
        },
        valueText: {
            fontFamily: "Roboto",
            fontSize: "14px",
            fontWeight: 600,
            color: "#232323",
        },
        warningText: {
            fontFamily: "IBM Plex Sans : Regular : 16",
            fontWeight: 400,
            fontSize: "1.1rem",
            lineHeight: "1.43rem",
        },
        summaryText: {
            fontFamily: "IBM Plex Sans : Regular : 14",
            fontWeight: 400,
            fontSize: "0.625rem",
            lineHeight: "0.813rem",
        },
        scopeFilterText: {
            fontFamily: "IBM Plex Sans : Bold : 12",
            fontWeight: 700,
            fontSize: "0.75rem",
            lineHeight: "1rem",
        },
        scopeEditorVariant: {
            fontFamily: "IBM Plex Sans : Bold : 12",
            fontWeight: 700,
            fontSize: "0.75rem",
            lineHeight: "1rem",
        },
        scopeEditorCreate: {
            borderBottom: "1px solid #410099",
            color: "#410099",
        },
        scopeDefinitionLabel: {
            fontFamily: "IBM Plex Sans : Regular : 14",
            fontWeight: 400,
            fontSize: "0.875rem",
            lineHeight: "1.125rem",
        },
        scopeDefinitionActiveLabel: {
            fontFamily: "IBM Plex Sans : Bold : 12",
            fontWeight: 700,
            fontSize: "0.875rem",
            lineHeight: "1.125rem",
        },
        scrapingStage: {
            fontFamily: "IBM Plex Sans : Regular : 14",
            fontWeight: 400,
            fontSize: "0.75rem",
            lineHeight: "1rem",
        },
    },
    palette: {
        text: {
            primary: "#000000",
            secondary: "#fff",
        },
        primary: {
            main: "#004d71",
        },
        secondary: {
            main: "#EEEEEE",
            dark: "#DFE0EB",
            light: "#FFFFFF",
        },
        success: {
            main: "#2e7d32",
            light: "#57B6B2",
        },
        info: {
            main: "#57b6b2",
        },
    },
    spacing: 4,
    components: {
        MuiCssBaseline: {
            styleOverrides: `
              @font-face {
                font-family: 'IBM Plex Sans';
                font-style: normal;
                font-display: swap;
                src: local('IBM Plex Sans'), local('IBM Plex Sans-Regular'), url(${IBMPlexSansRegular}) format('ttf');
                unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
              }
            `,
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    margin: 10,
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                iconStandard: {
                    color: "white",
                    marginRight: "0.5rem",
                },
            },
        },
    },
});
export default AppTheme;
