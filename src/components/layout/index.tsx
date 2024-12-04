import React from "react";
import { Grid } from "@mui/material";
import Header from "../header";
import BaseHeader from "components/base-header";
import { useLocation } from "react-router-dom";
// import { useFeature } from "@growthbook/growthbook-react";
// import { FeatureFlagConstants } from "utils/constants";
import { useNavigate } from "react-router-dom";
import { NOTIFICATION_TYPE } from "utils/constants";
import { productionTabUrl } from "components/production/constants";
interface ILayoutProps {
    children: any;
    routesInfo?: any;
}

const Layout = ({ children, routesInfo }: ILayoutProps) => {
    const role = localStorage.getItem("role");
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location?.pathname.trim().split("/")[1];
    // const hasPropertiesFeature = useFeature(FeatureFlagConstants.PROPERTY_FEATURE).on;
    //this is temporary solution because paths have been changed from projects to admin-projects and properties to admin-properties
    if (currentPath === "projects" || currentPath === "properties") {
        let path: string[] | string = location.pathname.trim().split("/");
        path[1] = `admin-${currentPath}`;
        path = path.join("/");
        console.log("path", path);
        navigate(path);
    }

    // console.log({ hasPropertiesFeature });
    const onNotificationClick = (feedData: any, isRFPProject: boolean = false) => {
        const pathData = JSON.parse(feedData.data);
        const type = feedData.type;
        const baseURL = `${productionTabUrl(pathData?.project_id, isRFPProject)}`;

        const navigationData = { path: "", stateData: {} };
        if (NOTIFICATION_TYPE.UNIT.includes(type)) {
            navigationData.path = `${baseURL}/units`;
            navigationData.stateData = { unitId: pathData.reno_unit_id };
        } else if (NOTIFICATION_TYPE.APPROVALS.includes(type)) {
            navigationData.path = `${baseURL}/approvals`;
            navigationData.stateData = {
                unitId: pathData.reno_unit_id,
                isReviewed: false,
                scopeApprovalId: pathData.scope_approval_id,
            };
        } else if (NOTIFICATION_TYPE.REVIEWED.includes(type)) {
            navigationData.path = `${baseURL}/approvals`;
            navigationData.stateData = {
                unitId: pathData.reno_unit_id,
                isReviewed: true,
                scopeApprovalId: pathData.id,
            };
        } else if (NOTIFICATION_TYPE.INVOICE.includes(type)) {
            navigationData.path = `${baseURL}/invoices`;
            navigationData.stateData = { invoiceId: pathData.invoice_id };
        }
        if (navigationData.path) {
            navigate(navigationData.path, { state: { ...navigationData.stateData } });
        }
    };

    return (
        <Grid container className="Layout-container">
            {currentPath !== "rfp" && (
                <Header
                    routesInfo={routesInfo.filter(
                        (route: { showInHeader: boolean; path: string }) =>
                            route.showInHeader === true &&
                            !(route.path.startsWith("/rfp") && role === "admin"),
                    )}
                    onNotificationClick={(feedItem: any) => onNotificationClick(feedItem.data)}
                />
            )}

            <Grid item md={12}>
                {currentPath === "rfp" && (
                    <BaseHeader
                        showDataSyncStatus={true}
                        routesInfo={routesInfo.filter(
                            (route: { showInHeader: boolean; path: string }) =>
                                route.showInHeader === true && route.path.startsWith("/rfp"),
                        )}
                        onNotificationClick={(feedItem: any) =>
                            onNotificationClick(feedItem.data, true)
                        }
                    />
                )}
            </Grid>
            <Grid component="main" item md={12} sx={{ backgroundColor: "#FAFAFB" }}>
                {children}
            </Grid>
        </Grid>
    );
};
export default Layout;
