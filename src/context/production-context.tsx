import React, { createContext, useContext } from "react";
import { shallowEqual } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { useAppSelector } from "stores/hooks";

const ProductionContext = createContext<any>(null);

interface IProductionProps {
    children: any;
}

export const ProductionProvider = ({ children }: IProductionProps) => {
    const { features, constants } = useAppSelector(
        (state) => ({
            features: state.productionProject.featureAccess,
            constants: state.productionProject.constants,
        }),
        shallowEqual,
    );

    const { projectId } = useParams();
    const location = useLocation();
    const currentPath = location.pathname;

    const hasFeature = (feature: string) => {
        return features?.includes(feature);
    };

    return (
        <ProductionContext.Provider
            value={{
                constants,
                hasFeature,
                projectId,
                isRFPProject: currentPath?.startsWith("/rfp"),
            }}
        >
            {children}
        </ProductionContext.Provider>
    );
};

export const useProductionContext = () => useContext(ProductionContext);
