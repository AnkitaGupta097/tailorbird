import React from "react";
import { Tabs, Tab, Typography, styled, TabProps, Stack } from "@mui/material";
import AppTheme from "../../styles/theme";

const StyledTab = styled(Tab)<TabProps>(({ theme }) => ({
    color: theme.palette.text.primary,
}));

interface IBaseTabs {
    currentTab: string;
    onTabChanged: any;
    tabList: ITab[];
    [v: string]: any;
    otherStyles?: any;
}

interface ITab {
    value: any;
    label: string;
    enable?: boolean;
    icon?: boolean;
}

const BaseTabs = ({ currentTab, onTabChanged, tabList, otherStyles, ...others }: IBaseTabs) => {
    const a11yProps = (index: number) => {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    };

    return (
        <Tabs
            value={currentTab}
            onChange={onTabChanged}
            variant="scrollable"
            aria-label="base tabs"
            TabIndicatorProps={{
                style: { background: others?.tabColor ? others?.tabColor : AppTheme.tab.divider },
            }}
            {...others}
            sx={{ marginTop: "auto", ...otherStyles }}
        >
            {tabList.map((tab, idx) => {
                return (
                    <StyledTab
                        label={
                            <Stack direction={"row"} spacing={2} alignItems={"center"}>
                                <Typography
                                    variant={`${currentTab === tab.value ? "activeTab" : "tab"}`}
                                >
                                    {tab?.label}
                                </Typography>
                                {tab?.icon && tab?.icon}
                            </Stack>
                        }
                        value={tab?.value}
                        {...a11yProps(idx)}
                        key={idx}
                        disabled={tab?.enable !== undefined ? !tab?.enable : false}
                    />
                );
            })}
        </Tabs>
    );
};

export default BaseTabs;
