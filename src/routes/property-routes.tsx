import React from "react";
import { Outlet } from "react-router-dom";
// import ProjectDetails from "../modules/projects/details";
// import Budgeting from "../modules/projects/details/budgeting";
// import ProjectsFloorplans from "../modules/projects/details/projects-floorplans";
// import ProjectsOverview from "../modules/projects/details/projects-overview";
import Properties from "../modules/properties";
import ActiveProjects from "../modules/properties/active";
import ArchivedProjects from "../modules/properties/archived";
import PropertiesOverview from "../modules/properties/details/properties-overview";
import PropertiesDetails from "../modules/properties/details";
import PropertyFloorplans from "../modules/properties/details/floorplan";
import PropertyProjects from "modules/properties/details/property-projects";
import VendorMapping from "modules/properties/details/properties-overview/vendor-mapping";
import JobMapping from "modules/properties/details/properties-overview/job-mapping";
import FloorPlanMapping from "modules/properties/details/properties-overview/floorplan-mapping";
import UnitMapping from "modules/properties/details/properties-overview/unit-mapping";

const propertyRoutes = [
    {
        path: "/admin-properties",
        Name: "Admin-Properties",
        element: <Outlet />,
        //list of roles that are allowed to access this route
        acessibleBy: ["admin"],
        showInHeader: true,
        children: [
            {
                path: "",
                element: <Properties />,
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
                path: ":propertyId",
                element: <PropertiesDetails />,
                children: [
                    {
                        path: "overview",
                        element: <Outlet />,
                        children: [
                            {
                                path: "",
                                element: <PropertiesOverview />,
                            },
                            {
                                path: "floorplan-map",
                                element: <FloorPlanMapping />,
                            },
                            {
                                path: "unit-map",
                                element: <UnitMapping />,
                            },
                        ],
                    },
                    {
                        path: "floorplans",
                        element: <PropertyFloorplans />,
                    },
                    {
                        path: "projects",
                        element: <PropertyProjects />,
                    },
                    {
                        path: "vendor-map",
                        element: <VendorMapping />,
                    },
                    {
                        path: "job-map",
                        element: <JobMapping />,
                    },
                ],
            },
        ],
    },
];

export default propertyRoutes;
