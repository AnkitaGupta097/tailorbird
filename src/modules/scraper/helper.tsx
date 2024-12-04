import React from "react";
import { SvgIcon } from "@mui/material";
import AppTheme from "../../styles/theme";

export const getBgColor = (status: string) => {
    switch (status) {
        case "submitted":
            return AppTheme.jobStatus.initiated.backgroundColor;
        case "success":
            return AppTheme.jobStatus.success.backgroundColor;
        case "completed":
            return AppTheme.jobStatus.success.backgroundColor;
        case "progress":
            return AppTheme.jobStatus.pending.backgroundColor;
        case "error":
            return AppTheme.jobStatus.error.backgroundColor;
    }
};

export const getTextColor = (status: string) => {
    switch (status) {
        case "submitted":
            return AppTheme.jobStatus.initiated.textColor;
        case "success":
            return AppTheme.jobStatus.success.textColor;
        case "completed":
            return AppTheme.jobStatus.success.textColor;
        case "progress":
            return AppTheme.jobStatus.pending.textColor;
        case "error":
            return AppTheme.jobStatus.error.textColor;
    }
};

export const SuccessIcon = (props: any) => {
    return (
        <SvgIcon {...props}>
            <svg
                width={props?.width}
                height={props?.height}
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="10.7148" cy="10.5" r="9.5" stroke={props?.color} />
                <path
                    d="M15.7148 7.34116L8.8577 14.5L5.71484 11.2189L6.52056 10.3777L8.8577 12.8117L14.9091 6.5L15.7148 7.34116Z"
                    fill={props?.color}
                />
            </svg>
        </SvgIcon>
    );
};
