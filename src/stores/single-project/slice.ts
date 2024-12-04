import { updateObject } from "../../utils/store-helpers";
import initialState, { INITIAL_RENO_TIME_TABLE_COLUMNS } from "./single-project-init";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    cloneDeep,
    dropRight,
    filter,
    isEmpty,
    map,
    has,
    groupBy,
    mapValues,
    isEqual,
    sumBy,
} from "lodash";
import { ISingleProject, IFileDetails } from "./interfaces";
// import { ITPSM } from "../../stores/projects/tpsm/tpsm-models";
import { STEPS_NAME } from "modules/single-project/contants";
import {
    setRenoWizardV2CurrentStep,
    incRenoWizardV2CurrentStep,
    decRenoWizardV2CurrentStep,
    updateSingleProjectStatusStart,
    updateSingleProjectStatusSuccess,
    updateSingleProjectStatusFailure,
    contactTailorbird,
    getProjectsStart,
    getProjectsSuccess,
    getProjectsFailure,
    getBasePackageStart,
    getBasePackageSuccess,
    getBasePackageFailure,
    getPackageContentStart,
    getPackageContentSuccess,
    getPackageContentFailure,
    createRenoItemsFromExistingProjectStart,
    createRenoItemsFromExistingProjectSuccess,
    createRenoItemsFromExistingProjectFailure,
    getProjectContainerStart,
    getProjectContainerSuccess,
    getProjectContainerFailure,
    getProjectCodicesStart,
    getProjectCodicesSuccess,
    getProjectCodicesFailure,
    getRenovationItemsStart,
    getRenovationItemsSuccess,
    getRenovationItemsFailure,
    refreshRenovationItems,
    addRenovationItemsStart,
    addRenovationItemsSuccess,
    addRenovationItemsFailure,
    updateRenovationItemsStart,
    updateRenovationItemsSuccess,
    updateRenovationItemsFailure,
    addMaterialSpecStart,
    addMaterialSpecSuccess,
    addMaterialSpecFailure,
    getProjectScopeDocumentStart,
    getProjectScopeDocumentSuccess,
    getProjectScopeDocumentFailure,
    createProjectScopeDocumentStart,
    createProjectScopeDocumentSuccess,
    createProjectScopeDocumentFailure,
    updateRenovationItemsLocally,
    markRenoWizardAsSubmitted,
} from "./renovation-wizard-v2/slice";

const initState: any = cloneDeep(initialState);

/* eslint-disable no-unused-vars */
function fetchProjectDataStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchProjectDataSuccess(state: ISingleProject, action: PayloadAction<any>) {
    const organizationName = action.payload.project.organization.name;
    const organizationId = action.payload.project.organization.id;
    return updateObject(state, {
        loading: false,
        projectDetails: updateObject(state.projectDetails, {
            ...action.payload.project,
            owner: organizationName,
            organization_id: organizationId,
        }),
    });
}

function fetchProjectDataFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchProductionProjectStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchApprovalChangeOrderStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchApprovalChangeOrderSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        projectAnalytics: updateObject(state.projectAnalytics, {
            spendAnalysis: updateObject(state.projectAnalytics.spendAnalysis, {
                budgetApprovalsAndChangeOrders: action.payload.budgetApprovalsAndChangeOrders,
            }),
        }),
    });
}

function fetchApprovalChangeOrderFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchMonthlySpendAnalysisStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchMonthlySpendAnalysisSuccess(state: ISingleProject, action: PayloadAction<any>) {
    const groupColumn = action.payload.groupColumn;
    const updatedMonthlySpendAnalysis = updateObject(
        state.projectAnalytics.spendAnalysis.spendAnalysisMonthByMonth,
        {
            [groupColumn === "work_type" ? "workType" : "category"]:
                action.payload.spendAnalysisMonthByMonth,
        },
    );

    return updateObject(state, {
        loading: false,
        projectAnalytics: updateObject(state.projectAnalytics, {
            spendAnalysis: updateObject(state.projectAnalytics.spendAnalysis, {
                spendAnalysisMonthByMonth: updatedMonthlySpendAnalysis,
            }),
        }),
    });
}

function fetchMonthlySpendAnalysisFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchProjectBudgetStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchProjectBudgetSuccess(state: ISingleProject, action: PayloadAction<any>) {
    const budgetStats = action.payload.budgetStats;
    return updateObject(state, {
        loading: false,
        projectAnalytics: updateObject(state.projectAnalytics, {
            spendAnalysis: updateObject(state.projectAnalytics.spendAnalysis, {
                estimatedBudget: budgetStats.budget,
                actualSpend: budgetStats.spend,
            }),
        }),
    });
}

function fetchProjectBudgetFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchRenoTimeByUnitStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchRenoTimeByUnitSuccess(state: ISingleProject, action: PayloadAction<any>) {
    const { renoTimeByUnit, columns } = action.payload;

    let updatedAvgRenoTimePerUnit;
    if (isEqual(INITIAL_RENO_TIME_TABLE_COLUMNS, columns)) {
        updatedAvgRenoTimePerUnit = isEmpty(renoTimeByUnit)
            ? undefined
            : sumBy(renoTimeByUnit, "avg_renovation_time") / renoTimeByUnit.length;
    } else {
        updatedAvgRenoTimePerUnit =
            state.projectAnalytics.renovationTime.renoTimeByUnit.avgRenoTimePerUnit;
    }

    return updateObject(state, {
        loading: false,
        projectAnalytics: updateObject(state.projectAnalytics, {
            renovationTime: updateObject(state.projectAnalytics.renovationTime, {
                renoTimeByUnit: {
                    data: renoTimeByUnit,
                    columns,
                    avgRenoTimePerUnit: updatedAvgRenoTimePerUnit,
                },
            }),
        }),
    });
}

function fetchRenoTimeByUnitFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchMonthlyTurnedUnitsStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchMonthlyTurnedUnitsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    const monthByMonthUnitsTurned = action.payload.monthByMonthUnitsTurned;
    return updateObject(state, {
        loading: false,
        projectAnalytics: updateObject(state.projectAnalytics, {
            renovationTime: updateObject(state.projectAnalytics.renovationTime, {
                monthByMonthUnitsTurned,
            }),
        }),
    });
}

function fetchMonthlyTurnedUnitsFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchRenovationProgressStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchRenovationProgressSuccess(state: ISingleProject, action: PayloadAction<any>) {
    const renovationProgress = action.payload.renovationProgress;
    return updateObject(state, {
        loading: false,
        projectAnalytics: updateObject(state.projectAnalytics, {
            renovationProgress: updateObject(state.projectAnalytics.renovationProgress, {
                details: renovationProgress,
            }),
        }),
    });
}

function fetchRenovationProgressFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchUnitStatusMapStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchUnitStatusMapSuccess(state: ISingleProject, action: PayloadAction<any>) {
    const unitStatusMap = action.payload.unitStatusMap ?? {};
    return updateObject(state, {
        loading: false,
        projectAnalytics: updateObject(state.projectAnalytics, {
            renovationProgress: updateObject(state.projectAnalytics.renovationProgress, {
                totalUnitsInprop: unitStatusMap.total_units,
                totalRenoUnits: unitStatusMap.reno_units,
                completed: unitStatusMap.status_map.completed || 0,
                inprogress:
                    (unitStatusMap.status_map.in_progress || 0) +
                    (unitStatusMap.status_map.pending_approval || 0),
                notStarted:
                    (unitStatusMap.status_map.not_started || 0) +
                    (unitStatusMap.status_map.unscheduled || 0) +
                    (unitStatusMap.status_map.scheduled || 0),
            }),
        }),
    });
}

function fetchUnitStatusMapFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function updateSingleProjectStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, { updating: true });
}

function updateSingleProjectSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        projectDetails: updateObject(state.projectDetails, {
            ...action.payload,
        }),
        updating: false,
    });
}

function updateSingleProjectFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        updating: false,
    });
}

function createDesignDocumentsStart(state: ISingleProject, action: PayloadAction<any>) {
    let files = action?.payload?.input?.files?.map((file: IFileDetails) => {
        return {
            file_name: file?.file_name,
            loading: true,
            error: "",
        };
    });
    return updateObject(state, {
        loading: action?.payload?.isExhAContract ? false : true,
        RFP: updateObject(state.RFP, {
            contracts: updateObject(state.RFP.contracts, {
                loading: action?.payload?.isExhAContract ? true : false,
            }),
        }),
        fileDetails: state?.renovationWizard.uploadDetails,
        uploadDetails: files,
    });
}

function createDesignDocumentsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    const existingFiles = cloneDeep(state?.renovationWizard.uploadDetails);
    const designFiles = action?.payload?.map((details: any) => {
        return details?.file;
    });

    return updateObject(state, {
        loading: false,
        renovationWizard: updateObject(state.renovationWizard, {
            uploadDetails: [...existingFiles, ...designFiles],
        }),
    });
}
function createLeveledBidDocumentsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    const existingFiles = cloneDeep(state?.RFP.leveledBidSheets);
    const leveledBidFiles = action?.payload?.map((details: any) => {
        return details?.file;
    });

    return updateObject(state, {
        loading: false,
        RFP: {
            ...state.RFP,
            leveledBidSheets: [...existingFiles, ...leveledBidFiles],
        },
    });
}

function createDesignDocumentsFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function getDesignDocumentsStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: action?.payload?.file_type == "CONTRACTS" ? false : true,
        RFP: updateObject(state.RFP, {
            contracts: updateObject(state.RFP.contracts, {
                loading: action?.payload?.file_type == "CONTRACTS" ? true : false,
            }),
        }),
    });
}

function getDesignDocumentsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        renovationWizard: updateObject(state.renovationWizard, {
            uploadDetails: action.payload.data,
        }),
    });
}
function getLeveledBidDDocumentsFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function getLeveledBidDocumentsStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function getLeveledBidDDocumentsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        RFP: {
            ...state.RFP,
            leveledBidSheets: action.payload.data,
        },
    });
}

function fetchKeyPeopleStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchKeyPeopleFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchKeyPeopleSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        keyPeople: action.payload.data,
    });
}
function getRfpBidStatusDeatilsStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function getRfpBidStatusFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function getRfpBidStatusSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        RFP: {
            ...state.RFP,
            bidStatistics: action.payload.data,
        },
    });
}

function DeleteDesignDocumentsStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: action?.payload?.file_type == "CONTRACTS" ? false : true,
        RFP: updateObject(state.RFP, {
            contracts: updateObject(state.RFP.contracts, {
                loading: action?.payload?.file_type == "CONTRACTS" ? true : false,
            }),
        }),
    });
}

function DeleteDesignDocumentsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: action?.payload?.file_type == "CONTRACTS" ? state.loading : false,
        RFP: updateObject(state.RFP, {
            contracts: updateObject(state.RFP.contracts, {
                loading:
                    action?.payload?.file_type == "CONTRACTS" ? false : state.RFP.contracts.loading,
            }),
        }),
    });
}

function getFileDownloadStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}
function fileDownloadFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fileDownloadSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchPackagesStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            packageList: updateObject(state.renovationWizard.packageList, { loading: true }),
        }),
    });
}

function fetchPackagesSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            packageList: updateObject(state.renovationWizard.packageList, {
                data: action.payload,
                loading: false,
            }),
        }),
    });
}

function changeStep(state: ISingleProject, action: PayloadAction<any>) {
    const stepName = action.payload;
    const breadcrumData = cloneDeep(state.renovationWizard.breadCrumbTopLevel.data);
    if (stepName !== "welcome" && stepName !== "scope_summary") {
        for (let i = 0; i < breadcrumData.length; i++) {
            if (breadcrumData[i].stepName == stepName) {
                breadcrumData[i].isCurrent = true;
                breadcrumData[i].isDone = false;
                break;
            } else {
                breadcrumData[i].isCurrent = false;
                breadcrumData[i].isDone = true;
            }
        }
    }
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            navigation: updateObject(state.renovationWizard.navigation, {
                currentStep: action.payload,
                steps: [...state.renovationWizard.navigation.steps, action.payload],
            }),
            breadCrumbTopLevel: updateObject(state.renovationWizard.breadCrumbTopLevel, {
                data: breadcrumData,
            }),
        }),
    });
}
function getLastNextQuestionId(data: any) {
    if (data.answers && data.answers.length > 0) {
        const lastAnswer = data.answers[data.answers.length - 1];
        const nextQuestionId = lastAnswer.next_question_id;
        return nextQuestionId !== null ? nextQuestionId : null;
    } else {
        return null; // Return null if there are no answers
    }
}
function getQuestionById(data: any[], questionId: any, categoryId: any) {
    for (const elememt of data) {
        const elementCopy = JSON.parse(JSON.stringify(elememt));
        if (elementCopy.questions) {
            for (const question of elementCopy.questions) {
                if (question.id == questionId && elementCopy.category_id == categoryId) {
                    return question;
                }
            }
        }
    }
    return null; // Return null if the question is not found
}
function getLowestRoundedValue(value: number): number {
    const roundedValue = Math.round(value); // Round the value to the nearest integer
    const floorValue = Math.floor(value); // Round down the value to the nearest integer
    const ceilValue = Math.ceil(value); // Round up the value to the nearest integer

    if (roundedValue <= floorValue + 0.5) {
        return roundedValue; // Return the rounded value if it is less than or equal to the floor value + 0.5
    } else {
        return floorValue; // Otherwise, return the floor value
    }
}
function nextQuestionSelection(state: ISingleProject, action: PayloadAction<any>) {
    const questionAnswerDataCopy = JSON.parse(
        JSON.stringify(state.renovationWizard.questionAnswerData.data),
    );
    const currentCategoryId = state.renovationWizard.questionAnswerData.currentCategoryId;
    const presentQuestionId = state.renovationWizard.questionAnswerData.currentQuestionId;

    const catIndex = questionAnswerDataCopy.findIndex(
        (item: any) => item.category_id === currentCategoryId,
    );

    const currentQuestion = questionAnswerDataCopy[catIndex]?.questions.find(
        (item: any) => item.id === presentQuestionId,
    );

    const currentQuestionIndex = questionAnswerDataCopy[catIndex].questions.findIndex(
        (item: any) => item.id === presentQuestionId,
    );

    let updatedCategoryId = currentCategoryId;
    const maxQtnQueueNum = Math.max(
        ...questionAnswerDataCopy[catIndex].questions.map((item: any) => item.qtnQueueNum),
    );

    let isNextCatExists = true;
    let currentQuestionId = presentQuestionId;

    let newQtnQueueNum = currentQuestion.isSubcategoryQuestion
        ? Number((currentQuestion.qtnQueueNum + 1).toFixed(1))
        : Number((currentQuestion.qtnQueueNum + 0.1).toFixed(1));

    if (
        !currentQuestion.isSubcategoryQuestion &&
        !questionAnswerDataCopy[catIndex].questions.some(
            (item: any) => item.qtnQueueNum === newQtnQueueNum,
        ) &&
        questionAnswerDataCopy[catIndex].questions.some(
            (item: any) =>
                item.qtnQueueNum ===
                Number((getLowestRoundedValue(currentQuestion.qtnQueueNum) + 1).toFixed(1)),
        )
    ) {
        newQtnQueueNum = Number(
            (getLowestRoundedValue(currentQuestion.qtnQueueNum) + 1).toFixed(1),
        );
    }

    // maxQtnQueueNum == 0 ||
    if (maxQtnQueueNum == 0 && action.payload.isRightAfterRoomSelection) {
        questionAnswerDataCopy[catIndex].questions = questionAnswerDataCopy[catIndex].questions.map(
            (copyItem: any) => {
                if (copyItem.qtnQueueNum === maxQtnQueueNum) {
                    return {
                        ...copyItem,
                        isCurrentQuestion: true,
                    };
                } else {
                    return {
                        ...copyItem,
                        isCurrentQuestion: false,
                    };
                }
            },
        );
    } else if (maxQtnQueueNum > 0 && newQtnQueueNum <= maxQtnQueueNum) {
        questionAnswerDataCopy[catIndex].questions = questionAnswerDataCopy[catIndex].questions.map(
            (copyItem: any) => {
                if (copyItem.qtnQueueNum === newQtnQueueNum) {
                    currentQuestionId = copyItem.id;
                    return {
                        ...copyItem,
                        isCurrentQuestion: true,
                    };
                } else {
                    return {
                        ...copyItem,
                        isCurrentQuestion: false,
                    };
                }
            },
        );
    } else {
        const nextcatIndex = catIndex + 1;
        isNextCatExists = questionAnswerDataCopy.length > nextcatIndex;

        if (isNextCatExists) {
            questionAnswerDataCopy[catIndex]["isDone"] = true;
            questionAnswerDataCopy[nextcatIndex].questions = questionAnswerDataCopy[
                nextcatIndex
            ].questions.map((copyItem: any, index: number) => {
                if (index === 0) {
                    updatedCategoryId = copyItem.category_id;
                    currentQuestionId = copyItem.id;
                    return {
                        ...copyItem,
                        isCurrentQuestion: true,
                        qtnQueueNum: 0,
                    };
                } else {
                    return {
                        ...copyItem,
                        isCurrentQuestion: copyItem.isSelected ? true : false,
                    };
                }
            });
        }
    }

    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                data: questionAnswerDataCopy,
                currentQuestionId: currentQuestionId,
                currentCategoryId: updatedCategoryId,
                isReachedLastQuestionOnSurvey: !isNextCatExists,
                isPreviousQuestionExists: true,
            }),
        }),
    });
}

function prevQuestionSelection(state: ISingleProject, action: PayloadAction<any>) {
    const questionAnswerDataCopy = JSON.parse(
        JSON.stringify(state.renovationWizard.questionAnswerData.data),
    );
    const currentCategoryId = state.renovationWizard.questionAnswerData.currentCategoryId;
    const presentQuestionId = state.renovationWizard.questionAnswerData.currentQuestionId;
    const catIndex = questionAnswerDataCopy.findIndex(
        (item: any) => item.category_id === currentCategoryId,
    );
    const currentQuestion = questionAnswerDataCopy[catIndex].questions.find(
        (item: any) => item.id === presentQuestionId,
    );

    const currentQuestionIndex = questionAnswerDataCopy[catIndex]?.questions.findIndex(
        (item: any) => item.id === presentQuestionId,
    );

    let updatedCategoryId = currentCategoryId;
    const minQtnQueueNum = Math.min(
        ...questionAnswerDataCopy[catIndex].questions.map((item: any) => item.qtnQueueNum),
    );

    let isPreviousCatExists = true;
    let currentQuestionId = presentQuestionId;
    let newQtnQueueNum = currentQuestion.isSubcategoryQuestion
        ? Number((currentQuestion.qtnQueueNum - 1).toFixed(1))
        : Number((currentQuestion.qtnQueueNum - 0.1).toFixed(1));

    if (
        !currentQuestion.isSubcategoryQuestion &&
        !questionAnswerDataCopy[catIndex].questions.some(
            (item: any) => item.qtnQueueNum === newQtnQueueNum,
        ) &&
        questionAnswerDataCopy[catIndex].questions.some(
            (item: any) =>
                item.qtnQueueNum ===
                Number((getHighestRoundedValue(currentQuestion.qtnQueueNum) - 1).toFixed(1)),
        )
    ) {
        newQtnQueueNum = Number(
            (getHighestRoundedValue(currentQuestion.qtnQueueNum) - 1).toFixed(1),
        );
    }

    if (minQtnQueueNum >= 0 && newQtnQueueNum >= minQtnQueueNum) {
        questionAnswerDataCopy[catIndex].questions = questionAnswerDataCopy[catIndex].questions.map(
            (copyItem: any) => {
                if (copyItem.qtnQueueNum === newQtnQueueNum) {
                    currentQuestionId = copyItem.id;
                    return {
                        ...copyItem,
                        isCurrentQuestion: true,
                    };
                } else {
                    return {
                        ...copyItem,
                        isCurrentQuestion: false,
                    };
                }
            },
        );
    } else {
        const previousCatIndex = catIndex - 1;
        isPreviousCatExists = previousCatIndex >= 0;
        if (isPreviousCatExists) {
            const previousCategoryQuestions = questionAnswerDataCopy[previousCatIndex].questions;
            const lastIndex = previousCategoryQuestions.length - 1;

            questionAnswerDataCopy[previousCatIndex].questions = previousCategoryQuestions.map(
                (copyItem: any, index: number) => {
                    if (index === lastIndex) {
                        updatedCategoryId = copyItem.category_id;
                        currentQuestionId = copyItem.id;
                        return {
                            ...copyItem,
                            isCurrentQuestion: true,
                            qtnQueueNum: lastIndex,
                        };
                    } else {
                        return {
                            ...copyItem,
                            isCurrentQuestion: copyItem.isSelected ? true : false,
                        };
                    }
                },
            );
        }
    }

    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            navigation: isPreviousCatExists
                ? state.renovationWizard.navigation
                : updateObject(state.renovationWizard.navigation, {
                      currentStep: STEPS_NAME.ROOMS,
                  }),
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                data: questionAnswerDataCopy,
                currentQuestionId: currentQuestionId,
                currentCategoryId: updatedCategoryId,
                isReachedLastQuestionOnSurvey: false,
                isNextQuestionExists: true, // Assuming there's always a next question
            }),
        }),
    });
}

// Helper function to get the highest rounded value (e.g., 1.2 => 2)
function getHighestRoundedValue(value: number) {
    return Math.ceil(value);
}

function previousStep(state: ISingleProject, action: PayloadAction<any>) {
    const steps = dropRight(state.renovationWizard.navigation.steps);
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            navigation: updateObject(state.renovationWizard.navigation, {
                currentStep: steps[steps.length - 1],
                steps: steps,
            }),
        }),
    });
}
function fetchQuestionsAndAnswersStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            rooms: updateObject(state.renovationWizard.rooms, {
                loading: true,
            }),
        }),
    });
}

function fetchQuestionsAndAnswersSuccess(state: ISingleProject, action: PayloadAction<any>) {
    let roomsData = action.payload.find((question: any) => question.name?.toLowerCase() == "rooms");
    let breadcrumsData = cloneDeep(state.renovationWizard.breadcrumsData);
    map(action.payload, (category) => {
        const questionsByRoom = filter(
            category.questions,
            (questions: any) => questions.room_name && questions.category_id && !questions.item_id,
        );
        breadcrumsData.push({
            name: category?.name,
            status: "pending",
            icon: category?.name?.toLowerCase(),
            categoryId: category.category_id,
            subset: map(questionsByRoom, (item) => ({
                room_name: item.room_name,
                questionId: item.id,
                answers: map(item.answers, (answer) => ({ name: answer.answer_description })),
            })),
        });
    });
    roomsData = {
        ...roomsData,
        loading: false,
        id: (roomsData?.questions && roomsData?.questions[0]?.id) || null,
        room_name: (roomsData?.questions && roomsData?.questions[0]?.room_name) || null,
        data: roomsData?.questions[0].answers?.map((room: any) => {
            return {
                ...room,
                buttonContent: room?.answer_description,
                isSelected: false,
                isExclusive: room.answer_description.includes("All"),
            };
        }),
    };

    let questionAnswerData = action.payload
        .filter((question: any) => question.name?.toLowerCase() !== "rooms")
        .map((detail: any, idx: number) => {
            let isSubcategoryQuestionUpdated = false;
            return {
                ...detail,
                order: idx + 1,
                questions: detail?.questions?.map((question: any, index: number) => {
                    const isSubcategoryQuestion =
                        question.item_name == null &&
                        question.room_name == null &&
                        question.item_id == null;

                    const updatedCopy = {
                        ...question,
                        order: index + 1,
                        buttonContent: question.question_description,
                        isSubcategoryQuestion: isSubcategoryQuestion,
                        isCurrentQuestion:
                            isSubcategoryQuestion && isSubcategoryQuestionUpdated == false,

                        qtnQueueNum:
                            isSubcategoryQuestion && isSubcategoryQuestionUpdated == false
                                ? Number(0.0)
                                : null,

                        prevQtnQueueNum: null,
                        category_name: detail.name,
                        answers: question.answers.map((answer: any) => {
                            return {
                                ...answer,
                                isToSkipQuestion: answer.answer_description
                                    ?.toLowerCase()
                                    .replace(/\s/g, "")
                                    .includes("iamnot"),
                                buttonContent: answer.answer_description,
                                isSelected: false,
                            };
                        }),
                    };
                    if (isSubcategoryQuestion) {
                        isSubcategoryQuestionUpdated = true;
                    }
                    return updatedCopy;
                }),
            };
        });

    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            isInitial: false,
            rooms: roomsData,
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                data: questionAnswerData,
                originalResponse: questionAnswerData,
            }),
            breadcrumsData: breadcrumsData,
        }),
    });
}
function fetchQuestionsAndAnswersFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            rooms: { loading: false, data: [] },
            questionAnswerData: {
                currentCategoryId: null,
                currentQuestionId: null,
                data: [],
                originalResponse: [],
                specOptions: { loading: false, data: {} },
            },
        }),
    });
}

function updateCurrentCategoryId(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                currentCategoryId: action.payload.currentCategoryId,
            }),
        }),
    });
}
function updateCurrentQuestionId(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                currentQuestionId: action.payload.currentQuestionId,
            }),
        }),
    });
}

function updateQuestionAnswerDataAfterSelectionChange(
    state: ISingleProject,
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                data: action.payload.data,
            }),
        }),
    });
}

function fetchQuestionResponssesStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionResponses: updateObject(state.renovationWizard.questionResponses, {
                loading: true,
            }),
        }),
    });
}
function fetchQuestionResponssesSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionResponses: {
                loading: false,
                data: action.payload,
            },
        }),
    });
}
function fetchQuestionResponssesFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionResponses: {
                loading: false,
            },
        }),
    });
}

function resetRenowizardStore(state: ISingleProject, action: PayloadAction<any>) {
    const inventoryData = cloneDeep(state.renovationWizard.inventoryList.data);
    return updateObject(state, {
        projectDetails: updateObject(state.projectDetails, {
            package_id: "",
        }),
        renovationWizard: updateObject(state.renovationWizard, {
            uploadDetails: [],
            currentInventory: {},
            navigation: {
                ...state.renovationWizard.navigation,
                currentStep: STEPS_NAME.WELCOME,
                steps: [STEPS_NAME.WELCOME],
            },
            rooms: {
                loading: false,
                data: state.renovationWizard.isInitial ? [] : state.renovationWizard.rooms.data,
            },
            questionAnswerData: {
                currentCategoryId: null,
                currentQuestionId: null,
                data: state.renovationWizard.isInitial
                    ? []
                    : state.renovationWizard.questionAnswerData.data,
                originalResponse: state.renovationWizard.isInitial
                    ? []
                    : state.renovationWizard.questionAnswerData.originalResponse,
                isReachedLastQuestionOnSurvey: false,
                skippedCategorys: [],
                specOptions: { data: {}, loading: false },
                specParameters: { loading: false, data: {} },
            },
            questionResponses: { loadind: false, data: [] },
            breadcrumsData: [
                { name: "Program Details", status: "pending", icon: "new program", subset: null },
                { name: "Select Package", status: "pending", icon: "package", subset: null },
                { name: "Select Rooms", status: "pending", icon: "rooms", subset: null },
            ],
            breadCrumbTopLevel: {
                data: [
                    {
                        name: "Program Details",
                        icon: "new program",
                        stepName: "inventory",
                        categoryId: null,
                        isCurrent: true,
                        isDone: false,
                        id: "program_details",
                    },
                    {
                        name: "Select Package",
                        icon: "package",
                        stepName: "package",
                        categoryId: null,
                        isCurrent: false,
                        isDone: false,
                        id: "select_package",
                    },
                    {
                        name: "Select Rooms",
                        icon: "rooms",
                        stepName: "rooms",
                        categoryId: null,
                        isCurrent: false,
                        isDone: false,
                        id: "select_rooms",
                    },
                ],
            },
        }),
    });
}
function updateRoomSelectionOnStore(state: ISingleProject, action: PayloadAction<any>) {
    let roomNames = action.payload.data
        ?.filter((roomInfo: any) => roomInfo.isSelected)
        ?.map((room: any) => room.answer_description?.replace(/\s/g, "")?.toLowerCase());
    let isAlloFtheRoomsSelectedIndex = action.payload.data
        ?.filter((roomInfo: any) => roomInfo.isSelected)
        .findIndex((roomInfo: any) => roomInfo.isExclusive);
    const isAlloFtheRoomsSelected = isAlloFtheRoomsSelectedIndex >= 0;

    let filteredData = state.renovationWizard.questionAnswerData.originalResponse;
    if (isAlloFtheRoomsSelected == false) {
        filteredData = filteredData.map((itemCopy) => {
            let item = JSON.parse(JSON.stringify(itemCopy));
            item.questions = item.questions?.filter(
                (question: any) =>
                    roomNames.includes(question.room_name?.replace(/\s/g, "")?.toLowerCase()) ||
                    question.room_name == null,
            );
            return item;
        });
        filteredData = filteredData.filter((item: any) => item.questions?.length > 1);
    }

    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                data: filteredData,
            }),
            rooms: updateObject(state.renovationWizard.rooms, { data: action.payload.data }),
        }),
    });
}

function updateSkippedCategorys(state: ISingleProject, action: PayloadAction<any>) {
    let currentData = JSON.parse(
        JSON.stringify(state.renovationWizard.questionAnswerData.skippedCategorys),
    );

    if (action.payload.isSelected) {
        // If the item is not already in the array, add it
        if (!currentData.some((item: any) => item.id === action.payload.data.id)) {
            currentData.push(action.payload.data);
        }
    } else {
        // If the item is in the array, remove it
        currentData = currentData.filter((item: any) => item.id !== action.payload.data.id);
    }

    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                skippedCategorys: currentData || [],
            }),
        }),
    });
}
function assignQuestionResponseStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                savingChanges: true,
            }),
        }),
    });
}
function assignQuestionResponseFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                savingChanges: false,
            }),
        }),
    });
}
function savingSelectionsData(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                savingChanges: action.payload.data,
            }),
        }),
    });
}

function fetchSpecsOptionsStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                specOptions: { loading: true },
            }),
        }),
    });
}
function fetchInventoryListStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            inventoryList: updateObject(state.renovationWizard.inventoryList, { loading: true }),
        }),
    });
}

function fetchInventoryListSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            inventoryList: updateObject(state.renovationWizard.inventoryList, {
                loading: false,
                data: map(action.payload, (inventory) => ({
                    ...inventory,
                    isEdit: { name: false, description: false },
                })),
            }),
        }),
    });
}

function fetchSpecsOptionsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                specOptions: {
                    loading: false,
                    data: {
                        ...state.renovationWizard.questionAnswerData.specOptions.data,
                        [action.payload.item_id]: action.payload.response,
                    },
                },
            }),
        }),
    });
}
function fetchSpecsOptionsFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                specOptions: { loading: false },
            }),
        }),
    });
}
function updateInventoryDetail(state: ISingleProject, action: PayloadAction<any>) {
    const { key, index } = action.payload;
    let inventoryRow = cloneDeep(state.renovationWizard.inventoryList.data[index]);
    inventoryRow.isEdit = updateObject(inventoryRow.isEdit, {
        [key]: has(action.payload, "value") ? inventoryRow.isEdit[key] : !inventoryRow.isEdit[key],
    });
    if (has(action.payload, "value")) {
        inventoryRow = { ...inventoryRow, [key]: action.payload?.value };
    }

    state.renovationWizard.inventoryList.data.splice(index, 1, inventoryRow);
    return state;
}

function deleteInventory(state: ISingleProject, action: PayloadAction<any>) {
    const list = filter(
        state.renovationWizard.inventoryList.data,
        (inventory) => inventory.id !== action.payload,
    );
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            inventoryList: updateObject(state.renovationWizard.inventoryList, {
                data: list,
            }),
        }),
    });
}
function backToWelcomePage(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                isReachedLastQuestionOnSurvey: false,
            }),
            navigation: updateObject(state.renovationWizard.navigation, {
                currentStep: "welcome",
            }),
        }),
    });
}
function stayInQuestionerePage(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                isReachedLastQuestionOnSurvey: false,
            }),
        }),
    });
}

function fetchRenoParametersStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                specParameters: { loading: true, data: {} },
            }),
        }),
    });
}

function fetchRenoParametersSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                specParameters: {
                    loading: false,
                    data: {
                        ...state.renovationWizard.questionAnswerData.specParameters.data,
                        [action.payload.item_id]: action.payload.response,
                    },
                },
            }),
        }),
    });
}
function updateRenoParameter(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                specParameters: {
                    loading: false,
                    data: {
                        ...state.renovationWizard.questionAnswerData.specParameters.data,
                        [action.payload.itemId]: action.payload.data,
                    },
                },
            }),
        }),
    });
}
function fetchRenoParametersFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                specParameters: { loading: false, data: [] },
            }),
        }),
    });
}
function updateQuestionCompletionStatus(state: ISingleProject, action: PayloadAction<any>) {
    const questionAnswerDataCopy = JSON.parse(
        JSON.stringify(state.renovationWizard.questionAnswerData.data),
    );
    const currentCategoryId = state.renovationWizard.questionAnswerData.currentCategoryId;
    const presentQuestionId = state.renovationWizard.questionAnswerData.currentQuestionId;

    const catIndex = questionAnswerDataCopy.findIndex(
        (item: any) => item.category_id === currentCategoryId,
    );

    questionAnswerDataCopy[catIndex].questions = questionAnswerDataCopy[catIndex]?.questions.map(
        (qtn: any) => {
            if (
                qtn.item_id == null &&
                qtn.room_name != null &&
                qtn.isSubcategoryQuestion == false
            ) {
                const answers = JSON.parse(JSON.stringify(qtn?.answers));

                const answerIndex = answers?.findIndex(
                    (answer: any) => answer.next_question_id === presentQuestionId,
                );
                if (answerIndex !== -1) {
                    answers[answerIndex].isDone = true;
                }
                qtn.answers = answers;
            }
            return qtn;
        },
    );

    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                data: questionAnswerDataCopy,
            }),
        }),
    });
}

function fetchRenoItemsStart(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            renoItemList: updateObject(state.renovationWizard.renoItemList, { loading: true }),
        }),
    });
}
function fetchRenoItemsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    const renoList = map(action.payload, (renoItem) => {
        return renoItem.scope_type == "Base"
            ? renoItem
            : { ...renoItem, item: `${renoItem.item} - alt` };
    });
    const renoListByCategory = groupBy(renoList, "category");
    const renoListBySubCategoryRoom = mapValues(renoListByCategory, (item: any) => {
        return mapValues(groupBy(item, "room"), (data) => groupBy(data, "item"));
    });
    console.log(renoListBySubCategoryRoom);
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            renoItemList: updateObject(state.renovationWizard.renoItemList, {
                data: renoListBySubCategoryRoom,
                loading: false,
            }),
        }),
    });
}

function updateRenoItemsToCurrentQuestionData(state: ISingleProject, action: PayloadAction<any>) {
    const questionAnswerDataCopy = JSON.parse(
        JSON.stringify(state.renovationWizard.questionAnswerData.data),
    );
    const currentCategoryId = state.renovationWizard.questionAnswerData.currentCategoryId;
    const currentQuestionId = state.renovationWizard.questionAnswerData.currentQuestionId;

    const catIndex = questionAnswerDataCopy.findIndex(
        (item: any) => item.category_id === currentCategoryId,
    );
    const currentQuestionIndex = questionAnswerDataCopy[catIndex]?.questions.findIndex(
        (item: any) => item.id === currentQuestionId,
    );
    questionAnswerDataCopy[catIndex].questions[currentQuestionIndex].renoItems =
        action.payload.data;

    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            questionAnswerData: updateObject(state.renovationWizard.questionAnswerData, {
                data: questionAnswerDataCopy,
            }),
        }),
    });
}

function updateCurrentInventory(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, {
            currentInventory: updateObject(state.renovationWizard.currentInventory, action.payload),
        }),
    });
}

function updateRenoIsInitial(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        renovationWizard: updateObject(state.renovationWizard, { isInitial: action.payload }),
    });
}

function createExhAContractsStart(state: ISingleProject, action: PayloadAction<any>) {
    let files = action?.payload?.input?.files?.map((file: IFileDetails) => {
        return {
            file_name: file?.file_name,
            loading: true,
            error: "",
        };
    });
    return updateObject(state, {
        // fileDetails: state?.RFP.contracts,
        RFP: {
            ...state.RFP,
            contracts: updateObject(state.RFP.contracts, { loading: true }),
        },
        uploadDetails: files,
    });
}

function createExhAContractsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    const existingFiles = cloneDeep(state?.RFP.contracts.data);
    const newContracts = action?.payload?.map((details: any) => {
        return details?.file;
    });

    return updateObject(state, {
        RFP: {
            ...state.RFP,
            contracts: { loading: false, data: [...existingFiles, ...newContracts] },
        },
    });
}

function createExhAContractsFailure(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        RFP: {
            ...state.RFP,
            contracts: { loading: false, data: [] },
        },
    });
}
function getExhAContractsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    return updateObject(state, {
        RFP: {
            ...state.RFP,
            contracts: { data: action.payload.data, loading: false },
        },
    });
}
const slice = createSlice({
    name: "SingleProject",
    initialState: initState,
    reducers: {
        fetchProductionProjectStart,
        fetchApprovalChangeOrderStart,
        fetchApprovalChangeOrderSuccess,
        fetchApprovalChangeOrderFailure,
        fetchMonthlySpendAnalysisStart,
        fetchMonthlySpendAnalysisSuccess,
        fetchMonthlySpendAnalysisFailure,
        fetchProjectBudgetStart,
        fetchProjectBudgetSuccess,
        fetchProjectBudgetFailure,
        fetchRenoTimeByUnitStart,
        fetchRenoTimeByUnitSuccess,
        fetchRenoTimeByUnitFailure,
        fetchMonthlyTurnedUnitsStart,
        fetchMonthlyTurnedUnitsSuccess,
        fetchMonthlyTurnedUnitsFailure,
        fetchRenovationProgressStart,
        fetchRenovationProgressSuccess,
        fetchRenovationProgressFailure,
        fetchUnitStatusMapStart,
        fetchUnitStatusMapSuccess,
        fetchUnitStatusMapFailure,
        fetchProjectDataStart,
        fetchProjectDataSuccess,
        fetchProjectDataFailure,
        updateSingleProjectStart,
        updateSingleProjectSuccess,
        updateSingleProjectFailure,
        createDesignDocumentsStart,
        createDesignDocumentsSuccess,
        createDesignDocumentsFailure,
        getDesignDocumentsStart,
        getDesignDocumentsSuccess,
        DeleteDesignDocumentsStart,
        DeleteDesignDocumentsSuccess,
        fetchKeyPeopleSuccess,
        fetchKeyPeopleStart,
        fetchKeyPeopleFailure,
        getFileDownloadStart,
        fileDownloadFailure,
        fileDownloadSuccess,
        getRfpBidStatusDeatilsStart,
        getRfpBidStatusFailure,
        getRfpBidStatusSuccess,
        getLeveledBidDDocumentsFailure,
        getLeveledBidDocumentsStart,
        getLeveledBidDDocumentsSuccess,
        createLeveledBidDocumentsSuccess,
        fetchPackagesStart,
        fetchPackagesSuccess,
        changeStep,
        previousStep,
        fetchQuestionsAndAnswersStart,
        fetchQuestionsAndAnswersSuccess,
        nextQuestionSelection,
        prevQuestionSelection,
        fetchQuestionResponssesStart,
        fetchQuestionResponssesSuccess,
        fetchQuestionResponssesFailure,
        updateCurrentCategoryId,
        updateCurrentQuestionId,
        fetchQuestionsAndAnswersFailure,
        updateQuestionAnswerDataAfterSelectionChange,
        resetRenowizardStore,
        updateRoomSelectionOnStore,
        updateSkippedCategorys,
        assignQuestionResponseFailure,
        assignQuestionResponseStart,
        savingSelectionsData,
        fetchSpecsOptionsStart,
        fetchSpecsOptionsSuccess,
        fetchSpecsOptionsFailure,
        fetchInventoryListStart,
        fetchInventoryListSuccess,
        updateInventoryDetail,
        deleteInventory,
        backToWelcomePage,
        stayInQuestionerePage,
        fetchRenoParametersStart,
        fetchRenoParametersSuccess,
        fetchRenoParametersFailure,
        fetchRenoItemsStart,
        fetchRenoItemsSuccess,
        updateQuestionCompletionStatus,
        updateRenoItemsToCurrentQuestionData,
        updateCurrentInventory,
        updateRenoIsInitial,
        updateRenoParameter,
        createExhAContractsStart,
        createExhAContractsSuccess,
        createExhAContractsFailure,
        getExhAContractsSuccess,

        // reno-wizard-v2
        setRenoWizardV2CurrentStep,
        incRenoWizardV2CurrentStep,
        decRenoWizardV2CurrentStep,
        updateSingleProjectStatusStart,
        updateSingleProjectStatusSuccess,
        updateSingleProjectStatusFailure,
        contactTailorbird,
        getProjectsStart,
        getProjectsSuccess,
        getProjectsFailure,
        getBasePackageStart,
        getBasePackageSuccess,
        getBasePackageFailure,
        getPackageContentStart,
        getPackageContentSuccess,
        getPackageContentFailure,
        createRenoItemsFromExistingProjectStart,
        createRenoItemsFromExistingProjectSuccess,
        createRenoItemsFromExistingProjectFailure,
        getProjectContainerStart,
        getProjectContainerSuccess,
        getProjectContainerFailure,
        getProjectCodicesStart,
        getProjectCodicesSuccess,
        getProjectCodicesFailure,
        getRenovationItemsStart,
        getRenovationItemsSuccess,
        getRenovationItemsFailure,
        refreshRenovationItems,
        addRenovationItemsStart,
        addRenovationItemsSuccess,
        addRenovationItemsFailure,
        updateRenovationItemsStart,
        updateRenovationItemsSuccess,
        updateRenovationItemsFailure,
        addMaterialSpecStart,
        addMaterialSpecSuccess,
        addMaterialSpecFailure,
        getProjectScopeDocumentStart,
        getProjectScopeDocumentSuccess,
        getProjectScopeDocumentFailure,
        createProjectScopeDocumentStart,
        createProjectScopeDocumentSuccess,
        createProjectScopeDocumentFailure,
        updateRenovationItemsLocally,
        markRenoWizardAsSubmitted,
    },
});

export const actions = slice.actions;

export default slice.reducer;
