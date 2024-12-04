import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";

type ErrorBoundaryProps = {
    children: React.ReactNode;
    routesInfo?: any;
};

function ErrorBoundaryWrapper({ routesInfo, children }: ErrorBoundaryProps) {
    const [hasError, setHasError] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (hasError) {
            setHasError(false);
        }
    }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ErrorBoundary hasError={hasError} setHasError={setHasError} routesInfo={routesInfo}>
            {children}
        </ErrorBoundary>
    );
}

export default ErrorBoundaryWrapper;
