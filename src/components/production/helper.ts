import { isNil } from "lodash";
import moment from "moment";

export const getRoundedOffAndFormattedAmount = (value: number, roundingDecimals = 2) => {
    const finalDisplayAmount = getRoundedOff(value, roundingDecimals);
    const displayPrice = `${finalDisplayAmount.toLocaleString(undefined, {
        useGrouping: true,
        minimumFractionDigits: roundingDecimals,
    })}`;

    return displayPrice;
};

export const getRoundedOff = (value: number, roundingDecimals = 2) => {
    if (isNil(value)) {
        return value;
    }
    let finalDisplayAmount = value || 0.0;
    if (roundingDecimals >= 1) {
        finalDisplayAmount = parseFloat(value.toFixed(roundingDecimals));
    }
    return finalDisplayAmount;
};

export const isValidNumber = (value: any) => {
    // Regular expression to match numbers or decimals
    const pattern = /^\d+(\.\d+)?$/;
    return pattern.test(value);
};

export const getAppropriateDateFormat = (dateString: string) => {
    if (dateString) {
        if (moment(dateString).isValid()) {
            return moment(dateString).format("MM/DD/YYYY");
        }
        return dateString;
    }
    return "-";
};
export const getAppropriateDateFormat2 = (dateString: string) => {
    if (dateString) {
        if (moment(dateString).isValid()) {
            return moment(dateString).format("YYYY-MM-DD");
        }
    }
    return null;
};
