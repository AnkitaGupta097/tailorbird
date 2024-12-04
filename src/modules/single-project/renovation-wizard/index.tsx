/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import appTheme from "styles/theme";
import { STEPS_NAME, RENO_STEPS } from "../contants";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import WelcomePage from "./welcome-page";
import RenoSummary from "./reno-summary";
import CreateSubProject from "./create-sub-project";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import actions from "../../../stores/actions";
import PackageDetails from "./package-wizard";
import RenovationRooms from "./rooms-selection";
import CategoryQuestions from "./category-questions";
import SetParameterModal from "../modal/set-parameter-modal";
import NewSpecModal from "../modal/new-spec-modal";
import RenoBreadCrumbs from "./reno-breadcrumbs";
import SubRenoBreadCrumbs from "./sub-reno-breadcrumbs";
import { graphQLClient } from "utils/gql-client";
import { CREATE_INVENTORY_DETAILS, UPDATE_RENO_ITEM } from "stores/single-project/queries";
import { UPDATE_INVENTORY_DETAILS } from "modules/projects/details/budgeting/bidbook-v2/actions/mutation-contsants";
import { filter, find, isEmpty } from "lodash";
import ProgramCompletionModal from "../modal/program-completion-modal";
import { CREATE_QUESTION_RESPONSE } from "stores/single-project/queries";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import SpecSelection from "./spec-selection";
import ScopeSummary from "./scope-summary";
import Loader from "modules/admin-portal/common/loader";

const RenovationWizard = () => {
    const dispatch = useAppDispatch();
    const userId = localStorage.getItem("user_id") || "";

    const {
        currentStep,
        breadcrumsData,
        questionAnswerData,
        isReachedLastQuestionOnSurvey,
        projectDetail,
        rooms,
        savingChanges,
        currentQuestionId,
        inventoryList,
        currentInventory,
        isLoadingInventory,
    } = useAppSelector((state) => ({
        currentStep: state.singleProject.renovationWizard.navigation.currentStep,
        breadcrumsData: state.singleProject.renovationWizard.breadcrumsData,
        currentInventory: state.singleProject.renovationWizard.currentInventory,
        questionAnswerData: state.singleProject.renovationWizard.questionAnswerData,
        isReachedLastQuestionOnSurvey:
            state.singleProject.renovationWizard.questionAnswerData.isReachedLastQuestionOnSurvey,
        projectDetail: state.singleProject.projectDetails,
        rooms: state.singleProject.renovationWizard.rooms.data,
        savingChanges: state.singleProject.renovationWizard.questionAnswerData.savingChanges,
        currentQuestionId:
            state.singleProject.renovationWizard.questionAnswerData.currentQuestionId,
        inventoryList: state.singleProject.renovationWizard.inventoryList.data,
        isLoadingInventory: state.singleProject.renovationWizard.inventoryList.loading,
    }));
    const { enqueueSnackbar } = useSnackbar();
    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };
    const { projectId } = useParams();
    const [isModal, setIsModal] = useState<any>({
        parameter: false,
        newSpec: false,
    });
    const [currentCategoryData, setCurrentCategory] = useState<any>(null);
    const [packageId, setPackageId] = useState<any>(null);
    const [openProgramCompletionModal, setOpenProgramCompletionModal] = useState<boolean>(false);
    const [
        isSeectedAtLeastOneAnswerForCurrentQuestions,
        setIsSeectedAtLeastOneAnswerForCurrentQuestions,
    ] = useState(false);
    const [specSelectionEnabled, setSpecSelectionEnabled] = useState<any>(false);
    const [currentQuestions, setCurrentQuestions] = useState<any>([]);
    const [disableSpectSave, setDisableSpectSave] = useState<any>(true);
    const [materialData, setMaterialData] = useState<any>(null);
    const [parameterData, setParameterData] = useState<any>(null);
    const [selectedSpecs, setSelectedSpecs] = useState<{ [key: string]: string[] }>({});
    const [selectedParameter, setSelectedParameter] = useState<any>({
        isSelected: false,
        isPrefered: false,
    });

    console.log(currentCategoryData, "currentCategoryData");

    useEffect(() => {
        if (!isEmpty(materialData)) {
            currentQuestions?.forEach((question: any) => {
                question?.renoItems?.forEach((renoItem: any) => {
                    updateRenoItem({
                        sku_data: {
                            ...materialData,
                            category: question?.category_id,
                            package_id: projectDetail.package_id,
                        },
                        org_container_item_id: renoItem.org_container_item_id,
                        id: renoItem.id,
                    });
                });
            });
        }
        // eslint-disable-next-line
    }, [materialData]);

    useEffect(() => {
        if (!isEmpty(parameterData)) {
            currentQuestions?.forEach((question: any) => {
                question?.renoItems?.forEach((renoItem: any) => {
                    updateRenoItem(
                        {
                            parameters: {
                                ...parameterData,
                                organisation_container_id: renoItem.org_container_item_id,
                            },
                            org_container_item_id: renoItem.org_container_item_id,
                            id: renoItem.id,
                        },
                        "parameter",
                    );
                });
            });
        }
        // eslint-disable-next-line
    }, [parameterData]);

    useEffect(() => {
        const { currentCategoryId } = questionAnswerData;
        if (!isEmpty(currentCategoryId)) {
            const currentCategory = find(breadcrumsData, { categoryId: currentCategoryId });
            if (!isEmpty(currentCategory?.subset)) {
                setCurrentCategory(currentCategory);
            }
        }
        // eslint-disable-next-line
    }, [questionAnswerData.currentCategoryId]);

    useEffect(() => {
        const currentCategoryId = questionAnswerData?.currentCategoryId;
        if (!isEmpty(currentCategoryId)) {
            const currentCategory = find(questionAnswerData.data, {
                category_id: currentCategoryId,
            });
            const currentQuestions = currentCategory?.questions?.filter(
                (question: any) => question.isCurrentQuestion,
            );
            setCurrentQuestions(currentQuestions);
            const isAnswerSelectedForAll = currentQuestions?.every((question: any) =>
                question.answers.some((answer: any) => answer.isSelected),
            );

            setIsSeectedAtLeastOneAnswerForCurrentQuestions(isAnswerSelectedForAll);
        }
    }, [questionAnswerData?.currentCategoryId, questionAnswerData.data]);

    const updateRenoItem = async (reqBody: any, key?: string) => {
        try {
            const res = await graphQLClient.mutate("updateRenoItemV2", UPDATE_RENO_ITEM, {
                payload: {
                    sku_id: null,
                    package_id: isEmpty(projectDetail.package_id) ? null : projectDetail.package_id,
                    org_container_item_id: null,
                    is_active: true,
                    id: null,
                    property_layout_id: null,
                    project_id: projectDetail.id,
                    ...reqBody,
                },
            });
            if (key == "parameter") {
                dispatch(
                    actions.singleProject.updateRenoParameter({
                        data: [{ ...res[0], ...parameterData }],
                        itemId: currentQuestions[0].item_id,
                    }),
                );
                setSelectedParameter({ ...selectedParameter, isSelected: true });
                setDisableSpectSave(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const packageSelection = async () => {
        try {
            const res = await graphQLClient.mutate(
                "updateInventoryDetails",
                UPDATE_INVENTORY_DETAILS,
                {
                    payload: {
                        updated_by: userId,
                        package_id: packageId,
                        id: currentInventory?.id,
                    },
                },
            );
            dispatch(
                actions.singleProject.updateCurrentInventory({
                    package_id: res.package_id,
                }),
            );
        } catch (error) {
            console.log(error);
        }
    };

    const createInventory = async () => {
        const res = await graphQLClient.mutate("createInventoryDetails", CREATE_INVENTORY_DETAILS, {
            payload: {
                project_id: projectDetail.id,
                created_by: userId,
                description: currentInventory?.description,
                name: currentInventory?.name,
                is_default: null,
            },
        });
        dispatch(actions.singleProject.updateCurrentInventory({ ...res }));
    };

    const checkIsLastQuestiononSurevy = (item: any) => {
        const { currentCategoryId, data } = questionAnswerData;
        const questionAnswerDataCopy = JSON.parse(JSON.stringify(data));

        const catIndex = questionAnswerDataCopy.findIndex(
            (item: any) => item.category_id === currentCategoryId,
        );
        if (catIndex != -1) {
            const maxQtnQueueNum = Math.max(
                ...questionAnswerDataCopy[catIndex].questions.map((item: any) => item.qtnQueueNum),
            );

            if (item.qtnQueueNum == maxQtnQueueNum) {
                const nextCatExist = catIndex + 1 < questionAnswerDataCopy.length;
                return nextCatExist;
            }
        } else {
            return false;
        }
    };

    const assignQuestionResponse = async () => {
        const specSelectionEnabledVal =
            packageId &&
            currentQuestions?.length > 0 &&
            currentQuestions.every((question: any) => question.item_id !== null);

        try {
            dispatch(actions.singleProject.savingSelectionsData({ data: true }));

            const isRoomSelection = currentStep === STEPS_NAME.ROOMS;
            const ReqDataSource = isRoomSelection
                ? rooms.filter((room: any) => room.isSelected)
                : JSON.parse(JSON.stringify(currentQuestions));

            const promises = ReqDataSource?.map((item: any) => {
                const selectedAnswers = isRoomSelection
                    ? [item]
                    : item?.answers?.filter((answer: any) => answer?.isSelected);

                return Promise.all(
                    selectedAnswers?.map((selectedAnswer: any, index: any) => {
                        //to be enabled requires testing to update survey completion
                        // if (index == selectedAnswers.length - 1) {
                        //     const isLastQuestionOnSurvey = checkIsLastQuestiononSurevy(item);
                        //     console.log("isLastQuestionOnSurvey", isLastQuestionOnSurvey);

                        //     if (isLastQuestionOnSurvey === true) {
                        //         markSurveyCompletion();
                        //     }
                        // }
                        return graphQLClient.mutate(
                            "assignQuestionResponse",
                            CREATE_QUESTION_RESPONSE,
                            {
                                questionResponseInput: {
                                    created_by: userId,
                                    answer_id: isRoomSelection
                                        ? item.id
                                        : selectedAnswer.id || null,
                                    category_id: item.category_id || null,
                                    item_id: item.item_id,
                                    meta_data: item.meta_data ? item.meta_data : item.meta_data,
                                    package_id: packageId,
                                    project_id: projectId,
                                    inventory_id: currentInventory?.id,
                                    question_id: isRoomSelection ? item.question_id : item.id,
                                    is_active: true,
                                    room: isRoomSelection
                                        ? "rooms"
                                        : item.room_name
                                        ? item.room_name
                                        : "null",
                                },
                            },
                        );
                    }),
                );
            }) as Array<Promise<any>>;
            const responses = await Promise.allSettled(promises.flat());

            const allSucceeded = responses.every((response) => response.status === "fulfilled");
            if (!allSucceeded) {
                showSnackBar("error", "Unable to save the changes");
            } else {
                if (isRoomSelection == false) {
                    let renoitems: any = [];
                    responses?.forEach((response: any) => {
                        response.value?.forEach((element: any) => {
                            if (element.reno_items) {
                                renoitems.push(...element.reno_items);
                            }
                        });
                    });
                    dispatch(
                        actions.singleProject.updateRenoItemsToCurrentQuestionData({
                            data: filter(
                                renoitems,
                                (items) =>
                                    items.work_type == "Material" &&
                                    !items.subcategory.includes("Install kit"),
                            ),
                        }),
                    );
                }
            }
        } catch (error) {
            showSnackBar("error", "Error occured , Unable to save the changes");
        } finally {
            setSpecSelectionEnabled(specSelectionEnabledVal);
            dispatch(actions.singleProject.savingSelectionsData({ data: false }));
            if (!specSelectionEnabledVal) {
                dispatch(
                    actions.singleProject.nextQuestionSelection({
                        isRightAfterRoomSelection: currentStep == STEPS_NAME.ROOMS,
                    }),
                );
            }
        }
    };
    const updateSpecsForRenoItems = () => {
        try {
            dispatch(actions.singleProject.savingSelectionsData({ data: true }));
            currentQuestions?.forEach((question: any) => {
                question.renoItems?.forEach((renoItem: any) => {
                    if (selectedSpecs[question.item_id]?.length > 0) {
                        selectedSpecs[question.item_id]?.forEach((element: any) => {
                            updateRenoItem({
                                sku_id: element.material_id,
                                org_container_item_id: renoItem.org_container_item_id,
                                id: renoItem.id,
                            });
                        });
                    }
                });
            });
        } catch (error) {
            console.log(error);
        } finally {
            setSpecSelectionEnabled(false);
            dispatch(actions.singleProject.savingSelectionsData({ data: false }));
            dispatch(actions.singleProject.updateQuestionCompletionStatus({}));
            dispatch(actions.singleProject.nextQuestionSelection({}));
        }
    };

    const continueWithSelectClick = () => {
        switch (currentStep) {
            case STEPS_NAME.INVENTORY: {
                createInventory();
                break;
            }
            case STEPS_NAME.PACKAGE: {
                !isEmpty(packageId) && packageSelection();
                break;
            }
            case STEPS_NAME.ROOMS: {
                assignQuestionResponse();
                break;
            }
        }
        if (currentStep == STEPS_NAME.CATEGORY_QUESTIONS) {
            if (specSelectionEnabled) {
                updateSpecsForRenoItems();
            } else {
                assignQuestionResponse();
            }
        } else {
            dispatch(actions.singleProject.changeStep(RENO_STEPS[nextStep + 1]));
        }
    };
    const previousStepClick = () => {
        if (currentStep == STEPS_NAME.CATEGORY_QUESTIONS) {
            if (specSelectionEnabled) {
                setSpecSelectionEnabled(false);
            } else {
                dispatch(actions.singleProject.prevQuestionSelection({}));
            }
        } else {
            dispatch(actions.singleProject.previousStep(""));
        }
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case STEPS_NAME.WELCOME:
                return isEmpty(inventoryList) ? <WelcomePage /> : <RenoSummary />;

            case STEPS_NAME.INVENTORY:
                return <CreateSubProject />;

            case STEPS_NAME.PACKAGE:
                return <PackageDetails setPackageId={setPackageId} />;
            case STEPS_NAME.ROOMS:
                return <RenovationRooms />;
            case STEPS_NAME.CATEGORY_QUESTIONS:
                if (specSelectionEnabled && packageId) {
                    return (
                        <SpecSelection
                            currentQuestions={currentQuestions}
                            setIsModal={setIsModal}
                            packageId={packageId}
                            setDisableSpectSave={setDisableSpectSave}
                            selectedParameter={selectedParameter}
                            setSelectedParameter={setSelectedParameter}
                            selectedSpecs={selectedSpecs}
                            setSelectedSpecs={setSelectedSpecs}
                        />
                    );
                } else {
                    return <CategoryQuestions />;
                }
            case STEPS_NAME.SCOPE_SUMMARY:
                return <ScopeSummary />;
            default:
                break;
        }
    };

    const getContinueBtnName = () => {
        switch (currentStep) {
            case STEPS_NAME.INVENTORY:
                return "Continue";

            case STEPS_NAME.PACKAGE:
                return isEmpty(packageId) ? "Continue without package" : "Continue with selected";
            case STEPS_NAME.CATEGORY_QUESTIONS:
                if (specSelectionEnabled) {
                    const currentQuestion = currentQuestions.find(
                        (question: any) => question.id == currentQuestionId,
                    );
                    return `Finish ${currentQuestion?.item_name} - Go to Next Item`;
                } else {
                    return isReachedLastQuestionOnSurvey == true
                        ? "Save"
                        : "Continue with selected";
                }
            default:
                return "Continue with selected";
        }
    };

    const isBtnDisable = () => {
        switch (currentStep) {
            case STEPS_NAME.INVENTORY:
                return isEmpty(currentInventory?.name) ? true : false;
            case STEPS_NAME.CATEGORY_QUESTIONS:
                if (specSelectionEnabled) {
                    return !disableSpectSave;
                } else {
                    return !isSeectedAtLeastOneAnswerForCurrentQuestions;
                }
            default:
                return false;
        }
    };

    const getVariant = () => {
        switch (currentStep) {
            case STEPS_NAME.PACKAGE:
                return isEmpty(packageId) ? "outlined" : "contained";
            default:
                return "contained";
        }
    };

    useEffect(() => {
        if (isReachedLastQuestionOnSurvey) {
            dispatch(actions.singleProject.fetchInventoryListStart(projectId));
            setOpenProgramCompletionModal(true);
        } else {
            setOpenProgramCompletionModal(false);
        } // eslint-disable-next-line
    }, [isReachedLastQuestionOnSurvey]);

    const nextStep = RENO_STEPS.indexOf(currentStep);

    const backToWelcomePage = () => {
        dispatch(actions.singleProject.backToWelcomePage({}));
    };

    const stayInQuestionerePage = () => {
        dispatch(actions.singleProject.stayInQuestionerePage({}));
    };

    if (isLoadingInventory) {
        return (
            <Box mt={15} width="100%">
                <Loader />
            </Box>
        );
    }
    return (
        <Stack
            display={"grid"}
            gridAutoFlow={"column"}
            gridTemplateColumns={`${
                currentStep !== STEPS_NAME.WELCOME && currentStep !== STEPS_NAME.SCOPE_SUMMARY
                    ? "220px"
                    : "100%"
            } ${isEmpty(currentCategoryData?.subset) ? "auto" : "220px"}`}
        >
            {currentStep !== STEPS_NAME.WELCOME && currentStep !== STEPS_NAME.SCOPE_SUMMARY && (
                <>
                    <RenoBreadCrumbs />
                    {!isEmpty(currentCategoryData?.subset) && (
                        <SubRenoBreadCrumbs currentQuestions={currentQuestions} />
                    )}
                </>
            )}
            <Box py={4} px={6} border={`1px solid ${appTheme.border.textarea}`} borderRadius={1}>
                {renderCurrentStep()}
                {currentStep !== STEPS_NAME.WELCOME && currentStep !== STEPS_NAME.SCOPE_SUMMARY && (
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        pt={10}
                        position="relative"
                        sx={{ backgroundColor: appTheme.text.white }}
                    >
                        <Button
                            variant="text"
                            component="label"
                            style={{ marginLeft: "10px", height: "40px" }}
                            startIcon={
                                <ExpandMoreIcon
                                    stroke={appTheme.scopeHeader.label}
                                    style={{
                                        transform: "rotate(90deg)",
                                    }}
                                />
                            }
                            onClick={() => previousStepClick()}
                        >
                            <Typography variant="text_18_medium" color={appTheme.scopeHeader.label}>
                                Previous
                            </Typography>
                        </Button>
                        <LoadingButton
                            loading={savingChanges}
                            loadingPosition="start"
                            startIcon={savingChanges ? <SaveIcon /> : null}
                            variant={getVariant()}
                            component="label"
                            style={{ whiteSpace: "nowrap" }}
                            endIcon={
                                <ExpandMoreIcon
                                    stroke={appTheme.scopeHeader.label}
                                    style={{
                                        transform: `rotate(270deg)`,
                                    }}
                                />
                            }
                            onClick={continueWithSelectClick}
                            disabled={isBtnDisable()}
                            sx={{
                                minWidth: "103px",
                                padding: "12px 15px",
                                ":hover": {
                                    opacity: "0.7",
                                },
                            }}
                        >
                            <Typography variant="text_16_semibold" textAlign="center">
                                {savingChanges ? "saving your selection's" : getContinueBtnName()}
                            </Typography>
                        </LoadingButton>
                    </Box>
                )}
            </Box>

            {isModal.parameter && (
                <SetParameterModal
                    modalHandler={setIsModal}
                    openModal={isModal.parameter}
                    setParameterData={setParameterData}
                />
            )}
            {isModal.newSpec && (
                <NewSpecModal
                    modalHandler={setIsModal}
                    openModal={isModal.newSpec}
                    setMaterialData={setMaterialData}
                />
            )}
            <ProgramCompletionModal
                ProgramCompletionModalHandler={setOpenProgramCompletionModal}
                openProgramCompletionModal={openProgramCompletionModal}
                backToWelcomePage={backToWelcomePage}
                stayInQuestionerePage={stayInQuestionerePage}
            />
        </Stack>
    );
};

export default RenovationWizard;
