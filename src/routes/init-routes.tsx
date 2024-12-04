import React from "react";
import { Outlet } from "react-router-dom";
import Init from "../components/init";

const initRoutes = [
    {
        path: "/callback",
        element: <Outlet />,
        acessibleBy: ["all"],
        showInHeader: false,
        children: [
            {
                path: "",
                element: <Init />,
            },
        ],
    },
];

export default initRoutes;
