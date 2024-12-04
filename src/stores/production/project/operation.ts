/* eslint-disable no-unused-vars */
import { PayloadAction } from "@reduxjs/toolkit";
import { put } from "@redux-saga/core/effects";

import { GET_CONSTANTS, GET_PRODUCTION_FEATURES } from "./queries";
import actions from "../../actions";
import { client as graphQLClient } from "../../gql-client";

//eslint-disable-next-line
export function* fetchProductionProjectStateData(action: PayloadAction<any>) {
    const projectId = action.payload.projectId;
    const hasProductionConstants = action.payload.hasProductionConstants;

    try {
        // @ts-ignore
        const response: { getProductionFeatureAccess } = yield graphQLClient.query(
            "getProductionFeatureAccess",
            GET_PRODUCTION_FEATURES,
            { projectId },
        );

        yield put(
            actions.production.project.setProductionProjectStateSuccess({
                features: response || [],
                projectId,
                subscription: undefined,
            }),
        );
    } catch (exception) {
        yield put(
            actions.production.project.setProductionAccessDenied({
                projectId,
            }),
        );
        console.error(exception);
    }
    if (!hasProductionConstants) {
        try {
            // @ts-ignore
            const response: { getConstants } = yield graphQLClient.query(
                "getConstants",
                GET_CONSTANTS,
                { projectId },
            );

            yield put(
                actions.production.project.setProductionProjectStateSuccess({
                    constants: response || {},
                }),
            );
        } catch (exception) {
            console.error(exception);
        }
    }
}
