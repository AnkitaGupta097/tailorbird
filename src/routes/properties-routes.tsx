import React from "react";
import { Outlet } from "react-router-dom";
import PropertiesConsumer from "../modules/properties-consumer";
import PropertyViewPage from "../modules/properties-consumer/details/index";

const propertiesRoutes = [
    {
        path: "/properties-consumer",
        Name: "Properties",
        element: <Outlet />,
        //list of roles that are allowed to access this route
        acessibleBy: ["asset_manager", "construction_operations", "admin"],
        showInHeader: true,
        children: [
            {
                path: "",
                element: <PropertiesConsumer />,
                children: [],
            },
            {
                path: ":propertyId",
                element: <PropertyViewPage />,
                children: [],
            },
        ],
    },
];

export default propertiesRoutes;
