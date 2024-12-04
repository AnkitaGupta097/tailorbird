import ContainerAdminInterface from "components/container-admin-interface";
import CostCodeMapper from "components/cost-code-mapper";
import PropertyTagging from "components/projects-v1-migration";
import ProjectMigration from "components/projects-v1-migration/project-migration";
import React from "react";
import { Navigate } from "react-router-dom";

export const invalidRoute = {
    path: "*",
    acessibleBy: ["all"],
    showInHeader: false,
    element: <Navigate to="/404" replace />,
};

const otherRoutes = [
    {
        path: "/container",
        acessibleBy: ["all"],
        showInHeader: false,
        element: <ContainerAdminInterface />,
    },
    {
        path: "/cost-code-mapper",
        acessibleBy: ["all"],
        showInHeader: false,
        element: <CostCodeMapper />,
    },
    {
        path: "/property-tagging",
        acessibleBy: ["all"],
        showInHeader: false,
        element: <PropertyTagging />,
    },
    {
        path: "/property-data-backfill",
        acessibleBy: ["all"],
        showInHeader: false,
        element: <ProjectMigration />,
    },
    invalidRoute,
];

export default otherRoutes;
