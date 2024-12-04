import { IContractorFormData } from "../common/utils/interfaces";

export const intitalFormData = (state: any) => {
    return {
        contractorName: state?.details?.contractor ?? "",
        googleWorkspaceEmail: state?.details?.google_workspace_email ?? "",
        streetAddress: state?.details?.street_name ?? "",
        city: state?.details?.city ?? "",
        state: state?.details?.state ?? "",
        zipCode: state?.details?.zip_code ?? "",
    } as IContractorFormData;
};

export const CONTRACTOR_DETAILS = {
    header: "Contractor details",
    name_label: "Contractor Name*",
    email_label: "Google Workspace Email*",
    address_label: "Street Address*",
    city_label: "City*",
    state_label: "State",
    zip_code_label: "ZIP Code",
    required_text: "This Field is needed",
    Cancel: "Cancel",
    Edit: "Edit",
    Save: "Save",
    project_history_text: "Project history",
    empty_project_placeholder: "No projects to bid at the moment.",
};
