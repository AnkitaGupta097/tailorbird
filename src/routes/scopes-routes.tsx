import React from "react";
import { Outlet } from "react-router-dom";

import Scopes from "../modules/scopes";

const scopesRoutes = [
    {
        path: "/scopes",
        Name: "Scopes",
        element: <Outlet />,
        showInHeader: true,
        //list of roles that are allowed to access this route
        acessibleBy: ["admin"],
        children: [
            {
                path: "",
                element: <Scopes />,
            },
            {
                path: ":version/:id/edit",
                element: <Scopes />,
            },
            {
                path: ":version/new",
                element: <Scopes />,
            },
        ],
    },
];

export default scopesRoutes;
