import React from "react";
import { Outlet } from "react-router-dom";
import B2BProjectPackageV2 from "../modules/package-manager";
import LandingPage from "../modules/package-manager/landing-page";

const packagesRoutes = [
    {
        path: "/packages",
        Name: "Packages",
        element: <Outlet />,
        showInHeader: true,
        //list of roles that are allowed to access this route
        acessibleBy: ["admin"],
        children: [
            {
                path: "",
                element: <LandingPage />,
            },

            {
                path: "new",
                element: <B2BProjectPackageV2 />,
            },
            {
                path: ":packageid",
                element: <B2BProjectPackageV2 />,
                children: [
                    {
                        path: "edit",
                        element: <B2BProjectPackageV2 />,
                    },
                ],
            },
            {
                path: "edit",
                element: <B2BProjectPackageV2 />,
            },
        ],
    },
];

export default packagesRoutes;
