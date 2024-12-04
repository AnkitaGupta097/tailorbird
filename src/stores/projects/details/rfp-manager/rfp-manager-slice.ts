import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initAjaxState from "../../../initAjaxState.json";
import { cloneDeep } from "lodash";
import { updateObject } from "utils/store-helpers";
import moment from "moment";
import { formatDate } from "utils/date-time-convertor";

const initState = cloneDeep(initAjaxState) as any;

const initialState = initState;
initialState.loaderState = { open: false, loaderText: "", errorText: "", saveText: "" };
const obj = {
    loading: false,
    billing_opportunity_id: null,
    loadingComputeBidItems: false,
    //state to store list of contractors mapped to every project id
    assignedContractorList: [
        {
            contractor_id: "",
            name: "",
            bid_status: "",
            organization_id: "",
            admins: [],
            estimators: [],
            invited_on: null,
            bid_versions: [],
        },
    ],
    OrganizationList: [
        {
            id: "",
            name: "",
            street_name: "",
            city: "",
        },
    ],
    ContractorList: [
        {
            id: "",
            name: "",
            email: "",
            organization: {
                id: "",
                name: "",
            },
        },
    ],
    collaboratorsList: [
        {
            id: "",
            name: "",
            email: "",
            contact_number: "",
            role: "",
            status: "",
        },
    ],
    AdminList: [],
    emailMetaData: {
        project_id: "",
        bid_due_date: "",
        include_alt_bid_requests: false,
        include_flooring_scope: false,
        project_specific_notes: "",
        tailorbird_contact_phone_number: "",
        tailorbird_contact_user_id: "",
    },
    error: false,
    errorText: "",
    baselineBidBook: "",
    allDemandUsers: [],
    allOrgsWithDemandUsers: [],
    allOrgsWithUsers: [],
};

initState.details = {
    "0": obj,
};

// eslint-disable-next-line no-unused-vars
function fetchBillingOpportunityIDStart(state: any, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchBillingOpportunityIDSuccess(state: any, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        billing_opportunity_id: action.payload,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchAssignedContractorListStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchAssignedContractorListForOrganizationStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        loading: true,
        details: details,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchAssignedContractorListForOrganizationSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    details[action.payload.project_id] = {
        ...details[action.payload.project_id],
        collaboratorsList: action.payload.collaboratorsList,
    };
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}
// eslint-disable-next-line no-unused-vars
function fetchAssignedContractorListSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    details[action.payload.project_id] = {
        ...details[action.payload.project_id],
        assignedContractorList: action.payload.assignedContractorList,
    };
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

// eslint-disable-next-line no-unused-vars
function SetCommonFailure(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    details[action.payload.project_id].loading = false;
    details[action.payload.project_id].error = true;
    details[action.payload.project_id].errorText =
        action.payload.errorText?.length > 0 ? action.payload.errorText : "";
    return updateObject(state, {
        loading: false,
        details: details,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchAllOrganizationsStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}
//eslint-disable-next-line no-unused-vars
function clearBillingOpportunityId(state: any, action: PayloadAction<any>) {
    return updateObject(state, {
        billing_opportunity_id: null,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchAllOrganizationsSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    details[action.payload.project_id] = {
        ...details[action.payload.project_id],
        OrganizationList: action.payload.OrganizationList,
    };
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

// // eslint-disable-next-line no-unused-vars
// function fetchAllOrganizationsFailure(state: any, action: PayloadAction<any>) {
//     return updateObject(state, {
//         loading: action.payload,
//         error: action.payload,
//     });
// }

// eslint-disable-next-line no-unused-vars
function fetchAllContractorsStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchAllContractorsSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    details[action.payload.project_id] = {
        ...details[action.payload.project_id],
        ContractorList: action.payload.ContractorList,
    };
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
    // return updateObject(state, {
    //     loading: false,
    //     ContractorList: action.payload,
    // });
}

// eslint-disable-next-line no-unused-vars
function fetchAllAdminStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchAllAdminSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    details[action.payload.project_id] = {
        ...details[action.payload.project_id],
        AdminList: action.payload.AdminList,
    };
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

// // eslint-disable-next-line no-unused-vars
// function fetchAllContractorsFailure(state: any, action: PayloadAction<any>) {
//     return updateObject(state, {
//         loading: action.payload,
//         error: action.payload,
//     });
// }

// eslint-disable-next-line no-unused-vars
function assignContractorOrEstimatorStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

function assignContractorOrEstimatorSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    let contractorList = details[action.payload.project_id].assignedContractorList;
    let newContractors = action.payload.assignedContractorList;
    newContractors?.forEach((contractor: any) => {
        const index = contractorList.findIndex(
            (item: any) => item.organization_id === contractor.organization_id,
        );
        if (index === -1) {
            contractor.invited_on = null;
            contractorList = [...contractorList, contractor];
            details[action.payload.project_id].assignedContractorList = contractorList;
        } else {
            details[action.payload.project_id].assignedContractorList[index] = contractor;
        }
    });
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

// function assignContractorOrEstimatorFailure(state: any, action: PayloadAction<any>) {
//     return updateObject(state, {
//         loading: action.payload.loading,
//         error: action.payload.error,
//     });
// }
// eslint-disable-next-line no-unused-vars
function sendForRevisionStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

function sendForRevisionSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    let contractorList = details[action.payload.project_id].assignedContractorList;
    contractorList = contractorList.map((contractor: any) => {
        for (let index in action.payload.organization_ids) {
            if (contractor.organization_id === action.payload.organization_ids[index]) {
                contractor.bid_status = "requested_revised_pricing";
            }
        }
        return contractor;
    });

    details[action.payload.project_id].assignedContractorList = [...contractorList];
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

// function sendForRevisionFailure(state: any, action: PayloadAction<any>) {
//     return updateObject(state, {
//         loading: action.payload,
//         error: action.payload,
//     });
// }

// eslint-disable-next-line no-unused-vars
function updateEmailMetaDataStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

function updateEmailMetaDataSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    else if (details[action.payload.project_id]) {
        details[action.payload.project_id].emailMetaData = action.payload.field;
    }
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

// function updateEmailMetaDataFailure(state: any, action: PayloadAction<any>) {
//     return updateObject(state, {
//         loading: action.payload,
//         error: action.payload,
//     });
// }

// eslint-disable-next-line no-unused-vars
function removeUsersFromProjectStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

function removeUsersFromProjectSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    let contractorList = details[action.payload.project_id].assignedContractorList;

    let index = contractorList?.findIndex(
        (contractor: any) =>
            contractor.organization_id === action.payload.contractors_list?.[0]?.organization_id,
    );

    if (index !== -1) {
        action.payload.contractors_list?.map((contractor: { contractor_id: any }) => {
            const adminIndex = contractorList[index]?.CONTRACTOR_ADMIN?.findIndex(
                (admin: { id: any }) => admin?.id === contractor?.contractor_id,
            );
            const estimatorIndex = contractorList[index]?.ESTIMATOR?.findIndex(
                (estimator: { id: any }) => estimator?.id === contractor?.contractor_id,
            );
            if (adminIndex !== -1) {
                contractorList[index]?.CONTRACTOR_ADMIN.splice(adminIndex, 1);
            } else if (estimatorIndex !== -1) {
                contractorList[index]?.ESTIMATOR.splice(estimatorIndex, 1);
            }
        });

        if (
            contractorList[index]?.CONTRACTOR_ADMIN?.length === 0 &&
            contractorList[index]?.ESTIMATOR?.length === 0
        ) {
            contractorList.splice(index, 1);
        }
    }
    details[action.payload.project_id].assignedContractorList = [...contractorList];
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

// function removeUsersFromProjectFailure(state: any, action: PayloadAction<any>) {
//     return updateObject(state, {
//         loading: action.payload,
//         error: action.payload,
//     });
// }

// eslint-disable-next-line no-unused-vars
function removeOrganizationFromProjectStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

function removeOrganizationFromProjectSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    let contractorList = details[action.payload.project_id].assignedContractorList;

    let index = contractorList?.findIndex(
        (contractor: any) => contractor.organization_id === action.payload.organization_id,
    );

    if (index !== -1) contractorList.splice(index, 1);

    details[action.payload.project_id].assignedContractorList = [...contractorList];
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

// function removeOrganizationFromProjectFailure(state: any, action: PayloadAction<any>) {
//     return updateObject(state, {
//         loading: action.payload,
//         error: action.payload,
//     });
// }

// eslint-disable-next-line no-unused-vars
function updateBidStatusStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

function updateBidStatusSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    let contractorList = details[action.payload.project_id].assignedContractorList;

    contractorList = contractorList.map((contractor: any) => {
        if (contractor.organization_id === action.payload.organization_id) {
            contractor.bid_status = action.payload.status;
        }
        return contractor;
    });

    details[action.payload.project_id].assignedContractorList = [...contractorList];
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

// function updateBidStatusFailure(state: any, action: PayloadAction<any>) {
//     return updateObject(state, {
//         loading: action.payload,
//         error: action.payload,
//     });
// }

// eslint-disable-next-line no-unused-vars
function createBidBookStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

function createBidBookSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    let contractorList = details[action.payload.project_id].assignedContractorList;
    contractorList.map((contractor: { invited_on: string; bid_status: string }) => {
        if (
            contractor?.bid_status === "Not Invited" ||
            contractor?.bid_status === "pending_invite"
        ) {
            contractor.bid_status = "Invited";
            contractor.invited_on = formatDate(moment(new Date()).format("YYYY-MM-DD"));
        }
    });
    details[action.payload.project_id].assignedContractorList = [...contractorList];
    details[action.payload.project_id].loading = false;

    return updateObject(state, {
        details: details,
    });
}

// //
// function createBidBookFailure(state: any, action: PayloadAction<any>) {
//     return updateObject(state, {
//         loading: action.payload,
//         error: action.payload,
//     });
// }

// eslint-disable-next-line no-unused-vars
function copyAppendixToGCFolderStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

function copyAppendixToGCFolderSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

// //
// function copyAppendixToGCFolderFailure(state: any, action: PayloadAction<any>) {
//     return updateObject(state, {
//         loading: action.payload,
//         error: action.payload,
//     });
// }

// eslint-disable-next-line no-unused-vars
function fetchEmailMetaDataStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

function fetchEmailMetaDataSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    details[action.payload.project_id] = {
        ...details[action.payload.project_id],
        emailMetaData: action.payload.emailMetaData,
    };
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchBaselineBidBookStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

function fetchBaselineBidBookSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    details[action.payload.project_id] = {
        ...details[action.payload.project_id],
        baselineBidBook: action.payload.baselineBidBook,
    };
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

function resetState(
    state: any,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    (details[action.payload.project_id].loading = false),
        (details[action.payload.project_id].error = false),
        (details[action.payload.project_id].saved = false);
    return updateObject(state, {
        loading: false,
        saved: false,
        error: { msg: "", statusCode: 200, type: "" },
        details: details,
        loaderState: {
            open: false,
            loaderText: "",
            errorText: "",
            saveText: "",
        },
        errorText: "",
    });
}

// eslint-disable-next-line no-unused-vars
function inviteCollaboratorsStart(state: any, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line no-unused-vars
function createNewCollaboratorStart(state: any, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line no-unused-vars
function createNewCollaboratorSuccess(state: any, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

// eslint-disable-next-line no-unused-vars
function createNewCollaboratorFailure(state: any, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        error: { msg: "Failed to create new collaborator", statusCode: 500, type: "error" },
    });
}

// eslint-disable-next-line no-unused-vars
function removeCollaboratorStart(state: any, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line no-unused-vars
// function removeCollaboratorFailure(state: any, action: PayloadAction<any>) {
//     return updateObject(state, {
//         loading: false,
//         error: true,
//     });
// }

// eslint-disable-next-line no-unused-vars
function removeCollaboratorSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    const collaboratorsResponse = action.payload.contractors_list;
    let collaboratorsList = details[action.payload.project_id]?.collaboratorsList ?? [];

    for (let index in collaboratorsResponse) {
        let foundIndex = collaboratorsList?.findIndex(
            (user: any) => user.id === collaboratorsResponse[index].contractor_id,
        );
        if (foundIndex != -1) {
            collaboratorsList.splice(foundIndex, 1);
        }
    }
    if (!details[action.payload.project_id]) {
        details[action.payload.project_id] = {};
    }
    details[action.payload.project_id]["collaboratorsList"] = [...collaboratorsList];

    return updateObject(state, {
        loading: false,
        loaderState: {
            open: true,
            loaderText: "",
            errorText: "",
            saveText: "User is successfully deleted",
        },
        details: details,
    });
}

// eslint-disable-next-line no-unused-vars
function inviteCollaboratorsSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    const collaboratorsResponse = action.payload.collaboratorsList;
    let collaboratorsList = details[action.payload.project_id]?.collaboratorsList ?? [];

    for (let index in collaboratorsResponse) {
        let foundIndex = collaboratorsList?.findIndex(
            (user: any) => user.id === collaboratorsResponse[index].id,
        );
        if (foundIndex == -1) {
            collaboratorsList.push(collaboratorsResponse[index]);
        }
    }
    if (!details[action.payload.project_id]) {
        details[action.payload.project_id] = {};
    }
    details[action.payload.project_id]["collaboratorsList"] = [...collaboratorsResponse];

    return updateObject(state, {
        loading: false,
        loaderState: {
            open: true,
            loaderText: "",
            errorText: "",
            saveText: "Invite has been successfully sent",
        },
        details: details,
    });
}

// eslint-disable-next-line no-unused-vars
function sendInviteStart(state: any, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line no-unused-vars
function sendInviteSuccess(state: any, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        loaderState: {
            open: true,
            loaderText: "",
            errorText: "",
            saveText: "Invite has been successfully sent",
        },
    });
}

// eslint-disable-next-line no-unused-vars
function sendInviteFailure(state: any, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        error: { statusCode: 400, msg: "Failed to send invite" },
    });
}

// eslint-disable-next-line no-unused-vars
function createBillingOpportunityStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        loadingComputeBidItems: true,
        details: details,
    });
}

// eslint-disable-next-line no-unused-vars
function createBillingOpportunitySuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = false;
    details[action.payload.project_id].error = false;
    details[action.payload.project_id].errorText = "";
    return updateObject(state, {
        loading: false,
        loadingComputeBidItems: false,
        details: details,
        loaderState: {
            open: true,
            loaderText: "",
            errorText: "",
            saveText: `Billing Opportunity successfully created. Id: ${action.payload.billing_opportunity_id}`,
        },
        billing_opportunity_id: action.payload.billing_opportunity_id,
    });
}

// eslint-disable-next-line no-unused-vars
function createBillingOpportunityFailure(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = false;
    details[action.payload.project_id].error = true;
    details[action.payload.project_id].errorText = "";
    return updateObject(state, {
        loading: false,
        details: details,
        loadingComputeBidItems: false,
        loaderState: {
            open: true,
            loaderText: "",
            errorText: action.payload?.error,
            saveText: "",
        },
        error: { statusCode: 400, msg: "There was an internal error." },
    });
}

// eslint-disable-next-line no-unused-vars
function createBidRequestStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) details[action.payload.project_id] = {};
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

function createBidRequestSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    let contractorList = details[action.payload.project_id].assignedContractorList;

    contractorList = contractorList.map((contractor: any) => {
        if (action?.payload?.organization_ids?.includes(contractor.organization_id)) {
            contractor.bid_status = action.payload.status;
            if (action?.payload?.type === "bid_request") {
                contractor.bid_requests = [action.payload.bid_requests];
            } else {
                contractor.bid_requests = [...contractor.bid_requests, action.payload.bid_requests];
            }
        }
        return contractor;
    });

    details[action.payload.project_id].assignedContractorList = [...contractorList];
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

function createBidRequestFailure(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    details[action.payload.project_id].loading = false;
    details[action.payload.project_id].error = true;

    return updateObject(state, {
        details: details,
    });
}

//eslint-disable-next-line
function computeBidItemExtendedStart(state: any, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingComputeBidItems: true,
    });
}

//eslint-disable-next-line
function computeBidItemExtendedComplete(state: any) {
    return updateObject(state, {});
}

function computeBidItemExtendedFailed(state: any) {
    return updateObject(state, {
        loadingComputeBidItems: false,
    });
}
// eslint-disable-next-line no-unused-vars
function fetchAssignedUsersListStart(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    if (!details[action.payload.project_id]) {
        details[action.payload.project_id] = {};
    }
    details[action.payload.project_id].loading = true;
    return updateObject(state, {
        details: details,
    });
}

function fetchAssignedUserListSuccess(state: any, action: PayloadAction<any>) {
    const details = cloneDeep(state.details);
    details[action.payload.project_id] = {
        ...details[action.payload.project_id],
        allDemandUsers: action.payload?.allDemandUsers,
        allOrgsWithDemandUsers: action.payload?.allOrgsWithDemandUsers,
        allOrgsWithUsers: action.payload?.allOrgsWithUsers,
    };
    details[action.payload.project_id].loading = false;
    return updateObject(state, {
        details: details,
    });
}

const slice = createSlice({
    name: "rfp_manager",
    initialState: initialState,
    reducers: {
        fetchAssignedContractorListForOrganizationStart,
        fetchAssignedContractorListForOrganizationSuccess,
        fetchAssignedContractorListStart,
        fetchAssignedContractorListSuccess,
        SetCommonFailure,
        clearBillingOpportunityId,
        fetchAllOrganizationsStart,
        fetchAllOrganizationsSuccess,
        fetchAllContractorsStart,
        fetchAllContractorsSuccess,
        assignContractorOrEstimatorStart,
        assignContractorOrEstimatorSuccess,
        fetchAllAdminStart,
        fetchAllAdminSuccess,
        updateEmailMetaDataStart,
        updateEmailMetaDataSuccess,
        fetchEmailMetaDataStart,
        fetchEmailMetaDataSuccess,
        updateBidStatusStart,
        updateBidStatusSuccess,
        fetchBaselineBidBookStart,
        fetchBaselineBidBookSuccess,
        removeUsersFromProjectStart,
        removeUsersFromProjectSuccess,
        removeOrganizationFromProjectStart,
        removeOrganizationFromProjectSuccess,
        createBidBookStart,
        createBidBookSuccess,
        copyAppendixToGCFolderStart,
        copyAppendixToGCFolderSuccess,
        sendForRevisionStart,
        sendForRevisionSuccess,
        resetState,
        inviteCollaboratorsStart,
        inviteCollaboratorsSuccess,
        createNewCollaboratorStart,
        createNewCollaboratorSuccess,
        createNewCollaboratorFailure,
        removeCollaboratorStart,
        removeCollaboratorSuccess,
        sendInviteFailure,
        sendInviteStart,
        sendInviteSuccess,
        createBillingOpportunityStart,
        createBillingOpportunitySuccess,
        createBillingOpportunityFailure,
        fetchBillingOpportunityIDStart,
        fetchBillingOpportunityIDSuccess,
        createBidRequestStart,
        createBidRequestSuccess,
        createBidRequestFailure,
        computeBidItemExtendedComplete,
        computeBidItemExtendedFailed,
        computeBidItemExtendedStart,
        fetchAssignedUsersListStart,
        fetchAssignedUserListSuccess,
    },
});

export const actions = slice.actions;
export default slice.reducer;
