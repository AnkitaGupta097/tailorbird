import React from "react";
import Production from "components/production";
import Approvals from "components/production/approvals";
import Settings from "components/production/settings";
import Units from "components/production/units";
import Invoices from "components/production/invoices";
import Agreements from "components/production/agreements";
import UnitPage from "components/production/units/unit-page";
import AgreementDetails from "components/production/agreements/agreement-details";
import PriceEntryTable from "modules/rfp-manager/pricing-entry-table";
import { Outlet } from "react-router-dom";
import LiveAgreement from "components/production/agreements/live-agreements";
import FloorplanPriceEntry from "modules/rfp-manager/floorplan-pricing-entry-table";
import UnitSchedulerCM from "components/production/unit-scheduler-cm";
import { AdminTabs } from "components/production/admin/admin-tabs";

const productionRoutes = [
    {
        path: "/consumer/projects/:projectId/production",
        element: <Production />,
        acessibleBy: ["all"],
        showInHeader: false,
        children: [
            {
                path: "unit-scheduler",
                element: <UnitSchedulerCM />,
            },
            {
                path: "admin",
                element: <AdminTabs />,
            },
            {
                path: "units",
                element: <Outlet />,
                exact: true,
                children: [
                    {
                        path: "",
                        element: <Units />,
                    },
                    {
                        path: ":unitId",
                        element: <UnitPage />,
                    },
                ],
            },
            {
                path: "settings",
                element: <Settings />,
            },
            {
                path: "approvals",
                element: <Approvals />,
            },
            {
                path: "invoices",
                element: <Invoices />,
            },
            {
                path: "agreements",
                element: <Outlet />,
                children: [
                    {
                        path: "",
                        element: <Agreements />,
                    },
                    {
                        path: ":agreementId/:contractorId/:contractorName",
                        element: <Outlet />,
                        children: [
                            {
                                path: "",
                                element: <AgreementDetails />,
                            },
                            {
                                path: ":floorplanName",
                                element: <FloorplanPriceEntry />,
                            },
                            {
                                path: "view/:category",
                                element: <PriceEntryTable />,
                            },
                        ],
                    },
                    {
                        path: "live_agreement",
                        element: <LiveAgreement />,
                    },
                ],
            },
        ],
    },
];

export default productionRoutes;
