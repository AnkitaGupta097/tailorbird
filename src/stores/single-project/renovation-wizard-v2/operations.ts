import { PayloadAction } from "@reduxjs/toolkit";
import { graphQLClient } from "utils/gql-client";
import { put, select, all } from "@redux-saga/core/effects";
import actions from "stores/actions";
import {
    ADD_NEW_MATERIAL_ITEM,
    SEND_RENO_WIZARD_ADDITIONAL_SUPPORT_EMAIL,
    CREATE_RENO_ITEM,
    CREATE_RENO_ITEMS_FROM_EXISTING_PROJECT,
    GET_PACKAGE_BY_ID,
    GET_PROJECTS_WITH_FILTER,
    GET_PROJECT_BASE_PACKAGE,
    GET_PROJECT_CODICES,
    GET_PROJECT_CONTAINER,
    GET_RENOVATION_ITEMS,
    UPDATE_MULTIPLE_RENO_ITEMS,
    UPDATE_PROJECT_STATUS,
} from "./queries";
import { RootState } from "stores";
import { cloneDeep } from "lodash";

const getProjectId = (state: RootState) => state.singleProject.projectDetails.id;

export function* updateSingleProjectStatus(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("updateProjectStatus", UPDATE_PROJECT_STATUS, {
            input: action.payload.input,
        });
        yield put(
            actions.singleProject.updateSingleProjectStatusSuccess(action.payload.input.status),
        );
        if (action.payload.goToNextPage) {
            yield put(actions.singleProject.incRenoWizardV2CurrentStep({}));
        }
        if (action.payload.markSubmitted) {
            yield put(actions.singleProject.markRenoWizardAsSubmitted({}));
        }
    } catch (error) {
        console.log(error);
    }
}

export function* getProjects(action: PayloadAction<any>) {
    try {
        const filters = action.payload.filters;
        // @ts-ignore
        const response: any = yield graphQLClient.query(
            "getProjectsWithFilters",
            GET_PROJECTS_WITH_FILTER,
            {
                filters: filters,
            },
        );
        let projects = response.getProjectsWithFilters.projects;

        // @ts-ignore
        const basePackages: any = yield all(
            projects.map((project: any) =>
                graphQLClient.query("getBasePackage", GET_PROJECT_BASE_PACKAGE, {
                    input: { project_id: project.id },
                }),
            ),
        );
        projects = projects.map((project: any, idx: number) => {
            return { ...project, basePackage: basePackages[idx].getBasePackage };
        });
        yield put(actions.singleProject.getProjectsSuccess(projects));
    } catch (error) {
        console.log(error);
    }
}

export function* getBasePackage(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        let response: any = yield graphQLClient.query("getBasePackage", GET_PROJECT_BASE_PACKAGE, {
            input: { project_id: action.payload },
        });

        yield put(actions.singleProject.getBasePackageSuccess(response.getBasePackage));
    } catch (error) {
        console.log(error);
    }
}

export function* getPackageContent(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query("getPackage", GET_PACKAGE_BY_ID, {
            input: action.payload.packageId,
        });

        yield put(actions.singleProject.getPackageContentSuccess(response.getPackage));
    } catch (error) {
        console.log(error);
    }
}

export function* getProjectContainer(action: PayloadAction<any>) {
    try {
        let response: any[] = yield graphQLClient.query(
            "getProjectContainer",
            GET_PROJECT_CONTAINER,
            {
                input: action.payload,
            },
        );
        yield put(actions.singleProject.getProjectContainerSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* getProjectCodices(action: PayloadAction<any>) {
    try {
        let response: any[] = yield graphQLClient.query("getProjectCodices", GET_PROJECT_CODICES, {
            input: action.payload,
        });
        yield put(actions.singleProject.getProjectCodicesSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* getRenovationItems(action: PayloadAction<any>) {
    try {
        let response: any[] = yield graphQLClient.query("getBaseScope", GET_RENOVATION_ITEMS, {
            project_id: action.payload.project_id,
            is_active: action.payload.is_active,
        });
        yield put(actions.singleProject.getRenovationItemsSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* refreshRenovationItems() {
    try {
        let projectId: string = yield select(getProjectId);
        let response: any[] = yield graphQLClient.query("getBaseScope", GET_RENOVATION_ITEMS, {
            project_id: projectId,
            is_active: false,
        });
        yield put(actions.singleProject.getRenovationItemsSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* contactTailorbird(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate(
            "sendRenoWizardAdditionalSupportEmail",
            SEND_RENO_WIZARD_ADDITIONAL_SUPPORT_EMAIL,
            {
                project_id: action.payload.project_id,
            },
        );
        yield put(
            actions.common.openSnack({
                variant: "success",
                message: "Email sent successfully",
                open: true,
            }),
        );
    } catch (error) {
        console.log(error);
    }
}

export function* addRenovationItems(action: PayloadAction<any>) {
    try {
        yield all(
            action.payload.map((createRenoItemPayload: any) =>
                graphQLClient.mutate("createRenoItem", CREATE_RENO_ITEM, {
                    payload: createRenoItemPayload,
                }),
            ),
        );
        // yield put(actions.singleProject.addRenovationItemsSuccess(response));
        yield put(actions.singleProject.refreshRenovationItems({}));
    } catch (error) {
        console.log(error);
        yield put(actions.singleProject.addRenovationItemsFailure({}));
    }
}

export function* updateMultipleRenovationItems(action: PayloadAction<any>) {
    try {
        const updatePayload = cloneDeep(action.payload).map((p: any) => {
            delete p.scope; //scope is not an update parameter, but needed for redux store update
            return p;
        });
        yield graphQLClient.mutate("updateRenoItem", UPDATE_MULTIPLE_RENO_ITEMS, {
            payload: updatePayload,
        });
        yield put(actions.singleProject.updateRenovationItemsSuccess(action.payload));
        // yield put(actions.singleProject.refreshRenovationItems({}));
    } catch (error) {
        console.log(error);
        yield put(actions.singleProject.updateRenovationItemsSuccess({}));
    }
}

export function* addNewMaterialItem(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: any = yield graphQLClient.mutate(
            "addNewMaterialItem",
            ADD_NEW_MATERIAL_ITEM,
            {
                input: action.payload.materials,
            },
        );
        yield put(actions.singleProject.addMaterialSpecSuccess(response));

        yield put(
            actions.common.openSnack({
                variant: "success",
                message: "Material added successfully",
                open: true,
            }),
        );
        yield put(
            actions.singleProject.updateRenovationItemsStart([
                {
                    reno_id: action.payload.renoItemId,
                    work_id: response[0].material_id,
                },
            ]),
        );
    } catch (error) {
        console.log(error);
        yield put(actions.singleProject.addMaterialSpecFailure({}));
    }
}

export function* createRenoItemsFromExistingProject(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate(
            "createRenovationSetupForExistingUser",
            CREATE_RENO_ITEMS_FROM_EXISTING_PROJECT,
            { payload: action.payload },
        );
        yield put(actions.singleProject.incRenoWizardV2CurrentStep({}));
        yield put(actions.singleProject.createRenoItemsFromExistingProjectSuccess({}));
    } catch (error) {
        console.log(error);
        yield put(actions.singleProject.createRenoItemsFromExistingProjectFailure({}));
    }
}
