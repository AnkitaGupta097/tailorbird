import { takeEvery } from "@redux-saga/core/effects";
import { fetchLiveAgreement } from "./operation";

import { actions } from "./slice";

export const AgreementSaga = [takeEvery(actions.fetchLiveAgreementStart.type, fetchLiveAgreement)];
