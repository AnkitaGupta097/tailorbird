import React from "react";
import { useAppSelector } from "stores/hooks";
import RfpManager1 from "./rfp-manager-1.0";
import RfpManager2 from "./rfp-manager-2.0";

const RfpManager = () => {
    const { projectDetails } = useAppSelector((state) => ({
        projectDetails: state.projectDetails.data,
    }));

    const rfp_project_version =
        parseFloat((projectDetails as any)?.system_remarks?.rfp_project_version)
            .toFixed(1)
            .toString() ?? "1.0";

    return rfp_project_version !== "2.0" ? <RfpManager1 /> : <RfpManager2 />;
};

export default RfpManager;
