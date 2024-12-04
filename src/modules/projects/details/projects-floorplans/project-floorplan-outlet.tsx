import React, { useEffect } from "react";
import ProjectsFloorplans from ".";
import { useAppSelector } from "stores/hooks";
import { GrowthBook, GrowthBookProvider, useFeature } from "@growthbook/growthbook-react";
import NonUIMixtable from "./non-ui-mix-table";
import { useParams } from "react-router-dom";
import { IUser } from "App";

const growthbook = new GrowthBook({
    enableDevMode: true,
});

const ProjectFloorPlanOutlet = () => {
    const { projectDetails, featureFlags } = useAppSelector((state: any) => ({
        projectDetails: state.projectDetails.data,
        featureFlags: state.common.featureFlags.data,
    }));
    const newFeature = useFeature("new_common_area_and_exterior_mix_table").on;
    const projectType = (projectDetails?.projectType ?? "") as string;
    const { projectId } = useParams();
    const { email }: IUser = JSON.parse(localStorage.getItem("user_details") || "{}");

    useEffect(() => {
        growthbook.setFeatures(featureFlags);
        growthbook.setAttributes({
            project_id: projectId,
            email: email,
        });
    }, [projectId, featureFlags, email]);

    if (newFeature && ["common_area", "exterior"].includes(projectType.toLowerCase())) {
        return (
            <GrowthBookProvider growthbook={growthbook}>
                <NonUIMixtable />
            </GrowthBookProvider>
        );
    }
    return <ProjectsFloorplans />;
};

export default ProjectFloorPlanOutlet;
