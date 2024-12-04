import React from "react";
import { Outlet } from "react-router-dom";
import Scraper from "../modules/scraper";
import ScrapperTextHighlighter from "../modules/scraper/scraper-file-highlighter";
import ScrapedSKUSResults from "../modules/scraper/scraper-sku-results";

const scraperRoutes = [
    {
        path: "/scraper",
        Name: "Scraper",
        element: <Outlet />,
        //list of roles that are allowed to access this route
        acessibleBy: ["admin"],
        showInHeader: true,
        children: [
            {
                path: "",
                element: <Scraper />,
            },
            {
                path: "highlight_results/:jobId",
                element: <ScrapperTextHighlighter />,
            },
            {
                path: "highlight_results/:jobId/results",
                element: <ScrapedSKUSResults />,
            },
            {
                path: ":projectId",
                element: <h2>Scrapping is in Progress</h2>,
            },
        ],
    },
];

export default scraperRoutes;
