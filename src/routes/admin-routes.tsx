import AdminPanel from "modules/admin-portal";
import ContractorsTab from "modules/admin-portal/contractors";
import ContractorsDetail from "modules/admin-portal/contractors/contractors-detail";
import OwnershipTab from "modules/admin-portal/ownership";
import ConfigurationEdit from "modules/admin-portal/ownership/edit-configuration";
import UserTab from "modules/admin-portal/users";
import OwnershipEdit from "modules/admin-portal/ownership/ownership-edit";
import React from "react";
import { Outlet } from "react-router-dom";

const adminRoutes = [
    {
        path: "/admin",
        element: <Outlet />,
        acessibleBy: ["admin", "contractor_admin"],
        Name: "Admin",
        showInHeader: true,
        children: [
            {
                path: "",
                element: <AdminPanel />,
                children: [
                    {
                        path: "users",
                        element: <UserTab />,
                    },
                    {
                        path: "contractors",
                        element: <ContractorsTab />,
                    },
                    // {
                    //     path: "",
                    //     element: <Outlet />,
                    //     children: [
                    {
                        path: "ownerships",
                        element: <OwnershipTab />,
                        children: [],
                    },
                    {
                        path: "ownerships/:organizationId",
                        element: <OwnershipEdit />,
                        children: [],
                    },
                    {
                        path: "ownerships/:organisationId/configuration/:organisationContainerId",
                        element: <ConfigurationEdit />,
                        children: [],
                    },
                    // ],
                    // },
                    {
                        path: ":contractorId",
                        element: <ContractorsDetail />,
                    },
                ],
            },
        ],
    },
];

export default adminRoutes;
