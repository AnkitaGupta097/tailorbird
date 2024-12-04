import React from "react";
export interface Column {
    id: "name" | "ownership" | "uploaded by" | "date" | "description" | "file name" | "status";
    label: string;
    minWidth?: string;
    align?: "right" | "center" | "inherit" | "left" | "justify" | undefined;
    // eslint-disable-next-line no-unused-vars
    format?: (value: number) => string;
}

export interface INavigationBar {
    fileName: string;
    backLink?: string;
    onClose?: Function;
    onSearch?: Function;
    skus?: string[];
    content: any;
    margin?: string;
}

export interface ITextHighlight {
    text?: string;
    highlightedTexts?: string[];
    selectedValue?: string;
    addToHighlighted?: Function;
}

export interface IEditableTextField {
    text?: string;
    onEdit?: Function;
    onDelete?: Function;
    index: number;
    setSelected?: React.Dispatch<React.SetStateAction<string>>;
    isEditableInitially?: boolean;
}

export interface IPoint {
    x: number;
    y: number;
}

export interface IScrapingStatusResponse {
    status: string;
    completed: number;
    failed: number;
    total: number;
}

export interface ITextHighlightGridProps {
    highlightedText: Array<string>;
    setHighlightedText: React.Dispatch<React.SetStateAction<Array<string>>>;
    fileContent: string;
}

export interface IScraperDialog {
    open: boolean;
    onClose: Function;
    message: string;
}
