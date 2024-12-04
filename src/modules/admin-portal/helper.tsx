export const getStatus = (status: string) => {
    switch (status) {
        case "INVITE_SENT":
            return "Invite Sent";
        case "ACTIVE":
            return "Active";
        case "INACTIVE":
            return "Inactive";
        case "NEW":
            return "New";
        default:
            return status.charAt(0).toUpperCase() + status.slice(1);
    }
};
