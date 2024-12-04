import { useQuery } from "@apollo/client";
import ProjectPackage from "./create-edit-package/project-package";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { GET_PROJECT_DETAILS } from "../../stores/projects/details/index/index-queries";

const B2BProjectPackageV2 = () => {
    //Initilization
    const search = useLocation().search;
    const isAlt = new URLSearchParams(search).get("is_alternate") ?? undefined;
    const projectId = new URLSearchParams(search).get("projectId") ?? "";
    const packageId = new URLSearchParams(search).get("packageId") ?? "";
    const nav = useNavigate();

    //States
    const [isLoading, setLoading] = useState<boolean>(true);

    //Queries
    const { data } = useQuery(GET_PROJECT_DETAILS, {
        variables: { projectId },
        onCompleted() {
            setLoading(!isLoading);
        },
    });
    //Hooks
    useEffect(() => {
        if (projectId === "" && packageId === "") nav(-1);
        // eslint-disable-next-line
    }, [projectId, packageId]);

    return (
        <React.Fragment>
            {isLoading ? (
                <LinearProgress />
            ) : (
                <ProjectPackage
                    projectId={projectId}
                    packageId={packageId}
                    isAlt={isAlt}
                    containerVersion={parseFloat(
                        data?.getProjectById?.system_remarks?.container_version ?? "1.0",
                    )
                        .toFixed(1)
                        .toString()}
                    projectName={data?.getProjectById?.name ?? ""}
                />
            )}
        </React.Fragment>
    );
};

export default B2BProjectPackageV2;
