import { PayloadAction } from "@reduxjs/toolkit";
import { put } from "@redux-saga/core/effects";

import { GET_LIVE_AGREEMENTS } from "./queries";
import actions from "../../actions";
import { client as graphQLClient } from "../../gql-client";

export function* fetchLiveAgreement(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: { getLiveAgreementData } = yield graphQLClient.query(
            "getLiveAgreementData",
            GET_LIVE_AGREEMENTS,
            {
                projectId: action.payload.projectId,
            },
        );

        yield put(
            actions.production.agreements.fetchLiveAgreementSuccess({ liveAgreement: response }),
        );
    } catch (exception) {
        yield put(actions.production.agreements.fetchLiveAgreementFailure({}));
    }
}
