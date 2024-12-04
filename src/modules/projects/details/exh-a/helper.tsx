import React from "react";
import { ReactComponent as PDF } from "assets/icons/pdf.svg";
import { ReactComponent as DOC } from "assets/icons/Doc.svg";

/**
 * Sleep for a specified duration.
 *
 * @param {number} milliseconds - The duration to sleep in milliseconds.
 * @returns {Promise<void>} - A Promise that resolves after the specified duration.
 */
export const sleep = (milliseconds: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
};

/**
 * Gets the corresponding icon for a given file based on its extension.
 *
 * @param {string} filename - The name of the file, including the extension.
 * @returns {React.ReactNode} - The React component representing the file icon.
 */
export const getFileIcon = (filename: any): React.ReactNode => {
    const fileExtension = filename.split(".").pop().toLowerCase();
    switch (fileExtension) {
        case "doc":
            return <DOC />;
        case "docx":
            return <DOC />;
        case "pdf":
            return <PDF />;
        default:
            return <PDF />;
    }
};
