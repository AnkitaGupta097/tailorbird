import trackerGraphQL from "@openreplay/tracker-graphql";
import Tracker from "@openreplay/tracker";
import { Operation } from "@apollo/client";
import mixpanel from "mixpanel-browser";

const disable_secure_mode =
    process.env.REACT_APP_TRACKER__DISABLE_SECURE_MODE?.toString() == "true";

mixpanel.init(process.env.REACT_APP_MIXPANEL_TAILORBIRD_WEB_V2_TOKEN || "MIXPANEL_TOKEN", {
    debug: false,
    ignore_dnt: true,
});

export default class TrackerUtil {
    private static trackerObject = new Tracker({
        projectKey: process.env.REACT_APP_TRACKER_PROJECT_KEY ?? "",
        ingestPoint: process.env.REACT_APP_TRACKER_END_POINT ?? "",
        __DISABLE_SECURE_MODE: disable_secure_mode,
    });

    private static recordGraphQL = TrackerUtil.trackerObject.use(trackerGraphQL());

    public static startTracking() {
        TrackerUtil.trackerObject.start();
    }

    public static setUser(user: { id: string; name: string; email: string }) {
        TrackerUtil.trackerObject.setUserID(user.email);
        mixpanel.reset();
        mixpanel.identify(user.id);
        mixpanel.people.set("$email", user.email);
        mixpanel.people.set("$name", user.name);
        mixpanel.register({
            userId: localStorage.getItem("user_id"),
            orgId: localStorage.getItem("organization_id"),
        });
    }

    public static trackGraphQLResult(operation: Operation, result: any) {
        const operationDefinition = operation.query.definitions[0];
        return TrackerUtil.recordGraphQL(
            operationDefinition.kind === "OperationDefinition"
                ? operationDefinition.operation
                : "unknown?",
            operation.operationName,
            operation.variables,
            result,
        );
    }

    public static event(key: string, payload?: any, issue?: boolean) {
        mixpanel.track(key, payload);
        return TrackerUtil.trackerObject.event(
            key,
            {
                userId: localStorage.getItem("user_id"),
                orgId: localStorage.getItem("organization_id"),
                ...payload,
            },
            issue,
        );
    }

    // event attribute in below method is to track mixpanel event
    public static error(error: any, metaObject: any, event: string = "") {
        if (event) {
            mixpanel.track(event, metaObject);
        }
        return TrackerUtil.trackerObject.handleError(error, metaObject);
    }
}
