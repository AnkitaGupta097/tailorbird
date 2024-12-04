import React from "react";
import ProjectsDemand from "modules/projects/demand";
import { Outlet } from "react-router-dom";
import SingleProject from "modules/single-project/index";

const consumerProjects = [
    {
        path: "/consumer/projects",
        Name: "projects",
        element: <Outlet />,
        //list of roles that are allowed to access this route
        acessibleBy: ["asset_manager", "construction_operations", "admin"],
        showInHeader: true,
        children: [
            {
                path: "",
                element: <ProjectsDemand />,
                children: [],
            },
            {
                path: ":projectId",
                element: <SingleProject />,
                children: [],
            },
        ],
    },
];

export default consumerProjects;
