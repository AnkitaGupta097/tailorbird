import React from "react";
import { ISingleProduct } from "../../../../stores/scraper/service/scraper-interface";

export interface IScrappedResults {
    sku: any;
    handleProductSelect: Function;
    onChange: Function;
    allSubCats: string[];
    isExpanded: boolean;
    onAccordionExpand: Function;
    jobStatus: string;
    data: {
        [x: string]: any[];
    }[];
    setData: React.Dispatch<
        React.SetStateAction<
            {
                [x: string]: any[];
            }[]
        >
    >;
    deleteList: any;
    setDeleteList: React.Dispatch<React.SetStateAction<never[]>>;
}

export interface ISingleScrapedResult {
    product: ISingleProduct[];
    handleProductSelect: Function;
    modelNumber: string;
    onChange: Function;
    allSubCats: string[];
    data: {
        [x: string]: any[];
    }[];
    setData: React.Dispatch<
        React.SetStateAction<
            {
                [x: string]: any[];
            }[]
        >
    >;
    deleteList: any;
    setDeleteList: React.Dispatch<React.SetStateAction<never[]>>;
}

export interface IScrapingStatusResponse {
    status: string;
    completed: number;
    failed: number;
    total: number;
}

export interface ISubcategorySelectionComponentProps {
    allSubCats: any;
    currentVal: any;
    item: any;
    onChange: Function;
    _id: number;
    not_implemented?: boolean;
    styles?: any;
    isError?: any;
}
