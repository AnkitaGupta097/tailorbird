import appTheme from "styles/theme";

const getColor = (pType: string) => {
    switch (pType) {
        case "MID RISE":
            return appTheme.jobStatus.initiated.textColor;
        case "HIGH RISE":
            return appTheme.property_type.highrise;
        case "GARDEN STYLE":
            return appTheme.property_type.garden_style;
    }
};

export { getColor };
