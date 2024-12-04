import { CheckCircle, HighlightOff } from "@mui/icons-material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { rfpProductionTabsUrl } from "../helper";

export interface IUOM {
    label: string;
    value: string;
}

export const UOMs: { [index: string]: IUOM } = {
    sqft: { label: "Square Feet", value: "sqft" },
    sqyd: { label: "Square Yard", value: "sqyd" },
    sqin: { label: "Square Inch", value: "sqin" },
    lnft: { label: "Linear Feet", value: "lnft" },
    lnin: { label: "Linear Inch", value: "lnin" },
    lnyd: { label: "Linear Yard", value: "lnyd" },
    cuin: { label: "Cubic Inch", value: "cuin" },
    cuft: { label: "Cubic Feet", value: "cuft" },
    cuyd: { label: "Cubic Yard", value: "cuyd" },
    count: { label: "Count", value: "count" },
    percentage: { label: "Percentage Points", value: "percentage" },
};

export const getUOMByLable = (input: string): IUOM =>
    Object.values(UOMs).find(({ label }) => label === input) ?? {
        label: "",
        value: "",
    };

export const IDLE_MODE_CONSTANTS = {
    IDLE_MODE: "Idle mode.",
    AWAY_FOR_SOMETIMTE: "Seems like you have been away for sometime. Please",
    REFRESH: "refresh this page",
    CONTINUE_EDITING: "to continue editing.",
};

export const BIDDING_PORTAL = {
    ALL_FLOOR_PLANS: "All Floor Plans",
};

export const STATUS_INDICATOR_CONSTANTS = {
    READ_ONLY: "Read-only mode. ",
    EDITING_BY: (currentEditingUser: any) =>
        ` This project is currently being edited by ${currentEditingUser?.name}. `,
    REFRESH: "Refresh this page",
    AFTER_CLOSED_PROJECT: "after they have closed the project.",
    OFFLINE: "You're offline.",
    ALSO_TRY_TO: " You may also try to",
    CHECKING_FOR_INTERNET: "We’re checking if the internet has been restored.",
    RELOAD: "reload this page",
    WHEN_ONLINE: "when online to continue editing.",
    CANT_SYNC: "Can't sync.",
    CONTACT_TAILORBIRD: "Contact Tailorbird.",
};

export const getChipLabel = (
    bid_status: string,
    available_bidding_slots: number | undefined,
    is_restricted_max_bidders: boolean | undefined,
    bid_due_date: string,
) => {
    if (bid_status === BIDS_STATUSES.SENT) {
        return (
            <Stack direction="row" alignItems="center">
                {available_bidding_slots == 0 && is_restricted_max_bidders ? (
                    ""
                ) : (
                    <ElectricBoltIcon />
                )}
                &nbsp;&nbsp;
                <Typography variant="text_14_medium">
                    {available_bidding_slots == 0 && is_restricted_max_bidders
                        ? `No Response`
                        : `Bid Due ${
                              bid_due_date ? moment(bid_due_date).format("MM/DD/YYYY") : ""
                          }`}
                </Typography>
            </Stack>
        );
    } else if (
        bid_status === BIDS_STATUSES.ACCEPTED ||
        bid_status === BIDS_STATUSES.PENDING_SUBMISSION ||
        bid_status === BIDS_STATUSES.REQUESTED_REVISED_PRICING
    )
        return (
            <Typography variant="text_14_medium">{`Bid Due ${
                bid_due_date ? moment(bid_due_date).format("MM/DD/YYYY") : ""
            }`}</Typography>
        );
    else {
        return (
            <Typography variant="text_14_medium">
                {bidStatuses[bid_status as keyof typeof bidStatuses]}
            </Typography>
        );
    }
};

export const getChipBackgroundColor = (
    bid_status: string,
    available_bidding_slots: number | undefined,
    is_restricted_max_bidders: boolean | undefined,
    bid_due_date: string,
) => {
    if (
        bid_status === BIDS_STATUSES.SENT &&
        available_bidding_slots == 0 &&
        is_restricted_max_bidders
    ) {
        return backgroundColors["no_response" as keyof typeof backgroundColors];
    } else if (
        [
            BIDS_STATUSES.SUBMITTED,
            BIDS_STATUSES.AWARDED,
            BIDS_STATUSES.DECLINED,
            BIDS_STATUSES.WON,
            BIDS_STATUSES.CLOSED,
            BIDS_STATUSES.LOST_BID,
        ].indexOf(bid_status) > -1
    ) {
        return backgroundColors[bid_status as keyof typeof backgroundColors];
    } else if (
        bid_status === BIDS_STATUSES.REQUESTED_REVISED_PRICING ||
        bid_status === BIDS_STATUSES.PENDING_SUBMISSION ||
        bid_status === BIDS_STATUSES.ACCEPTED ||
        BIDS_STATUSES.SENT
    ) {
        let diffInTime = new Date(bid_due_date).getTime() - new Date().getTime();
        const diffInDate = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
        if (Math.abs(diffInDate) > 3 || !bid_due_date)
            return backgroundColors[bid_status as keyof typeof backgroundColors];
        else return backgroundColors["deadline_close"];
    }
};

export const getChipLabelColor = (bid_status: string, bid_due_date: string) => {
    if (
        [
            BIDS_STATUSES.SUBMITTED,
            BIDS_STATUSES.AWARDED,
            BIDS_STATUSES.DECLINED,
            BIDS_STATUSES.WON,
            BIDS_STATUSES.CLOSED,
            BIDS_STATUSES.LOST_BID,
        ].indexOf(bid_status) > -1
    ) {
        return chipColors[bid_status as keyof typeof chipColors];
    } else if (
        bid_status === BIDS_STATUSES.REQUESTED_REVISED_PRICING ||
        bid_status === BIDS_STATUSES.PENDING_SUBMISSION ||
        bid_status === BIDS_STATUSES.ACCEPTED ||
        BIDS_STATUSES.SENT
    ) {
        let diffInTime = new Date(bid_due_date).getTime() - new Date().getTime();
        const diffInDate = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
        if (Math.abs(diffInDate) > 3 || !bid_due_date)
            return chipColors[bid_status as keyof typeof chipColors];
        else return chipColors["deadline_close"];
    }
};

export const borderColors = {
    sent: "#FFAB00",
    pending_submission: "#004D71",
    accepted: "#004D71",
    submitted: "#36D6CF",
    won: "#410099",
    awarded: "#410099",
    closed: "#C9CCCF",
    requested_revised_pricing: "#004D71",
    declined: "#C9CCCF",
    lost_bid: "#C9CCCF",
};

export const bidStatuses = {
    submitted: "Submitted",
    won: "Won",
    closed: "Closed",
    awarded: "Awarded",
    declined: "Declined",
    lost_bid: "Lost Bid",
};
export const backgroundColors = {
    sent: "#FFAB00",
    pending_submission: "#BCDFEF",
    accepted: "#BCDFEF",
    submitted: "#A4E8F2",
    won: "#DDCBFB",
    closed: "#909090",
    deadline_close: "#FED3D1",
    requested_revised_pricing: "#BCDFEF",
    awarded: "#DDCBFB",
    declined: "#909090",
    lost_bid: "#909090",
    no_response: "#909090",
};

export const chipColors = {
    sent: "#232323",
    pending_submission: "#004D71",
    accepted: "#004D71",
    submitted: "#1F7A76",
    won: "#410099",
    closed: "#232323",
    deadline_close: "#D72C0D",
    requested_revised_pricing: "#004D71",
    awarded: "#410099",
    deadline: "#232323",
    lost_bid: "#232323",
    no_response: "#232323",
};

export const getFormattedNumber = (value: number, shouldReturnPrecise: boolean = false): string => {
    const val = Number(parseFloat(value?.toString())?.toFixed(2)).toLocaleString("en-US");
    return shouldReturnPrecise
        ? parseFloat(value.toFixed(6).toString()).toLocaleString("en-US")
        : val;
};

export const BIDS_STATUSES = {
    PENDING_SUBMISSION: "pending_submission",
    REQUESTED_REVISED_PRICING: "requested_revised_pricing",
    SENT: "sent",
    SUBMITTED: "submitted",
    AWARDED: "awarded",
    DECLINED: "declined",
    PENDING_INVITE: "pending_invite",
    ACCEPTED: "accepted",
    WON: "won",
    LOST_BID: "lost_bid",
    CLOSED: "closed",
    NO_RESPONSE: "no_response",
};

export const getSnackbarMessage = (message?: string | React.ReactNode, variant?: string) => {
    let element = null;
    if (variant === "success") {
        element = (
            <CheckCircle
                htmlColor="#00B779"
                sx={{
                    top: "2px",
                }}
            />
        );
    } else if (variant === "error") {
        element = (
            <HighlightOff
                htmlColor="#FA3333"
                sx={{
                    top: "2px",
                }}
            />
        );
    }
    return (
        <Stack direction="row" gap={1} px="1rem" alignItems="center">
            {element}
            <Typography mt=".25rem" color="black">
                {message}
            </Typography>
        </Stack>
    );
};

export const ROUTES = {
    PROJECTS_DASHBOARD: (role: string, userID: string) => `/rfp/${role}/${userID}/projects/v2`,
    SUMMARY_TABLE: (role: string, userID: string, projectId: string) =>
        `/rfp/${role}/${userID}/projects/${projectId}/v2`,
    ENTRY_TABLE: (role: string, userID: string, projectId: string, category: string) =>
        `/rfp/${role}/${userID}/projects/${projectId}/price/${encodeURIComponent(category)}`,
    ENTRY_TABLE_AGREEMENTS: (
        role: string,
        userID: string,
        agreementId: string,
        projectId: string,
        organization_id: string,
        contractorName: string,
        category: string,
    ) =>
        `${rfpProductionTabsUrl(
            role,
            userID,
            projectId,
        )}/agreements/${agreementId}/${organization_id}/${contractorName}/view/${category}`,
    SUMMARY_TABLE_ADMIN: (
        role: string,
        userID: string,
        projectId: string,
        organization_id: string,
        version: string,
        queryParams: string = "",
    ) => {
        return `/rfp/${role}/${userID}/projects/${projectId}/v2?org_id=${organization_id}&version=${version}${queryParams}`;
    },
};

export const PROJECT_TYPE_BG_COLOR = {
    Interior: "#0088C7",
    "Common Area": "#B98900",
    Exterior: "#007A51",
    INTERIOR: "#0088C7",
    COMMON_AREA: "#B98900",
    EXTERIOR: "#007A51",
};
