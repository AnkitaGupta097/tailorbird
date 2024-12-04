import Layout from "components/layout";
import React from "react";
import AppRoutes from "./routes";

interface IRouterWrapperProps {
    routesInfo: any;
}

function RouterWrapper({ routesInfo }: IRouterWrapperProps) {
    return (
        <Layout routesInfo={routesInfo}>
            <AppRoutes routesInfo={routesInfo} />
        </Layout>
    );
}
export default React.memo(RouterWrapper);
