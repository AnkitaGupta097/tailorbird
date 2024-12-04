import React from "react";
import { Outlet } from "react-router-dom";
import ProjectDetails from "../modules/projects/details";
import Budgeting from "../modules/projects/details/budgeting";
import ProjectsOverview from "../modules/projects/details/projects-overview";
import Projects from "../modules/projects/";
import ActiveProjects from "../modules/projects/active";
import ArchivedProjects from "../modules/projects/archived";
import RfpManager from "modules/projects/details/rfp-manager";
import BidBook from "modules/projects/details/budgeting/bidbook-v2";
import DemandUsers from "modules/projects/details/demand-users";
import ExhA from "modules/projects/details/exh-a";
import ProjectFloorPlanOutlet from "modules/projects/details/projects-floorplans/project-floorplan-outlet";
import ResourceAccess from "modules/projects/resource-access";

const projectsRoutes = [
    {
        path: "/admin-projects",
        Name: "Admin-Projects",
        element: <Outlet />,
        //list of roles that are allowed to access this route
        acessibleBy: ["admin"],
        showInHeader: false,
        children: [
            {
                path: "",
                element: <Projects />,
                children: [
                    {
                        path: "active",
                        element: <ActiveProjects />,
                    },
                    {
                        path: "archived",
                        element: <ArchivedProjects />,
                    },
                ],
            },
            {
                path: ":projectId",
                element: <ProjectDetails />,
                children: [
                    {
                        path: "overview",
                        element: <ProjectsOverview />,
                    },
                    {
                        path: "floorplans",
                        element: <ProjectFloorPlanOutlet />,
                    },
                    {
                        path: "budgeting",
                        element: <Budgeting />,
                    },
                    {
                        path: "sow_ex_a",
                        element: <ExhA />,
                    },
                    {
                        path: "bidbook",
                        element: <BidBook />,
                    },
                    {
                        path: "rfp_manager",
                        element: <RfpManager />,
                    },
                    {
                        path: "demand_users",
                        element: <DemandUsers />,
                    },
                    {
                        path: "resource_access",
                        element: <ResourceAccess />,
                    },
                ],
            },
        ],
    },
];

export default projectsRoutes;
