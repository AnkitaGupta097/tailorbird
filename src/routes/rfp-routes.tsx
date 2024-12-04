import PriceEntryTable from "modules/rfp-manager/pricing-entry-table";
import PriceSummaryTable from "modules/rfp-manager/pricing-summary-table";
import ProjectDetails from "modules/rfp-manager/project-details";
import RfpProjects from "modules/rfp-manager/project-list";
import React from "react";
import { Outlet } from "react-router-dom";
import RfpManager from "../modules/rfp-manager";
import ProjectsDashboard from "modules/rfp-manager/project-dashboard";
import ProjectDetailsV2 from "modules/rfp-manager/project-details-v2";
import FloorplanPriceEntry from "modules/rfp-manager/floorplan-pricing-entry-table";
import CollaboratorsList from "modules/rfp-manager/collaborators";

const rfpRoutes = [
    {
        path: "/rfp",
        Name: "Bids",
        element: <Outlet />,
        showInHeader: true,
        //list of roles that are allowed to access this route
        acessibleBy: [
            "admin",
            "contractor_admin",
            "estimator",
            "operator",
            "construction_manager",
            "project_admin",
        ],
        children: [
            {
                path: "",
                element: <RfpManager />,
            },
            {
                path: ":role/:userID/projects",
                element: <RfpProjects />,
            },
            {
                path: ":role/:userID/projects/v2",
                element: <ProjectsDashboard />,
            },
            {
                path: ":role/:userID/projects/:projectId",
                element: <Outlet />,
                children: [
                    {
                        path: "",
                        element: <ProjectDetails />,
                    },
                    {
                        path: "v2",
                        element: <Outlet />,
                        children: [
                            {
                                path: "",
                                element: <ProjectDetailsV2 />,
                            },
                            {
                                path: ":floorplanName",
                                element: <FloorplanPriceEntry />,
                            },
                        ],
                    },
                    {
                        path: "collaborators",
                        element: <CollaboratorsList />,
                    },
                    {
                        path: "price",
                        element: <Outlet />,
                        children: [
                            {
                                path: "",
                                element: <PriceSummaryTable />,
                            },
                            {
                                path: ":category",
                                element: <PriceEntryTable />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

export default rfpRoutes;
