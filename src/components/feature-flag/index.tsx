import React, { useEffect } from "react";
import actions from "stores/actions";
import { useAppDispatch } from "stores/hooks";

const URL = process.env.REACT_APP_FEATURE_FLAG_URL ?? "";

export default function FeatureFlag() {
    const dispatch = useAppDispatch();
    async function fetchData() {
        try {
            const response = await fetch(URL);
            const json = await response.json();
            dispatch(actions.common.updateFeatureFlags(json.features));
        } catch {
            console.error("Error polling feature flag data");
        }
    }
    useEffect(() => {
        let intervalReference = null as any;
        if (URL) {
            fetchData();
            //TODO: This has been commented as it was causing re-render issue in RFP 2.0 Combinations accordion
            // intervalReference = setInterval(async () => {
            //     await fetchData();
            // }, 10000);
        }
        return () => {
            clearInterval(intervalReference);
        };
        //eslint-disable-next-line
    }, []);
    return <div id="feature-flag-poller"></div>;
}
