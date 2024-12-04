import React from "react";
import { Outlet } from "react-router-dom";
import productionRoutes from "./production-routes";
import ProductionProjectsDashboard from "modules/rfp-manager/production-projects-dashboard";
import Production from "components/production";

const rfpProductionRoutes = [
    {
        path: "/rfp/:role/:userID/production/projects",
        Name: "Production",
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
                element: <ProductionProjectsDashboard />,
            },
            {
                path: ":projectId",
                element: <Production />,
                children: [...productionRoutes[0].children],
            },
        ],
    },
];

export default rfpProductionRoutes;
