export const getTypeOfChangeText = (typeOfChange: string) => {
    switch (typeOfChange) {
        case "created":
            return "New Item";
        case "updated":
            return "Modified Item";
        case "deleted":
            return "Eliminated Item";
        default:
            return null;
    }
};

export const getBgColor = (status: string) => {
    const updatedStatus = getText(status);
    switch (updatedStatus) {
        case "Invited":
            return "#F0F8F8";
        case "Invited to Revise":
            return "#DAF3FF";
        case "In Progress":
        case "Not Invited":
            return "#FEF2E3";
        case "Submitted":
            return "#57B6B2";
        case "Resubmitted":
            return "#004D71";
        case "Awarded":
            return "#410099";
        case "Declined":
            return "#FCEDED";
        default:
            return "#004D71";
    }
};

export const getBgColor2 = (status: string) => {
    const updatedStatus = getText2(status);
    switch (updatedStatus) {
        case "Invited":
            return "#F0F8F8";
        case "Invited to Revise":
            return "#DAF3FF";
        case "In Progress":
        case "Not Invited":
            return "#FEF2E3";
        case "Submitted":
            return "#57B6B2";
        case "Resubmitted":
            return "#004D71";
        case "Awarded":
            return "#410099";
        case "Lost Bid":
            return "#EEEEEE";
        case "Declined":
            return "#FCEDED";
        case "No Response":
            return "grey";
        default:
            return "#004D71";
    }
};

export const getTextColor = (status: string) => {
    const updatedStatus = getText(status);
    switch (updatedStatus) {
        case "Invited":
            return "#57B6B2";
        case "Accepted":
        case "Invited to Revise":
            return "#004D71";
        case "In Progress":
        case "Not Invited":
            return "#FB8904";
        case "Submitted":
        case "Resubmitted":
        case "Awarded":
            return "#FFFFFF";
        case "Declined":
            return "#D90000";
        default:
            return "#FFFFFF";
    }
};

export const getTextColor2 = (status: string) => {
    const updatedStatus = getText2(status);
    switch (updatedStatus) {
        case "Invited":
            return "#57B6B2";
        case "Accepted":
            return "#FFFFFF";
        case "Invited to Revise":
            return "#004D71";
        case "In Progress":
        case "Not Invited":
            return "#FB8904";
        case "Submitted":
        case "Resubmitted":
        case "Awarded":
            return "#FFFFFF";
        case "Lost Bid":
            return "#757575";
        case "Declined":
            return "#D90000";
        default:
            return "#FFFFFF";
    }
};

export const getText = (status: string) => {
    switch (status) {
        case "requested_revised_pricing":
            return "Invited to Revise";
        case "pending_invite":
            return "Not Invited";
        case "pending_submission":
        case "sent":
            return "Invited";
        default:
            return status.charAt(0).toUpperCase() + status.slice(1);
    }
};

// This function will be used for RFP 2.0
export const getText2 = (status: string) => {
    switch (status) {
        case "requested_revised_pricing":
            return "Invited to Revise";
        case "pending_invite":
            return "Not Invited";
        case "pending_submission":
            return "Accepted";
        case "sent":
            return "Invited";
        case "lost_bid":
            return "Lost Bid";
        case "no_response":
            return "No Response";
        default:
            return status.charAt(0).toUpperCase() + status.slice(1);
    }
};

export const stringAvatar = (name: string, color: string) => {
    let avatarName = "";
    if (name.split(" ").length > 1) {
        avatarName = `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`;
    } else {
        avatarName = `${name.substring(0, 2)}`;
    }
    return {
        sx: {
            bgcolor: color,
            fontSize: "16px",
        },
        children: `${avatarName}`,
    };
};

export const users = [
    {
        name: "Pankaj Sahini",
        email: "pankaj@campconstructions.com",
        phoneNumber: "+91 xxxxxxxx",
        role: "Estimator",
    },
    {
        name: "Rohan Nanavati",
        email: "rohan@campconstructions.com",
        phoneNumber: "+91 xxxxxxxx",
        role: "Estimator",
    },
    {
        name: "Cam Bruckman",
        email: "cam@campconstructions.com",
        phoneNumber: "+91 xxxxxxxx",
        role: "Contractor Admin",
    },
];

export function getCustomErrorText(error: string) {
    let errorText = error;
    if (errorText.includes("Floor Unit Count can not be 0 or blank")) {
        errorText =
            "Floorplan count cannot be 0 or empty. Please download the error list to make corrections.";
    }
    return errorText;
}

export function downloadAsTextFile(data: string, fileName: string) {
    // Convert the text to BLOB.
    const textToBLOB = new Blob([data], { type: "text/plain" });

    let newLink = document.createElement("a");
    newLink.download = fileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    } else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }

    newLink.click();
}

export const checkIfItemIsModified = (categories: { items: any[] }[]) => {
    return categories?.some((category: { items: any[] }) => {
        return category?.items?.some((item: any) => {
            return (
                item?.type_of_change !== null &&
                ((item?.type_of_change === "created" &&
                    !(item?.default_price > 0) &&
                    !(item?.unique_price > 0) &&
                    !(item?.total_price > 0)) ||
                    (item?.type_of_change === "updated" &&
                        ((!(item?.default_price > 0) &&
                            !(item?.unique_price > 0) &&
                            !(item?.total_price > 0)) ||
                            !item?.is_revised_price)))
            );
        });
    });
};

export const checkIfItemIsModifiedForCategory = (
    catIndex: number,
    categories: { items: any[] }[],
) => {
    if (catIndex !== -1) {
        let category = categories?.[catIndex];

        return category?.items?.some((item: any) => {
            return (
                item?.type_of_change !== null &&
                (((item?.type_of_change === "created" || item?.type_of_change === "updated") &&
                    !(item?.default_price > 0) &&
                    !(item?.unique_price > 0) &&
                    !(item?.total_price > 0)) ||
                    (item?.type_of_change === "deleted" &&
                        (item?.default_price > 0 ||
                            item?.unique_price > 0 ||
                            item?.total_price > 0)))
            );
        });
    }
    return false;
};

export const getCategoryInScope = (containerCategories: any, data: any, key: string) => {
    let categories: string[] = [];
    containerCategories?.map((category: any) => {
        //Check if this container category present in all floorplans
        const found = data?.some((reno_cat: any) => {
            let categoryKey = category?.category;
            if (category?.category?.l1) categoryKey = category?.category?.l1;
            return reno_cat?.[key] === categoryKey;
        });
        if (found) {
            let categoryKey = category?.category;
            if (category?.category?.l1) categoryKey = category?.category?.l1;
            categories.indexOf(categoryKey) == -1 && categories?.push(categoryKey);
        }
    });
    return categories;
};

export const getSortedCategoryByContainer = (
    containerCategories: any[],
    data: any[],
    key: string,
) => {
    data.sort((a, b) => {
        const categoryIndexA = containerCategories.indexOf(a?.[key]);
        const categoryIndexB = containerCategories.indexOf(b?.[key]);

        return categoryIndexA - categoryIndexB;
    });
};

export const getSortedCustomCategoryByContainer = (containerCategories: any[], data: any[]) => {
    data.sort((a, b) => {
        const catIndexA = containerCategories.findIndex((cat) => cat == a.category);
        const catIndexB = containerCategories.findIndex((cat) => cat == b.category);
        return catIndexA - catIndexB;
    });
};

export const rfpProductionTabsUrl = (role: string, userId: string, projectId: any) => {
    return `/rfp/${role}/${userId}/production/projects/${projectId}`;
};

export const rfpProductionProjectsUrl = (role: string, userId: string) => {
    return `/rfp/${role}/${userId}/production/projects`;
};
