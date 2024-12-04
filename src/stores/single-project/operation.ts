/* eslint-disable no-unused-vars */
import { PayloadAction } from "@reduxjs/toolkit";
import { put } from "@redux-saga/core/effects";

import {
    CREATE_PROJECT_FILES,
    DELETE_PROJECT_FILES,
    GET_PROJECT_FILES,
    GET_SINGLE_PROJECT,
    GET_PRODUCTION_PROJECT,
    MARK_FILE_UPLOADED,
    GET_KEY_PEOPLE,
    GET_FILE_DOWNLOAD_LINK,
    GET_RFP_BID_STATUSES,
    GET_PACKAGES,
    GET_QUESTIONS_AND_ANSWERS,
    GET_QUESTION_RESPONSES,
    CREATE_QUESTION_RESPONSE,
    GET_SPECS_AVAILABLE,
    GET_INVENTORY_LIST,
    GET_RENO_PARAMETERS,
    GET_RENO_ITEMS,
    UPDATE_SINGLE_PROJECT,
    GET_APPROVAL_CHANGE_ORDERS,
    GET_MONTHLY_SPEND_ANALYSIS,
    GET_PROJECT_BUDGET,
    GET_RENO_TIME_BY_UNIT,
    GET_MONTHLY_UNIT_TURNED,
    GET_RENOVATION_PROGRESS,
    GET_UNIT_STATUS_MAP,
} from "./queries";
import actions from "../actions";
import { client as graphQLClient } from "../gql-client";
import { graphQLClient as graphQLClientFromUtil } from "utils/gql-client";

import { IFileDetails } from "./interfaces";
import { find } from "lodash";
import TrackerUtil from "utils/tracker";
import projectDetails from "modules/rfp-manager/project-details-v2/project-details";

//eslint-disable-next-line
export function* fetchSingleProject(action: PayloadAction<any>) {
    // const loggedUserRole = localStorage.getItem("role");
    // const organization_id = localStorage.getItem("organization_id") ?? "";
    try {
        // @ts-ignore
        const response: { getProjectById } = yield graphQLClient.query(
            "getProjectById",
            GET_SINGLE_PROJECT,
            {
                projectId: action.payload.project_id,
            },
        );
        yield put(
            actions.singleProject.fetchProjectDataSuccess({
                project: response,
            }),
        );
    } catch (exception) {
        yield put(
            actions.singleProject.fetchProjectDataFailure({
                project: {},
            }),
        );
    }
}

export function* fetchProjectBudget(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: { getProjectBudgetStat } = yield graphQLClient.query(
            "getProjectBudgetStat",
            GET_PROJECT_BUDGET,
            {
                projectId: action.payload.projectId,
            },
        );
        yield put(
            actions.singleProject.fetchProjectBudgetSuccess({
                budgetStats: response,
            }),
        );
    } catch (exception) {
        yield put(
            actions.singleProject.fetchProjectBudgetFailure({
                budgetStats: {},
            }),
        );
    }
}

export function* fetchRenoTimeByUnit(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: { getRenovationTime } = yield graphQLClient.query(
            "getRenovationTime",
            GET_RENO_TIME_BY_UNIT,
            {
                projectId: action.payload.projectId,
                columns: action.payload.columns,
            },
        );
        yield put(
            actions.singleProject.fetchRenoTimeByUnitSuccess({
                renoTimeByUnit: response,
                columns: action.payload.columns,
            }),
        );
    } catch (exception) {
        yield put(
            actions.singleProject.fetchRenoTimeByUnitFailure({
                renoTimeByUnit: {},
            }),
        );
    }
}

export function* fetchMonthlyTurnedUnits(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: { getUnitsByMonth } = yield graphQLClient.query(
            "getUnitsByMonth",
            GET_MONTHLY_UNIT_TURNED,
            {
                projectId: action.payload.projectId,
            },
        );
        yield put(
            actions.singleProject.fetchMonthlyTurnedUnitsSuccess({
                monthByMonthUnitsTurned: response,
            }),
        );
    } catch (exception) {
        yield put(
            actions.singleProject.fetchMonthlyTurnedUnitsFailure({
                monthByMonthUnitsTurned: {},
            }),
        );
    }
}

export function* fetchRenovationProgress(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: { getRenovationProgress } = yield graphQLClient.query(
            "getRenovationProgress",
            GET_RENOVATION_PROGRESS,
            {
                projectId: action.payload.projectId,
            },
        );
        yield put(
            actions.singleProject.fetchRenovationProgressSuccess({
                renovationProgress: response,
            }),
        );
    } catch (exception) {
        yield put(
            actions.singleProject.fetchRenovationProgressFailure({
                renovationProgress: {},
            }),
        );
    }
}

export function* fetchUnitStatusMap(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: { getProjectAnalytics } = yield graphQLClient.query(
            "getProjectAnalytics",
            GET_UNIT_STATUS_MAP,
            {
                projectId: action.payload.projectId,
            },
        );
        yield put(
            actions.singleProject.fetchUnitStatusMapSuccess({
                unitStatusMap: response,
            }),
        );
    } catch (exception) {
        yield put(
            actions.singleProject.fetchUnitStatusMapFailure({
                unitStatusMap: {},
            }),
        );
    }
}

export function* fetchProductionProject(action: PayloadAction<any>) {
    // const loggedUserRole = localStorage.getItem("role");
    // const organization_id = localStorage.getItem("organization_id") ?? "";
    try {
        // @ts-ignore
        const response = yield graphQLClientFromUtil.query(
            "getProjectById",
            GET_PRODUCTION_PROJECT,
            {
                projectId: action.payload.project_id,
            },
        );

        const { getProjectById, getProjectBudgetStat, latestRenovationVersion } = response;

        yield put(
            actions.singleProject.fetchProjectDataSuccess({
                project: {
                    ...getProjectById,
                    budgetStats: getProjectBudgetStat,
                    latestRenovationVersion,
                },
            }),
        );
    } catch (exception) {
        yield put(
            actions.singleProject.fetchProjectDataFailure({
                project: {},
            }),
        );
    }
}

export function* fetchApprovalChangeOrders(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: { getApprovalChangeOrders } = yield graphQLClient.query(
            "getApprovalChangeOrders",
            GET_APPROVAL_CHANGE_ORDERS,
            {
                projectId: action.payload.project_id,
            },
        );
        yield put(
            actions.singleProject.fetchApprovalChangeOrderSuccess({
                budgetApprovalsAndChangeOrders: response,
            }),
        );
    } catch (exception) {
        yield put(
            actions.singleProject.fetchApprovalChangeOrderFailure({
                budgetApprovalsAndChangeOrders: {},
            }),
        );
    }
}

export function* fetchMonthlySpendAnalysis(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: { getSpendAnalysis } = yield graphQLClient.query(
            "getSpendAnalysis",
            GET_MONTHLY_SPEND_ANALYSIS,
            {
                projectId: action.payload.projectId,
                groupColumn: action.payload.groupColumn,
            },
        );
        yield put(
            actions.singleProject.fetchMonthlySpendAnalysisSuccess({
                spendAnalysisMonthByMonth: response,
                groupColumn: action.payload.groupColumn,
            }),
        );
    } catch (exception) {
        yield put(
            actions.singleProject.fetchMonthlySpendAnalysisFailure({
                spendAnalysisMonthByMonth: {},
            }),
        );
    }
}

export function* updateSingleProject(action: PayloadAction<any>) {
    const successMsg = action.payload.successMsg;
    const errorMsg = action.payload.errorMsg;

    try {
        const response: any[] = yield graphQLClient.mutate("updateProject", UPDATE_SINGLE_PROJECT, {
            project_id: action.payload.project_id,
            input: action.payload.input,
        });
        yield put(actions.singleProject.updateSingleProjectSuccess(response));
        yield put(
            actions.common.openSnack({
                message: successMsg || "Updated Project",
                variant: "success",
                open: true,
            }),
        );
        if (action.payload.goToNextPage) {
            yield put(actions.singleProject.incRenoWizardV2CurrentStep({}));
        }
    } catch (error) {
        TrackerUtil.error(
            error,
            {
                projectId: action.payload.project_id,
                projectName: action.payload.projectName,
                input: action.payload.input,
            },
            "SAVE_PROJECT_SETTINGS_FAILED",
        );

        yield put(
            actions.common.openSnack({
                message: errorMsg || "Failed to update project",
                variant: "error",
                open: true,
            }),
        );

        yield put(actions.singleProject.updateSingleProjectFailure({}));
        console.log(error);
    }
}

export function* createDesignDocuments(action: PayloadAction<any>) {
    try {
        const response: [
            {
                id: string;
                file_name: string;
                signed_url: string;
            },
        ] = yield graphQLClient.mutate("createProjectFiles", CREATE_PROJECT_FILES, {
            input: action?.payload.input,
        });

        if (response.length > 0) {
            // @ts-ignore
            const responseArr = yield Promise.allSettled(
                response.map(async (e) => {
                    let file = find(action.payload.files, { name: e.file_name });
                    const options = {
                        method: "PUT",
                        body: file,
                    };
                    const uploadResponse = await fetch(e.signed_url, options);
                    return Object.assign(uploadResponse, {
                        file_name: e.file_name,
                        file: e,
                    });
                }),
            );

            yield Promise.allSettled(
                response.map((e) => {
                    return graphQLClient.mutate("markFileUploaded", MARK_FILE_UPLOADED, {
                        file_id: e.id,
                    });
                }),
            );
            const res = responseArr.map((r: any) => {
                if (r.value?.status !== 200) {
                    return {
                        file_name: r?.value?.file_name,
                        file: r?.value?.file,
                        remote_file_reference: "",
                        loading: false,
                        error: true,
                        data: r?.value?.file_name,
                    };
                } else {
                    return {
                        file_name: r?.value?.file_name,
                        file: r?.value?.file,
                        loading: false,
                        error: "",
                        data: null,
                    };
                }
            });
            if (action?.payload?.isLeveledBid) {
                yield put(actions.singleProject.createLeveledBidDocumentsSuccess(res));
            } else if (action?.payload?.isExhAContract) {
                yield put(actions.singleProject.createExhAContractsSuccess(res));
            } else if (action?.payload?.isProjectScopeDocument) {
                yield put(actions.singleProject.createProjectScopeDocumentSuccess(res));
            } else {
                yield put(actions.singleProject.createDesignDocumentsSuccess(res));
            }
        }
    } catch (error) {
        if (action?.payload?.isExhAContract) {
            yield put(actions.singleProject.createExhAContractsFailure(""));
        } else {
            yield put(actions.singleProject.createDesignDocumentsFailure(""));
        }
        console.log(error);
    }
}

export function* getDesignDocuments(action: PayloadAction<any>) {
    try {
        const response: {
            getDesignDocuments: IFileDetails[];
        } = yield graphQLClient.query("getProjectFiles", GET_PROJECT_FILES, {
            project_id: action?.payload?.project_id,
            file_type: action?.payload?.file_type || "DESIGN_DOCUMENTS",
        });
        if (action?.payload?.file_type == "CONTRACTS") {
            yield put(
                actions.singleProject.getExhAContractsSuccess({
                    data: response,
                }),
            );
        } else if (action?.payload?.file_type == "PROJECT_SCOPE_DOCUMENT") {
            yield put(
                actions.singleProject.getProjectScopeDocumentSuccess({
                    data: response,
                }),
            );
        } else {
            yield put(
                actions.singleProject.getDesignDocumentsSuccess({
                    data: response,
                }),
            );
        }
    } catch (error) {
        console.log(error);
    }
}
export function* getLeveledBidDocuments(action: PayloadAction<any>) {
    try {
        const response: {
            getDesignDocuments: IFileDetails[];
        } = yield graphQLClient.query("getProjectFiles", GET_PROJECT_FILES, {
            project_id: action?.payload?.project_id,
            file_type: action?.payload?.file_type,
        });
        if (action?.payload?.file_type == "CONTRACTS") {
            yield put(
                actions.singleProject.getExhAContractsSuccess({
                    data: response,
                }),
            );
        } else {
            yield put(
                actions.singleProject.getLeveledBidDDocumentsSuccess({
                    data: response,
                }),
            );
        }
    } catch (error) {
        console.log(error);
        yield put(actions.singleProject.getLeveledBidDDocumentsFailure({}));
    }
}
export function* getKeyPeople(action: PayloadAction<any>) {
    try {
        const response: {
            user_list: {
                getContractorListForProject: any;
            };
        } = yield graphQLClient.query("getContractorListForProject", GET_KEY_PEOPLE, {
            projectId: action.payload?.projectId,
            rfpProjectVersion: action.payload?.rfpProjectVersion || "2.0",
            isDemandSide: action.payload?.isDemandSide,
        });

        yield put(
            actions.singleProject.fetchKeyPeopleSuccess({
                data: response?.user_list ?? [],
            }),
        );
    } catch (error) {
        yield put(actions.singleProject.fetchKeyPeopleFailure({}));
        console.log(error);
    }
}

export function* getRfpBidStatusDeatils(action: PayloadAction<any>) {
    try {
        const response: {
            organization_details: {
                getContractorListForProject: any;
            };
        } = yield graphQLClient.query("getContractorListForProject", GET_RFP_BID_STATUSES, {
            projectId: action.payload?.projectId,
            rfpProjectVersion: action.payload?.rfpProjectVersion || "2.0",
            isDemandSide: action.payload?.isDemandSide,
        });

        yield put(
            actions.singleProject.getRfpBidStatusSuccess({
                data: response?.organization_details ?? [],
            }),
        );
    } catch (error) {
        yield put(actions.singleProject.getRfpBidStatusFailure({}));
        console.log(error);
    }
}
//eslint-disable-next-line
export function* getPackages(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query("getPackages", GET_PACKAGES, {
            input: action.payload,
        });
        yield put(actions.singleProject.fetchPackagesSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* deleteDesignDocuments(action: PayloadAction<any>) {
    try {
        const response: boolean[] = yield Promise.allSettled(
            action?.payload?.files.map((file: any) => {
                return graphQLClient.mutate("deleteProjectFile", DELETE_PROJECT_FILES, {
                    input: {
                        file_id: file.id,
                        user_id: action.payload.user_id,
                    },
                });
            }),
        );
        yield put(
            actions.singleProject.DeleteDesignDocumentsSuccess({
                response: response,
                project_id: action?.payload?.project_id,
                file_type: action?.payload?.file_type,
            }),
        );
    } catch (error) {
        console.log(error);
    }
}

export function* refetchDesignDocuments(action: PayloadAction<any>) {
    if (action.payload?.file_type == "LEVELED_BID_DOCUMENTS") {
        yield put(
            actions.singleProject.getLeveledBidDocumentsStart({
                project_id: action.payload.project_id,
                file_type: action.payload?.file_type,
            }),
        );
    } else {
        yield put(
            actions.singleProject.getDesignDocumentsStart({
                project_id: action.payload.project_id,
                file_type: action.payload?.file_type,
            }),
        );
    }
}
export function downloadFile(url: any, fileName: any, fileId: string = "", projectName = "") {
    return fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);

            const anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.download = fileName;
            anchor.style.display = "none";
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);

            URL.revokeObjectURL(blobUrl);
        })
        .catch((error) => {
            TrackerUtil.error(
                error,
                {
                    fileId,
                    projectName,
                },
                "DOWNLOAD_FILE_FAILED",
            );
            console.error("Error downloading file:", error);
        });
}
export function* getFileDownloadLink(action: PayloadAction<any>) {
    try {
        const response: {
            file_name: string;
            download_link: string;
            getProjectFile: any;
        } = yield graphQLClient.query(
            "getProjectFile",
            GET_FILE_DOWNLOAD_LINK,
            action.payload?.input,
        );
        yield put(actions.singleProject.fileDownloadSuccess({}));
        downloadFile(response.download_link, response.file_name, action.payload?.input?.fileId);
    } catch (error) {
        yield put(actions.singleProject.fileDownloadFailure({}));
        console.log(error);
    }
}
export function* getQuestionResponses(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query("questionResponses", GET_QUESTION_RESPONSES, {
            questionResponseFilter: {
                project_id: action.payload.project_id,
                inventory_id: action.payload.inventory_id,
            },
        });
        yield put(actions.singleProject.fetchQuestionResponssesSuccess(response));
    } catch (error) {
        yield put(actions.singleProject.fetchQuestionResponssesFailure({}));
        console.log(error);
    }
}

export function* getQuestionsAndAnswers(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query(
            "renoQuestionsAndAnswers",
            GET_QUESTIONS_AND_ANSWERS,
            {
                organizationId: action.payload.organizationId,
                userId: action.payload.userId,
            },
        );
        yield put(actions.singleProject.fetchQuestionsAndAnswersSuccess(response));
    } catch (error) {
        yield put(actions.singleProject.fetchQuestionsAndAnswersFailure({}));
        console.log(error);
    }
}

export async function* assignQuestionResponse(action: PayloadAction<any>) {
    try {
        yield graphQLClient.query("assignQuestionResponse", CREATE_QUESTION_RESPONSE, {
            questionResponseInput: action.payload.data,
        });
    } catch (error) {
        yield put(actions.singleProject.assignQuestionResponseFailure({}));
        console.log(error);
    }
}

export function* fetchSpecsOptionsAvailable(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query("getMaterials", GET_SPECS_AVAILABLE, {
            input: action.payload.data,
        });
        yield put(
            actions.singleProject.fetchSpecsOptionsSuccess({
                response: response,
                item_id: action.payload.item_id,
            }),
        );
    } catch (error) {
        yield put(actions.singleProject.fetchSpecsOptionsFailure({}));
        console.log(error);
    }
}
export function* getInventoryList(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const res = yield graphQLClient.query("getInventoriesList", GET_INVENTORY_LIST, {
            projectId: action.payload,
        });
        yield put(actions.singleProject.fetchInventoryListSuccess(res));
    } catch (error) {
        yield put(actions.singleProject.fetchInventoryListSuccess([]));
    }
}
export function* fetchRenoParametersAvailable(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query("getRenoParametersList", GET_RENO_PARAMETERS, {
            organisationContainerId: action.payload.organisationContainerId,
        });
        yield put(
            actions.singleProject.fetchRenoParametersSuccess({
                response: response,
                item_id: action.payload.item_id,
            }),
        );
    } catch (error) {
        yield put(actions.singleProject.fetchRenoParametersFailure({}));
        console.log(error);
    }
}

export function* fetchRenoItems(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query("getRenoItems", GET_RENO_ITEMS, {
            renoFilters: {
                project_id: action.payload.projectId,
                inventory_id: action.payload.inventoryId,
                id: null,
            },
        });
        yield put(actions.singleProject.fetchRenoItemsSuccess(response));
    } catch (error) {
        console.log(error);
    }
}
