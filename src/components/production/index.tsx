import React from "react";
import { ProductionProvider } from "context/production-context";
import ProductionTabs from "./production-tabs";

const Production = () => {
    return (
        <ProductionProvider>
            <ProductionTabs />
        </ProductionProvider>
    );
};

export default Production;
