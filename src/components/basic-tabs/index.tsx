import { Box, SxProps, Tab, Tabs } from "@mui/material";
import React, { ReactNode, useState } from "react";
import AppTheme from "styles/theme";

interface ITabPanel {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface ITabs {
    tabs: {
        label: string;
        content: ReactNode;
    }[];
    labelStyle?: SxProps;
    tabListStyle?: SxProps;
    showNav?: boolean | "auto";
}

const TabPanel: React.FC<ITabPanel> = ({ children, value, index, ...other }) => (
    <div hidden={value !== index} {...other}>
        {value === index && <Box>{children}</Box>}
    </div>
);

const BasicTabs: React.FC<ITabs> = ({ tabs, labelStyle, tabListStyle, showNav }) => {
    const [value, setValue] = useState<number>(0);

    const handleChange = (e: any, newValue: number) => setValue(newValue);

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    variant="scrollable"
                    onChange={handleChange}
                    selectionFollowsFocus
                    textColor="inherit"
                    scrollButtons={showNav}
                    sx={tabListStyle}
                >
                    {tabs.map(({ label }, idx) => (
                        <Tab key={`${idx}-${label}`} label={label} value={idx} sx={labelStyle} />
                    ))}
                </Tabs>
            </Box>
            {tabs.map(({ label, content }, idx) => (
                <TabPanel key={`${label}-${idx}`} index={idx} value={value}>
                    {content}
                </TabPanel>
            ))}
        </Box>
    );
};

BasicTabs.defaultProps = {
    tabListStyle: {
        borderBottom: `2px solid ${AppTheme.border.divider}`,
        scrollBehavior: "smooth",
        maxWidth: "100%",
    },
    labelStyle: {
        fontFamily: "Roboto",
        fontWeight: 500,
        fontSize: "18px",
        color: "black",
        textTransform: "none",
    },
    showNav: true,
};

export default BasicTabs;
