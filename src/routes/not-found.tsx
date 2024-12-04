import React from "react";
import PageNotFound from "utils/error-pages/PageNotFound";
const notFoundRoute = [
    {
        path: "/404",
        element: <PageNotFound />,
        acessibleBy: ["all"],
        showInHeader: false,
    },
];

export default notFoundRoute;
