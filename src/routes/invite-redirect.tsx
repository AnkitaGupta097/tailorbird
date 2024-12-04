import React from "react";
import { Outlet } from "react-router-dom";
import InviteRedirectConfirmation from "components/invite-redirect";

const inviteRedirect = [
    {
        path: "/invite",
        element: <Outlet />,
        acessibleBy: ["all"],
        showInHeader: false,
        children: [
            {
                path: "",
                element: <InviteRedirectConfirmation />,
            },
        ],
    },
];

export default inviteRedirect;
