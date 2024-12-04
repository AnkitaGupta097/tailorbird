import { put, all } from "@redux-saga/core/effects";
import { PayloadAction } from "@reduxjs/toolkit";
//eslint-disable-next-line
import { ADD_USER, GET_ALL_USERS_BY_ORGANIZATION_ID } from "stores/ims/queries";
import { graphQLClient } from "utils/gql-client";
import actions from "../../../actions";
import { IEmailMetaData } from "./rfp-manager-models";
import {
    ASSIGN_PROJECT,
    COPY_APPENDIX_TO_GC_FOLDER,
    CREATE_BID_BOOK,
    GET_ALL_ORGANIZATION_BY_TYPE,
    GET_BASELINE_BIDBOOK,
    GET_CONTRACTORLIST_FOR_PROJECT_BY_ORGANIZATION,
    GET_CONTRACTOR_LIST,
    GET_EMAIL_METADATA,
    GET_USERS_FOR_CONTRACTOR,
    GET_USER_BY_ID,
    REMOVE_ORGANIZATION_FOR_PROJECT,
    REMOVE_USER_FOR_CONTRACTOR_FOR_PROJECT,
    SEND_FOR_REVISION,
    SEND_INVITE_TO_COLLABORATORS,
    UPDATE_BID_STATUS,
    UPDATE_EMAIL_METADATA,
    CREATE_NEW_BILLING_OPPORTUNITY,
    GET_BILLING_OPPORTUNITY_ID,
    CREATE_BID_REQUEST,
    COMPUTE_BID_ITEMS_EXTENDED,
    GET_DEMAND_USERS_AND_ALL_USERS_LIST,
} from "./rfp-manager-queries";
import { OwnershipDialogConstants } from "../../../../modules/admin-portal/common/utils/constants";

export function* fetchAssignedContractorsToProjectByOrganization(action: PayloadAction<any>) {
    try {
        //@ts-ignore
        let contractorList: any = yield graphQLClient.query(
            "getContractorListForProjectByOrganization",
            GET_CONTRACTORLIST_FOR_PROJECT_BY_ORGANIZATION,
            {
                input: {
                    project_id: action.payload.project_id,
                    organization_id: action.payload.organization_id,
                    rfp_project_version: action.payload.rfp_project_version,
                },
            },
        );
        const response = {
            project_id: action.payload.project_id,
            collaboratorsList: contractorList.getContractorListForProjectByOrganization,
        };
        yield put(
            actions.rfpProjectManager.fetchAssignedContractorListForOrganizationSuccess(response),
        );
    } catch (error) {
        const payload = {
            project_id: action.payload.project_id,
        };
        yield put(actions.rfpProjectManager.SetCommonFailure(payload));
    }
}

export function* fetchAssignedContractorsToProject(action: PayloadAction<any>) {
    try {
        let list: any[] = [];
        let contractorList: { getContractorListForProject: any[] } = yield graphQLClient.query(
            "getContractorListForProject",
            GET_CONTRACTOR_LIST,
            {
                projectId: action.payload.project_id,
                rfpProjectVersion: action.payload.rfp_project_version,
            },
        );

        //@ts-ignore
        for (let contractor of contractorList.getContractorListForProject.contractor_ids) {
            let getUserDetails: any = {};
            try {
                //@ts-ignore
                getUserDetails = yield graphQLClient.query("getUserById", GET_USER_BY_ID, {
                    userId: contractor,
                });
            } catch (err) {
                console.error(err);
            }

            //find existing organization which user belongs to
            //@ts-ignore
            contractorList.getContractorListForProject.organization_details.forEach((org) => {
                if (org.organization_id === getUserDetails.getUserById?.organization.id) {
                    const index = list?.findIndex(
                        (item) => item.organization_id === org.organization_id,
                    );
                    if (index !== -1) {
                        //organization with contractor existing
                        if (getUserDetails.getUserById.roles === "CONTRACTOR_ADMIN") {
                            list[index].CONTRACTOR_ADMIN = [
                                ...list[index].CONTRACTOR_ADMIN,
                                {
                                    name: getUserDetails.getUserById.name,
                                    email: getUserDetails.getUserById.email,
                                    id: getUserDetails.getUserById.id,
                                    contact_number: getUserDetails.getUserById.contact_number,
                                    role: getUserDetails.getUserById.roles,
                                },
                            ];
                        } else if (getUserDetails.getUserById.roles === "ESTIMATOR") {
                            list[index].ESTIMATOR = [
                                ...list[index].ESTIMATOR,
                                {
                                    name: getUserDetails.getUserById.name,
                                    email: getUserDetails.getUserById.email,
                                    id: getUserDetails.getUserById.id,
                                    contact_number: getUserDetails.getUserById.contact_number,
                                    role: getUserDetails.getUserById.roles,
                                },
                            ];
                        }
                    } else {
                        //organization with contractor doesn't exist
                        let obj: any = {
                            organization_id: "",
                            name: "",
                            bid_status: "",
                            invited_on: "",
                            CONTRACTOR_ADMIN: [],
                            ESTIMATOR: [],
                            bid_versions: [],
                            bid_requests: [],
                            bid_responses: [],
                        };
                        obj.name = getUserDetails.getUserById.organization.name;
                        if (getUserDetails.getUserById.roles === "CONTRACTOR_ADMIN")
                            obj.CONTRACTOR_ADMIN = [
                                {
                                    name: getUserDetails.getUserById.name,
                                    id: getUserDetails.getUserById.id,
                                    email: getUserDetails.getUserById.email,
                                    contact_number: getUserDetails.getUserById.contact_number,
                                    role: getUserDetails.getUserById.roles,
                                },
                            ];
                        else if (getUserDetails.getUserById.roles === "ESTIMATOR")
                            obj.ESTIMATOR = [
                                {
                                    name: getUserDetails.getUserById.name,
                                    id: getUserDetails.getUserById.id,
                                    email: getUserDetails.getUserById.email,
                                    contact_number: getUserDetails.getUserById.contact_number,
                                    role: getUserDetails.getUserById.roles,
                                },
                            ];
                        obj.bid_status = org.bid_status;
                        obj.invited_on = org.invited_on;
                        obj.organization_id = org.organization_id;
                        //For RFP 2.0 project will be list of all bid_responses + latest bid request
                        if (action.payload.rfp_project_version === "2.0") {
                            const latestBidRequest =
                                org.bid_requests?.length > 0
                                    ? org.bid_requests?.[org.bid_requests?.length - 1]
                                    : [];
                            obj.bid_versions = [...org.bid_responses, latestBidRequest];
                        } else {
                            obj.bid_versions = org.bid_versions;
                        }
                        obj.bid_requests = org.bid_requests;
                        obj.bid_responses = org.bid_responses;
                        list.push(obj);
                    }
                }
            });
        }
        const response = {
            project_id: action.payload.project_id,
            assignedContractorList: list,
        };
        yield put(actions.rfpProjectManager.fetchAssignedContractorListSuccess(response));
    } catch (error) {
        yield put(
            actions.rfpProjectManager.fetchAssignedContractorListSuccess({
                project_id: action.payload.project_id,
                assignedContractorList: [],
            }),
        );
    }
}

// eslint-disable-next-line no-unused-vars
export function* fetchAllOrganizations(action: PayloadAction<any>) {
    try {
        const organizationList: { getAllOrganizations: any[] } = yield graphQLClient.query(
            "getAllOrganizations",
            GET_ALL_ORGANIZATION_BY_TYPE,
            {
                organizationType: "Contractor",
            },
        );
        const response = {
            project_id: action.payload.project_id,
            OrganizationList:
                organizationList.getAllOrganizations?.length > 0
                    ? organizationList.getAllOrganizations
                    : [],
        };
        yield put(actions.rfpProjectManager.fetchAllOrganizationsSuccess(response));
    } catch (error) {
        const payload = {
            project_id: action.payload.project_id,
        };
        yield put(actions.rfpProjectManager.SetCommonFailure(payload));
    }
}

// eslint-disable-next-line no-unused-vars
export function* fetchAllContractors(action: PayloadAction<any>) {
    try {
        const usersForContractor: { getAllUsers: any[] } = yield graphQLClient.query(
            "getAllUsers",
            GET_USERS_FOR_CONTRACTOR,
            {
                input: {
                    //@ts-ignore
                    roles: ["CONTRACTOR_ADMIN", "ESTIMATOR"],
                },
            },
        );
        const response = {
            project_id: action.payload.project_id,
            ContractorList:
                usersForContractor.getAllUsers?.length > 0 ? usersForContractor.getAllUsers : [],
        };
        yield put(actions.rfpProjectManager.fetchAllContractorsSuccess(response));
    } catch (error) {
        const payload = {
            project_id: action.payload.project_id,
        };
        yield put(actions.rfpProjectManager.SetCommonFailure(payload));
    }
}

// eslint-disable-next-line no-unused-vars
export function* fetchAllAdmin(action: PayloadAction<any>) {
    try {
        const usersForContractor: { getAllUsers: any[] } = yield graphQLClient.query(
            "getAllUsers",
            GET_USERS_FOR_CONTRACTOR,
            {
                input: {
                    //@ts-ignore
                    roles: ["ADMIN"],
                },
            },
        );
        const response = {
            project_id: action.payload.project_id,
            AdminList: usersForContractor.getAllUsers,
        };
        yield put(actions.rfpProjectManager.fetchAllAdminSuccess(response));
    } catch (error) {
        const payload = {
            project_id: action.payload.project_id,
        };
        yield put(actions.rfpProjectManager.SetCommonFailure(payload));
    }
}

export function* assignProjectsToContractorOrEstimator(action: PayloadAction<any>) {
    try {
        const payload = {
            add_organization: action.payload.add_organization,
            contractors: action.payload.contractors,
            project_id: action.payload.project_id,
            rfp_project_version: action.payload.rfp_project_version,
            is_demand_side: action.payload.is_demand_side,
        };
        yield graphQLClient.mutate("assignProjectsToContractorOrEstimator", ASSIGN_PROJECT, {
            input: payload,
        });

        const selectedContractors = action.payload.contractors;
        const contractorList = action.payload.contractorsList;
        const newAssignedContractorList: any = [];
        selectedContractors.forEach((contractor: any) => {
            if (contractor.organization_id) {
                let contractorObj = contractorList?.find(
                    //@ts-ignore
                    (item: any) => item.organization_id === contractor.organization_id,
                );
                if (contractorObj) {
                    newAssignedContractorList.push(contractorObj);
                }
            }
        });

        yield put(
            actions.rfpProjectManager.assignContractorOrEstimatorSuccess({
                loading: false,
                assignedContractorList: newAssignedContractorList,
                project_id: action.payload.project_id,
            }),
        );
        yield put(
            actions.rfpProjectManager.fetchAssignedContractorListStart({
                project_id: action.payload.project_id,
                rfp_project_version: action.payload.rfp_project_version,
            }),
        );
    } catch (error) {
        const payload = {
            project_id: action.payload.project_id,
        };
        yield put(actions.rfpProjectManager.SetCommonFailure(payload));
    }
}

export function* sendForRevision(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("sendForRevision", SEND_FOR_REVISION, {
            sendForRevisionRequest: {
                organization_ids: action.payload.organization_ids,
                project_id: action.payload.project_id,
                rfp_project_version: action.payload.rfp_project_version,
            },
        });

        yield put(
            actions.rfpProjectManager.sendForRevisionSuccess({
                loading: false,
                organization_ids: action.payload.organization_ids,
                project_id: action.payload.project_id,
            }),
        );
    } catch (error) {
        const payload = {
            project_id: action.payload.project_id,
        };
        yield put(actions.rfpProjectManager.SetCommonFailure(payload));
    }
}

export function* updateEmailMetaData(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("updateEmailMetaData", UPDATE_EMAIL_METADATA, {
            input: action.payload.field,
        });

        yield put(
            actions.rfpProjectManager.updateEmailMetaDataSuccess({
                project_id: action.payload.project_id,
                field: action.payload.field,
            }),
        );
    } catch (error) {
        const payload = {
            project_id: action.payload.project_id,
        };
        yield put(actions.rfpProjectManager.SetCommonFailure(payload));
    }
}

export function* updateBidStatus(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("updateOrganizationBidStatus", UPDATE_BID_STATUS, {
            updateBidStatus: {
                organization_id: action.payload.organization_id,
                project_id: action.payload.project_id,
                status: action.payload.status,
                rfp_project_version: action.payload.rfp_project_version,
            },
        });

        yield put(
            actions.rfpProjectManager.updateBidStatusSuccess({
                loading: false,
                organization_id: action.payload.organization_id,
                project_id: action.payload.project_id,
                status: action.payload.status,
            }),
        );
    } catch (error) {
        const payload = {
            project_id: action.payload.project_id,
        };
        yield put(actions.rfpProjectManager.SetCommonFailure(payload));
    }
}

export function* generateBidbookCopies(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("generateBidbookCopies", CREATE_BID_BOOK, {
            input: {
                generate_copies_for_new_gcs: action.payload.generate_copies_for_new_gcs,
                project_id: action.payload.project_id,
                regenerate_copies_of_existing_gcs: action.payload.regenerate_copies_of_existing_gcs,
            },
        });

        yield put(
            actions.rfpProjectManager.createBidBookSuccess({
                project_id: action.payload.project_id,
            }),
        );
    } catch (error) {
        let errorMessage = JSON.stringify(error);
        console.log(`error is ${error} and error message is ${errorMessage}`);
        //@ts-ignore
        let errorResponse =
            JSON.parse(errorMessage)?.["graphQLErrors"]?.[0]?.extensions?.response?.body
                ?.exception_message;
        //TO-DO : handle timeout error separately
        if (errorMessage?.includes("Failed to fetch")) {
            yield put(
                actions.rfpProjectManager.createBidBookSuccess({
                    project_id: action.payload.project_id,
                }),
            );
        } else {
            const payload = {
                project_id: action.payload.project_id,
                errorText: "",
            };
            if (errorResponse) {
                payload.errorText = errorResponse;
            }
            yield put(actions.rfpProjectManager.SetCommonFailure(payload));
        }
    }
}

export function* copyAppendixToGCFolder(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("copyAppendixToGCFolder", COPY_APPENDIX_TO_GC_FOLDER, {
            projectId: action.payload.project_id,
        });

        yield put(
            actions.rfpProjectManager.copyAppendixToGCFolderSuccess({
                project_id: action.payload.project_id,
            }),
        );
    } catch (error) {
        let errorMessage = JSON.stringify(error);
        console.log(`error is ${error} and error message is ${errorMessage}`);
        //TO-DO : handle timeout error separately
        if (errorMessage?.includes("Failed to fetch")) {
            yield put(
                actions.rfpProjectManager.copyAppendixToGCFolderSuccess({
                    project_id: action.payload.project_id,
                }),
            );
        } else {
            const payload = {
                project_id: action.payload.project_id,
            };
            yield put(actions.rfpProjectManager.SetCommonFailure(payload));
        }
    }
}

export function* removeOrganizationAssignedToProject(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate(
            "RemoveOrganizationAssignedToProject",
            REMOVE_ORGANIZATION_FOR_PROJECT,
            {
                removeOrganizationAssignedToProject: {
                    organization_id: action.payload.organization_id,
                    project_id: action.payload.project_id,
                    rfp_project_version: action.payload.rfp_project_version,
                },
            },
        );

        yield put(
            actions.rfpProjectManager.removeOrganizationFromProjectSuccess({
                organization_id: action.payload.organization_id,
                project_id: action.payload.project_id,
            }),
        );
    } catch (error) {
        const payload = {
            project_id: action.payload.project_id,
        };
        yield put(actions.rfpProjectManager.SetCommonFailure(payload));
    }
}

export function* removeProjectsAssignedToContractorOrEstimator(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate(
            "removeContractorOrEstimatorRequest",
            REMOVE_USER_FOR_CONTRACTOR_FOR_PROJECT,
            {
                removeContractorOrEstimatorRequest: {
                    contractors_list: action.payload.contractors_list,
                    project_id: action.payload.project_id,
                    rfp_project_version: action.payload.rfp_project_version,
                    is_demand_side: action.payload.is_demand_side,
                },
            },
        );

        yield put(
            actions.rfpProjectManager.removeUsersFromProjectSuccess({
                contractors_list: action.payload.contractors_list,
                project_id: action.payload.project_id,
            }),
        );
    } catch (error) {
        const payload = {
            project_id: action.payload.project_id,
        };
        yield put(actions.rfpProjectManager.SetCommonFailure(payload));
    }
}

export function* fetchEmailMetaData(action: PayloadAction<any>) {
    try {
        const response: { getEmailMetaData: IEmailMetaData } = yield graphQLClient.query(
            "getEmailMetaData",
            GET_EMAIL_METADATA,
            {
                projectId: action.payload.project_id,
                rfp_project_version: action.payload.rfp_project_version,
            },
        );
        const data = {
            project_id: action.payload.project_id,
            emailMetaData: response.getEmailMetaData,
        };
        yield put(actions.rfpProjectManager.fetchEmailMetaDataSuccess(data));
    } catch (error) {
        console.log(error);
    }
}

export function* fetchBaselineBidBook(action: PayloadAction<any>) {
    try {
        const response: { getBaselineBidBookForProject: { bidbook_url: String } } =
            yield graphQLClient.query("GetBaselineBidBookForProject", GET_BASELINE_BIDBOOK, {
                projectId: action.payload.project_id,
            });
        const data = {
            project_id: action.payload.project_id,
            baselineBidBook: response.getBaselineBidBookForProject.bidbook_url,
        };
        yield put(actions.rfpProjectManager.fetchBaselineBidBookSuccess(data));
    } catch (error) {
        yield put(
            actions.rfpProjectManager.fetchBaselineBidBookSuccess({
                project_id: action.payload.project_id,
                baselineBidBook: "",
            }),
        );
    }
}

export function* removeCollaboratorFromProject(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate(
            "removeContractorOrEstimatorRequest",
            REMOVE_USER_FOR_CONTRACTOR_FOR_PROJECT,
            {
                removeContractorOrEstimatorRequest: {
                    contractors_list: action.payload.contractors_list,
                    project_id: action.payload.project_id,
                    rfp_project_version: action.payload.rfp_project_version,
                },
            },
        );

        yield put(
            actions.rfpProjectManager.removeCollaboratorSuccess({
                contractors_list: action.payload.contractors_list,
                project_id: action.payload.project_id,
            }),
        );
    } catch (error) {
        const payload = {
            project_id: action.payload.project_id,
        };
        yield put(actions.rfpProjectManager.SetCommonFailure(payload));
    }
}
// eslint-disable-next-line no-unused-vars
export function* createNewCollaborator(action: PayloadAction<any>) {
    try {
        let input = {};
        Object.assign(input, action.payload.input);
        // @ts-ignore
        yield graphQLClient.mutate("createUser", ADD_USER, {
            payload: input,
        });
        // @ts-ignore
        let response = yield graphQLClient.query(
            "getUsersByOrgId",
            GET_ALL_USERS_BY_ORGANIZATION_ID,
            {
                organization_id: action.payload.organization_id,
            },
        );
        yield all([
            put(
                actions.imsActions.fetchUsersByOrgIdComplete({
                    organization_id: action.payload.organization_id,
                    users: response.getUsersByOrgId,
                }),
            ),
            put(actions.rfpProjectManager.createNewCollaboratorSuccess(false)),
        ]);
    } catch (error) {
        yield put(actions.rfpProjectManager.createNewCollaboratorFailure(false));
    }
}

// eslint-disable-next-line no-unused-vars
export function* inviteCollaborators(action: PayloadAction<any>) {
    try {
        let response = null;
        const payload = {
            add_organization: false,
            contractors: action.payload.collaborators.map((obj: any) => ({
                contractor_id: obj.id,
                organization_id: action.payload.organizationId,
            })),
            project_id: action.payload.project_id,
            rfp_project_version: action.payload.rfp_project_version,
        };
        // @ts-ignore
        yield graphQLClient.mutate("assignProjectsToContractorOrEstimator", ASSIGN_PROJECT, {
            input: payload,
        });
        const selectedContractors = action.payload.collaborators;
        const sentEmailPayload = {
            recipient_emails: selectedContractors.map((contractor: any) => contractor.email),
            event_type: "send_invite",
            project_id: action.payload.project_id,
            organization_id: action.payload.organizationId,
            sender_details: {
                email: localStorage.getItem("email"),
                name: JSON.parse(String(localStorage.getItem("user_details")))?.nickname,
            },
            recipient_ids: payload.contractors.map((item: any) => item.contractor_id),
            rfp_project_version: action.payload.rfp_project_version,
            invited_by: action.payload.invited_by,
        };

        // @ts-ignore
        response = yield graphQLClient.mutate(
            "sendInviteToCollaborators",
            SEND_INVITE_TO_COLLABORATORS,
            {
                sendInviteToCollaboratorsRequest: sentEmailPayload,
            },
        );
        if (response.status === "success") {
            let assignedContractorList = action.payload.collaboratorsList ?? [];
            // to avoid duplication while reinviting same collaborator
            assignedContractorList = assignedContractorList
                .concat(action.payload.collaborators)
                .filter(
                    (value: any, index: number, self: typeof assignedContractorList) =>
                        self.findIndex((v: any) => v?.id === value?.id) === index,
                );
            yield put(
                actions.rfpProjectManager.inviteCollaboratorsSuccess({
                    loading: false,
                    collaboratorsList: assignedContractorList,
                    project_id: action.payload.project_id,
                }),
            );
        }
    } catch (error) {
        console.error(error);
        yield put(
            actions.rfpProjectManager.sendInviteFailure({
                loading: false,
                error: true,
            }),
        );
    }
}

// eslint-disable-next-line no-unused-vars
export function* sendInvite(action: PayloadAction<any>) {
    try {
        const selectedContractors = action.payload.collaborators;
        const sentEmailPayload = {
            recipient_emails: selectedContractors.map((contractor: any) => contractor.email),
            event_type: "send_invite",
            project_id: action.payload.project_id,
            organization_id: action.payload.organizationId,
            sender_details: {
                email: localStorage.getItem("email"),
                name: JSON.parse(String(localStorage.getItem("user_details")))?.nickname,
            },
            recipient_ids: action.payload.collaborators.map((item: any) => item.id),
            rfp_project_version: action.payload.rfp_project_version,
        };
        // @ts-ignore
        let response = yield graphQLClient.mutate(
            "sendInviteToCollaborators",
            SEND_INVITE_TO_COLLABORATORS,
            {
                sendInviteToCollaboratorsRequest: sentEmailPayload,
            },
        );
        if (response.status == "success") {
            yield put(
                actions.rfpProjectManager.sendInviteSuccess({
                    loading: false,
                }),
            );
        }
    } catch (e) {
        yield put(
            actions.rfpProjectManager.sendInviteFailure({
                loading: false,
                error: true,
            }),
        );
    }
}

// eslint-disable-next-line no-unused-vars
export function* createNewBillingOpportunity(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.mutate(
            "createNewBillingOpportunity",
            CREATE_NEW_BILLING_OPPORTUNITY,
            {
                project_id: action.payload.project_id,
                rfpProjectVersion: action.payload.rfp_project_version,
            },
        );
        response.project_id = action.payload.project_id;
        if (response.error?.length > 0) {
            yield put(actions.rfpProjectManager.createBillingOpportunityFailure(response));
        } else {
            yield put(actions.rfpProjectManager.createBillingOpportunitySuccess(response));
        }
    } catch (error) {
        yield put(
            actions.rfpProjectManager.createBillingOpportunityFailure({
                project_id: action.payload.project_id,
            }),
        );
    }
}

export function* fetchBillingOpportunityID(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query(
            "getBillingOpportunityID",
            GET_BILLING_OPPORTUNITY_ID,
            {
                projectId: action.payload.project_id,
                rfpProjectVersion: action.payload.rfp_project_version,
            },
        );

        if (response.error?.length > 0) {
            yield put(actions.rfpProjectManager.fetchBillingOpportunityIDSuccess(null));
        } else {
            yield put(
                actions.rfpProjectManager.fetchBillingOpportunityIDSuccess(
                    response.getBillingOpportunityID,
                ),
            );
        }
    } catch (error) {
        yield put(actions.rfpProjectManager.fetchBillingOpportunityIDSuccess(null));
    }
}

export function* createBidRequest(action: PayloadAction<any>) {
    try {
        //@ts-ignore
        yield graphQLClient.mutate("createBidRequest", CREATE_BID_REQUEST, {
            input: action?.payload?.input,
        });
        yield put(
            actions.rfpProjectManager.fetchAssignedContractorListStart({
                project_id: action.payload.input.project_id,
                rfp_project_version: action.payload.rfpProjectVersion,
            }),
        );
        if (action?.payload?.input?.type === "bid_request") {
            yield put(
                actions.rfpProjectManager.createBidRequestSuccess({
                    loading: false,
                    organization_ids: action.payload.input.contractor_org_ids,
                    project_id: action.payload.project_id,
                    status: "invited",
                    type: action.payload.input.type,
                    bid_requests: action.payload.input,
                }),
            );
        } else {
            yield put(
                actions.rfpProjectManager.createBidRequestSuccess({
                    project_id: action.payload.input.project_id,
                    type: action.payload.input.type,
                    bid_requests: action.payload.input,
                    status: "requested_revised_pricing",
                    organization_ids: action.payload.input.contractor_org_ids,
                }),
            );
        }
    } catch (error) {
        yield put(
            actions.rfpProjectManager.createBidRequestFailure({
                project_id: action.payload.input?.project_id,
            }),
        );
    }
}

export function* computeBidItemsExtended(action: PayloadAction<any>) {
    try {
        //@ts-ignore
        const response = yield graphQLClient.mutate(
            "computeBidItemExtended",
            COMPUTE_BID_ITEMS_EXTENDED,
            {
                projectId: action.payload.projectId,
            },
        );
        if (response) {
            action.payload?.createBillingOpportunity();
            yield put(actions.rfpProjectManager.computeBidItemExtendedComplete());
        } else {
            yield put(actions.rfpProjectManager.computeBidItemExtendedFailed());
            yield put(
                actions.common.openSnack({
                    message: "Couldn't send the project for billing",
                    variant: "success",
                    open: true,
                }),
            );
        }
    } catch (exception) {
        yield put(actions.rfpProjectManager.computeBidItemExtendedFailed());
    }
}
async function OrgAndUserMapping(allUsersById: any, allUserObj: any) {
    const map: { [key: string]: { [key: string]: any[] } } = {};
    const org_map = new Map();
    const allDemandUsers: any = [];

    for (let user of allUserObj) {
        const { contractor_id: user_id, invited_on, organization_id } = user;
        map[organization_id] = map[organization_id] || {};
        org_map.set(organization_id, allUsersById[user_id]?.organization?.name);
        map[organization_id][allUsersById[user_id]?.roles] =
            map[organization_id][allUsersById[user_id]?.roles] || [];

        allDemandUsers.push({
            name: allUsersById[user_id]?.name,
            email: allUsersById[user_id]?.email,
            id: allUsersById[user_id]?.id,
            role: allUsersById[user_id]?.roles,
            organization_id: organization_id,
            organization_name: allUsersById[user_id]?.organization?.name,
            organization_type: allUsersById[user_id]?.organization?.organization_type,
            invited_on: invited_on,
        });
        map[organization_id][allUsersById[user_id]?.roles].push({
            name: allUsersById[user_id]?.name,
            email: allUsersById[user_id]?.email,
            id: allUsersById[user_id]?.id,
            role: allUsersById[user_id]?.roles,
        });
    }
    const list = [];
    for (const organization_id of Object.keys(map)) {
        list.push({
            ...map[organization_id],
            organization_id: organization_id,
            name: org_map.get(organization_id),
        });
    }
    return {
        allDemandUsers: allDemandUsers,
        OrgsWithDemandUsers: list,
    };
}

export function* fetchAssignedUsersToProject(action: PayloadAction<any>) {
    try {
        const demandAndAllUsers: { getContractorListForProject: any; getAllUsers: any } =
            yield graphQLClient.query("", GET_DEMAND_USERS_AND_ALL_USERS_LIST, {
                projectId: action.payload.project_id,
                rfpProjectVersion: "2.0",
                isDemandSide: true,
            });
        const demandOrgTypes: string[] = OwnershipDialogConstants.ORG_TYPES.map(
            (orgType) => orgType.value,
        );

        const allUserObj: any = demandAndAllUsers.getAllUsers
            .filter(
                (user: any) =>
                    user?.organization?.organization_type?.length > 0 &&
                    demandOrgTypes.includes(user?.organization?.organization_type[0]),
            )
            .map((user: any) => ({
                organization_id: user.organization.id,
                contractor_id: user.id,
            }));
        let allUsersById: any = {};
        demandAndAllUsers.getAllUsers.forEach((user: any) => {
            allUsersById[user.id] = user;
        });
        const userIds: any = demandAndAllUsers?.getContractorListForProject.user_list;
        // @ts-ignore
        const UserMapping = yield OrgAndUserMapping(allUsersById, userIds);
        //@ts-ignore
        const allOrgUserMapping = yield OrgAndUserMapping(allUsersById, allUserObj);

        const response = {
            project_id: action.payload.project_id,
            allDemandUsers: UserMapping.allDemandUsers,
            allOrgsWithDemandUsers: UserMapping.OrgsWithDemandUsers,
            allOrgsWithUsers: allOrgUserMapping.OrgsWithDemandUsers,
        };

        yield put(actions.rfpProjectManager.fetchAssignedUserListSuccess(response));
    } catch (error) {
        yield put(
            actions.rfpProjectManager.fetchAssignedUserListSuccess({
                project_id: action.payload.project_id,
                allDemandUsers: [],
                allOrgsWithDemandUsers: [],
                allOrgsWithUsers: [],
            }),
        );
    }
}
