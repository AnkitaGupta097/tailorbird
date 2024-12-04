/* eslint-disable no-unused-vars */
import { PayloadAction } from "@reduxjs/toolkit";
import { updateArray, updateObject } from "utils/store-helpers";
import { IFileDetails, ISingleProject } from "../interfaces";
import { cloneDeep } from "lodash";

export function setRenoWizardV2CurrentStep(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.currentStep = action.payload.currentStep;
}

export function incRenoWizardV2CurrentStep(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.currentStep += 1;
}

export function decRenoWizardV2CurrentStep(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.currentStep -= 1;
}

export function updateSingleProjectStatusStart(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.loading = true;
}

export function updateSingleProjectStatusSuccess(
    state: ISingleProject,
    action: PayloadAction<any>,
) {
    state.renovationWizardV2.loading = false;
    state.projectDetails.projectStatus = action.payload;
}
export function updateSingleProjectStatusFailure(
    state: ISingleProject,
    action: PayloadAction<any>,
) {
    state.renovationWizardV2.loading = false;
}

export function contactTailorbird(state: ISingleProject, action: PayloadAction<any>) {}

export function getProjectsStart(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.projects.loading = true;
}

export function getProjectsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.projects.loading = false;
    state.renovationWizardV2.projects.data = action.payload;
}

export function getProjectsFailure(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.projects.loading = false;
}

export function getBasePackageStart(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.basePackage.loading = true;
}

export function getBasePackageSuccess(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.basePackage.loading = false;
    state.renovationWizardV2.basePackage.data = action.payload;
}

export function getBasePackageFailure(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.basePackage.loading = false;
}

export function getPackageContentStart(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.projectPackageContents.loading = true;
}

export function getPackageContentSuccess(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.projectPackageContents.loading = false;
    state.renovationWizardV2.projectPackageContents.data = action.payload;
}

export function getPackageContentFailure(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.projectPackageContents.loading = false;
}

export function createRenoItemsFromExistingProjectStart(
    state: ISingleProject,
    action: PayloadAction<any>,
) {
    state.renovationWizardV2.loading = true;
}

export function createRenoItemsFromExistingProjectSuccess(
    state: ISingleProject,
    action: PayloadAction<any>,
) {
    state.renovationWizardV2.loading = false;
}

export function createRenoItemsFromExistingProjectFailure(
    state: ISingleProject,
    action: PayloadAction<any>,
) {
    state.renovationWizardV2.loading = false;
}

export function getProjectContainerStart(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.projectContainer.loading = true;
}

export function getProjectContainerSuccess(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.projectContainer.loading = false;
    state.renovationWizardV2.projectContainer.data = action.payload.getProjectContainer;
}

export function getProjectContainerFailure(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.projectContainer.loading = false;
}

export function getProjectCodicesStart(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.projectCodices.loading = true;
}

export function getProjectCodicesSuccess(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.projectCodices.loading = false;
    state.renovationWizardV2.projectCodices.data = action.payload.getProjectCodices;
}

export function getProjectCodicesFailure(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.projectCodices.loading = false;
}

export function getRenovationItemsStart(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.renovationItems.loading = true;
}

export function getRenovationItemsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.loading = false;
    state.renovationWizardV2.renovationItems.loading = false;
    state.renovationWizardV2.renovationItems.data = action.payload.renovations;
}

export function getRenovationItemsFailure(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.renovationItems.loading = false;
}

export function refreshRenovationItems(state: ISingleProject, action: PayloadAction<any>) {}

export function addRenovationItemsStart(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.loading = true;
    state.renovationWizardV2.renovationItems.addingRenoItems = true;
}

export function addRenovationItemsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.renovationItems.addingRenoItems = false;
    state.renovationWizardV2.renovationItems.data.push(action.payload);
}

export function addRenovationItemsFailure(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.loading = false;
    state.renovationWizardV2.renovationItems.addingRenoItems = false;
}

export function updateRenovationItemsLocally(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.renovationItems.data =
        state.renovationWizardV2.renovationItems.data.map((renoItem) => {
            if (renoItem.id === action.payload.renoItemId) {
                if (action.payload.location) renoItem.location = action.payload.location;
                if (action.payload.scope) renoItem.scope = action.payload.scope;
            }
            return renoItem;
        });
}

export function updateRenovationItemsStart(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.loading = true;
}

export function updateRenovationItemsSuccess(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.loading = false;
    state.renovationWizardV2.renovationItems.data =
        state.renovationWizardV2.renovationItems.data.map((renoItem) => {
            let idx = action.payload.findIndex((x: any) => x.reno_id === renoItem.id);
            if (idx !== -1) {
                renoItem = { ...renoItem, ...action.payload[idx] };
            }
            return renoItem;
        });
}

export function updateRenovationItemsFailure(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.loading = false;
}

export function addMaterialSpecStart(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.loading = true;
    state.renovationWizardV2.projectPackageContents.addingMaterial = true;
}

export function addMaterialSpecSuccess(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.loading = false;
    state.renovationWizardV2.projectPackageContents.addingMaterial = false;
    state.renovationWizardV2.projectPackageContents.data.materials = [
        ...state.renovationWizardV2.projectPackageContents.data.materials,
        ...action.payload,
    ];
}

export function addMaterialSpecFailure(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.loading = false;
    state.renovationWizardV2.projectPackageContents.addingMaterial = false;
}

export function getProjectScopeDocumentStart(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.loading = true;
}

export function getProjectScopeDocumentSuccess(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.loading = false;
    state.renovationWizardV2.uploadedFiles.data = action.payload.data;
}

export function getProjectScopeDocumentFailure(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.loading = false;
}

export function createProjectScopeDocumentStart(state: ISingleProject, action: PayloadAction<any>) {
    // let files = action?.payload?.input?.files?.map((file: IFileDetails) => {
    //     return {
    //         file_name: file?.file_name,
    //         loading: true,
    //         error: "",
    //     };
    // });
    // state.renovationWizardV2.uploadedFiles.data = [
    //     ...state.renovationWizardV2.uploadedFiles.data,
    //     ...files,
    // ];
    // return updateObject(state, {
    //     loading: action?.payload?.isExhAContract ? false : true,
    //     RFP: updateObject(state.RFP, {
    //         contracts: updateObject(state.RFP.contracts, {
    //             loading: action?.payload?.isExhAContract ? true : false,
    //         }),
    //     }),
    //     fileDetails: state?.renovationWizard.uploadDetails,
    //     uploadDetails: files,
    // });
}

export function createProjectScopeDocumentSuccess(
    state: ISingleProject,
    action: PayloadAction<any>,
) {
    const existingFiles = cloneDeep(state?.renovationWizardV2.uploadedFiles.data);
    const uploadedFiles = action?.payload?.map((details: any) => {
        return { ...details?.file, uploading: true };
    });

    state.renovationWizardV2.uploadedFiles.data = [...existingFiles, ...uploadedFiles];
}

export function createProjectScopeDocumentFailure(
    state: ISingleProject,
    action: PayloadAction<any>,
) {}

export function markRenoWizardAsSubmitted(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.submitted = true;
}

export function addNewMaterialToPackage(state: ISingleProject, action: PayloadAction<any>) {
    state.renovationWizardV2.projectPackageContents.data.materials.push(action.payload);
}
