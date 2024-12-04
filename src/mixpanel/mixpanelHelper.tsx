export const getUserDetails = () => {
    return {
        userName: localStorage.getItem("user_name"),
        userId: localStorage.getItem("user_id"),
        userRole: localStorage.getItem("role"),
    };
};

export const getUserOrgDetails = () => {
    return {
        org_id: localStorage.getItem("organization_id"),
        org_name: localStorage.getItem("organization_name"),
        persona: localStorage.getItem("persona"),
    };
};
