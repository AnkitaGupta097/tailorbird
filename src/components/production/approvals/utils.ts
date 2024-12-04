import { forEach, has, isNil } from "lodash";
import { getAppropriateDateFormat, getRoundedOffAndFormattedAmount } from "../helper";

const convertApprovalToDisplay = (approval: any) => {
    return transformData(approval.current_data, approval.change_data, []);
};

const transformData = (oldData: any, newData: any, output: any) => {
    const hasItems = has(oldData, "items") && has(newData, "items");
    for (const key in newData) {
        // To handle scope completion request
        if (key === "status" && !hasItems) continue;
        if (key === "items") {
            if (hasItems) {
                forEach(oldData.items, function (value, key) {
                    const oldItem = oldData.items[key];
                    const newItem = newData.items[key];

                    if (oldItem && newItem) {
                        output.push({
                            field: `Item`,
                            value: oldItem.item
                                ? `${oldItem.item}${oldItem.scope ? ` - ${oldItem.scope}` : ""}`
                                : key,
                            sx: { backgroundColor: "#E3EEF3" },
                        });
                        transformData(oldItem, newItem, output);
                    }
                });
                continue;
            }
        }

        if (has(newData, key) && has(oldData, key)) {
            const isTotalItemPriceKey = key === "price" && hasItems;
            const sentenceCaseKey = kebabToSentenceCase(key);
            output.push({
                field: isTotalItemPriceKey
                    ? "Previous Total Item Cost"
                    : `Previous ${sentenceCaseKey}`,
                value: getFormattedValue(oldData[key], key),
                sx: isTotalItemPriceKey && { backgroundColor: "#E3EEF3" },
            });
            output.push({
                field: isTotalItemPriceKey
                    ? "Current Total Item Cost"
                    : `Current ${sentenceCaseKey}`,
                value: getFormattedValue(newData[key], key),
            });
        }
    }

    return output;
};

const getFormattedValue = (value: any, key: string) => {
    switch (true) {
        case key.includes("date"):
            return value ? getAppropriateDateFormat(value) : "-";
        case key.includes("price"):
            return isNil(value) ? "-" : `$${getRoundedOffAndFormattedAmount(value)}`;
        default:
            return value;
    }
};

const kebabToSentenceCase = (inputString: string) => {
    // Split the input string into words using hyphens as separators
    const words = inputString.split("_");

    // Capitalize the first letter of each word and make the rest of the letters lowercase
    const sentenceCaseWords = words.map((word: string) => {
        if (word.length > 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else {
            return "";
        }
    });

    // Join the words back together with spaces
    const sentenceCaseString = sentenceCaseWords.join(" ");

    return sentenceCaseString;
};

const getTrackingEventPayload = (
    renoUnitId: string,
    status: string,
    scopeApprovalIds: Array<string>,
    type: string,
    projectName: string,
) => {
    let payload = {};
    if (type === "individual") {
        if (status == "cancelled") {
            payload = {
                event: "CANCEL_REQUEST_FAILED",
                scopeApprovalId: scopeApprovalIds[0],
                renoUnitId,
            };
        } else {
            payload = {
                event: "APPROVAL_RESOLVE_FAILED",
                scopeApprovalId: scopeApprovalIds[0],
                renoUnitId: renoUnitId,
                status,
            };
        }
    } else if (type === "bulk") {
        if (status == "cancelled") {
            payload = {
                event: "CANCEL_BULK_REQUESTS_FAILED",
                scopeApprovalIds: scopeApprovalIds,
                renoUnitId,
            };
        } else {
            payload = {
                event: "BULK_APPROVAL_RESOLVE_FAILED",
                scopeApprovalIds: scopeApprovalIds,
                renoUnitId: renoUnitId,
                status,
            };
        }
    } else {
        payload = {
            event: "SIGNOFF_UNIT_FAILED",
            renoUnitId,
        };
    }
    return { ...payload, projectName };
};

export { convertApprovalToDisplay, kebabToSentenceCase, getTrackingEventPayload };
