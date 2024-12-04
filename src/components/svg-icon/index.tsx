import SvgIcon from "@mui/material/SvgIcon";
import React from "react";

interface IBaseSvgIcon {
    svgPath: any;
    [v: string]: any;
}

const BaseSvgIcon = ({ svgPath, ...props }: IBaseSvgIcon) => {
    return <SvgIcon {...props}>{svgPath}</SvgIcon>;
};

export default BaseSvgIcon;
